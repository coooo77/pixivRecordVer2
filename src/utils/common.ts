import chalk from 'chalk'

/** types */
import { LogMsgType } from '../interfaces/common.js'

export default {
  msg(msg: string, msgType: LogMsgType = 'info') {
    const { log } = console

    const type = ` ${msgType.toUpperCase()} `

    switch (msgType) {
      case 'warn':
        log(chalk.bgYellow(type), chalk.yellow(msg))
        break
      case 'info':
        log(chalk.bgBlue(type), chalk.blue(msg))
        break
      case 'success':
        log(chalk.bgGreen(type), chalk.green(msg))
        break
      case 'fail':
        log(chalk.bgRed(type), chalk.red(msg))
        break
      case 'error':
        log(chalk.bgRed(type), chalk.bgRed.yellow(msg))
        break
      default:
        break
    }
  },

  wait: (seconds: number) => new Promise((resolve) => setTimeout(resolve, seconds * 1000)),

  isProcessRunning(pid: number) {
    try {
      process.kill(pid, 0)
      return true
    } catch {
      return false
    }
  },
}
