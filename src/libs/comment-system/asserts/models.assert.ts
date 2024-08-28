import { Comment } from '../model/comment.model'
import { isString } from './general.assert'

export function isComment(obj: unknown): obj is Comment {
  const { user, data } = (obj || {}) as Comment

  return Boolean(isString(user) && isString(data))
}
