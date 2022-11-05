import fs from 'fs'
import path from 'path'
import cp from 'child_process'
import { AxiosError } from 'axios'

import api from './axios'
import common from './common'
import fileSys from './fileSys'

import { AppSetting } from '@/interfaces/common'
import { RecordingUsers } from '@/interfaces/main'
import { Notifications, Notification, Live } from '@/interfaces/pixiv'

class Main {
  runtimeCount = 0

  authorizeRetry = 0

  _recordList: RecordingUsers = {}

  _appSetting: AppSetting | null = null

  isRecordUpdated: boolean = false

  get appSetting() {
    return this._appSetting || fileSys.getAppSetting()
  }

  set appSetting(setting: AppSetting) {
    this._appSetting = setting
  }

  get recordList() {
    return this._recordList
  }

  set recordList(value: RecordingUsers) {
    fileSys.saveJSONFile(fileSys.modalPath, value)

    this._recordList = value
  }

  async start() {
    common.msg(`Check online list at ${new Date().toLocaleString()} for ${++this.runtimeCount} times`)

    const { checkStreamInterval } = this.appSetting

    await this.fetchAndRecord()

    setTimeout(this.start.bind(this), checkStreamInterval * 1000)
  }

  async init() {
    // calibrate recordList
    const recordList = fileSys.getModal()

    const onlineList = await this.getOnlineList()

    const onlineMap = onlineList.reduce((acc, cur) => {
      acc[cur.user.unique_name] = true

      return acc
    }, {} as Record<string, boolean>)

    const modal = Object.entries(recordList)

    for (const [user_id, OnlineUser] of modal) {
      if (!onlineMap[+user_id]) delete recordList[+user_id]
    }

    this._recordList = recordList
  }

  async fetchAndRecord() {
    const setting = this.appSetting

    const onlineList = await this.getOnlineList()

    const followList = onlineList.filter((user) => user.type === 'follower_live')

    for (const notify of followList) {
      const { unique_name, name } = notify.user

      const isBlockList = setting.blockList.find((user) => user === unique_name || user === name)

      const isRecording = this.recordList[unique_name]

      if (isRecording) common.msg(`${name}(${unique_name}) is online`)

      if (isRecording || isBlockList) continue

      this.recordStream(notify)
    }
  }

  recordStream({ target, user }: Notification) {
    const isCollaboration = user.pixiv_user_id !== target.live.owner.user.pixiv_user_id

    const batchName = `${isCollaboration ? `${Date.now()}-` : ``}${user.unique_name}.bat`

    const batchPath = path.join('batch', batchName)

    if (isCollaboration || !fs.existsSync(batchPath)) {
      const cmd = this.getCmd(target.live, isCollaboration)

      const { dir } = path.parse(batchPath)

      fileSys.makeDirIfNotExist(dir)

      fs.writeFileSync(batchPath, cmd)
    }

    const task = cp.spawn('cmd.exe', ['/c', batchPath], { detached: true, shell: true })

    const recordList = this.recordList

    recordList[user.unique_name] = {
      pid: task.pid,
      name: user.name,
      unique_name: user.unique_name,
      startAt: new Date().toLocaleString(),
    }

    this.recordList = recordList

    task.on('spawn', () => {
      common.msg(`${user.name}(${user.unique_name}) is online, start to record`, 'success')
    })

    task.on('close', (code) => {
      common.msg(`${user.name}(${user.unique_name}) is offline`)

      const latestList = fileSys.getModal()

      if (!latestList[user.unique_name]) return

      delete latestList[user.unique_name]

      this.recordList = latestList
    })
  }

  async getOnlineList(): Promise<Notification[]> {
    try {
      const res = await api.get<Notifications>('https://sketch.pixiv.net/api/notifications.json')

      return res.data.data.notifications
    } catch (error) {
      const err = error as AxiosError

      this.authorizeRetry++

      if (err.response?.status === 401 && this.authorizeRetry < 6) {
        fileSys.clearFolder('batch')

        await common.wait(5)

        return await this.getOnlineList()
      }

      throw error
    }
  }

  getCmd({ owner, id, user: target }: Live, isCol: boolean) {
    const {
      recordSetting: { maxTryTimes, reTryInterval, saveFolder, prefix },
    } = this.appSetting

    const { sessionId, deviceToken } = fileSys.getDevTokenSesId()

    const url = `https://sketch.pixiv.net/@${owner.user.unique_name}/lives/${id}`

    const config = `--pixiv-sessionid "${sessionId}" --pixiv-devicetoken "${deviceToken}" --pixiv-purge-credentials"`

    const colSetting = `${isCol ? `--pixiv-performer ${target.unique_name} ` : ''}`

    const filename = `${saveFolder}\\${prefix}${target.unique_name}_live_pixiv_%TodayYear%%TodayMonthP0%%TodayDayP0%_%hour%%time:~3,2%%time:~6,2%.ts`

    const cmd = `streamlink ${config} ${colSetting} ${url} best -o ${filename}`

    return `
    @echo off\r
    set count=0\r
    :loop\r
    set hour=%time:~0,2%\r
    set TodayYear=%date:~0,4%\r
    set TodayMonthP0=%date:~5,2%\r
    set TodayDayP0=%date:~8,2%\r
    if "%hour:~0,1%" == " " set hour=0%hour:~1,1%\r
    set /a count+=1\r
    echo [CountDown] Loop for ${maxTryTimes} times, try %count% times ...\r
    ${cmd}\r
    if "%count%" == "${maxTryTimes}" exit\r
    echo [CountDown] count down for ${reTryInterval} sec...\r
    @ping 127.0.0.1 -n ${reTryInterval} -w 1000 > nul\r
    goto loop
    `
  }
}

export default new Main()