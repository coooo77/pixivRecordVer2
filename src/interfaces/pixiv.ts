import { StringTypeNum } from './common.js'

/**
 * follow - user who follows you
 *
 * follower_live - user you followed
 */
export type UserType = 'follower_live' | 'follow'

export interface PixivUser {
  id: number
  /** name to display */
  name: string
  /** 'user_xxxx1234' */
  unique_name: string
  pixiv_user_id: number
}

export interface Notification {
  id: StringTypeNum
  type: UserType
  /** followed user */
  user: PixivUser
  target: { live: Live }
}

export interface Live {
  /** live id for url */
  id: StringTypeNum
  performers: Performers[]
  /** who host the stream */
  owner: { user: PixivUser }
  user: PixivUser
}

export interface Performers {
  /** collaborate streamer */
  user: PixivUser
}

export interface Notifications {
  data: {
    notifications: Notification[]
  }
}
