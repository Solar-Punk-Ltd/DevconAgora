export interface CommentRequest {
  user: string
  data: string
  timestamp?: number
}
export interface Comment extends CommentRequest {
  timestamp: number
}
