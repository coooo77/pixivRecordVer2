import { PixivUser } from './pixiv.js'

export interface OnlineUser extends Pick<PixivUser, 'unique_name' | 'name'> {
  pid?: number
  startAt: string
}

export type RecordingUsers = Record<PixivUser['unique_name'], OnlineUser>
