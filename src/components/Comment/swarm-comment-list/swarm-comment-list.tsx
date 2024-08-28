import { Comment } from "../../../libs/comment-system/model/comment.model"
import styles from "./swarm-comment-list.module.scss"

export interface SwarmCommentSystemProps {
  comments: Comment[]
  className?: string
}

export default function SwarmCommentList({
  comments,
  className,
}: SwarmCommentSystemProps) {
  return (
    <div className={`${styles.swarmCommentList} ${className}`}>
      {comments.map(({ user, data, timestamp }, index) => (
        <div key={index}>
          <p>
            <strong>{user}</strong> on {new Date(timestamp).toDateString()}
          </p>
          <p>{data}</p>
        </div>
      ))}
    </div>
  )
}
