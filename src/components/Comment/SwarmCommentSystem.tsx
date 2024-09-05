import { Comment, CommentRequest } from "../../libs/comment-system/model/comment.model";
import { readComments, writeComment } from "../../libs/comment-system/comments";
import SwarmCommentList from "./swarm-comment-list/swarm-comment-list";
import { useEffect, useState } from "react";
import SwarmCommentForm from "./swarm-comment-form/swarm-comment-form";
import { Signer } from "@ethersphere/bee-js";

/**
 * stamp - Postage stamp ID. If ommitted a first available stamp will be used.
 * identifier - Resource identifier. If not sepcified it's calculated from bzz path.
 * beeApiUrl - Bee API URL, default http://localhost:1633
 * beeDebugApiUrl - Bee Debug API URL, default http://localhost:1635
 */
export interface SwarmCommentSystemProps {
  stamp?: string;
  identifier?: string;
  beeApiUrl?: string;
  beeDebugApiUrl?: string;
  approvedFeedAddress?: string;
  privateKey?: string;
  signer: Signer,
  classes?: {
    wrapper?: string;
    form?: string;
    tabs?: string;
    comments?: string;
  };
}


export function SwarmCommentSystem(props: SwarmCommentSystemProps) {
  const { classes } = props;
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const loadComments = async () => {
    try {
      setLoading(true);

      const comments = await readComments({
        ...props,
      });

      console.log("readed comments: ", comments)
      setComments(comments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendComment = async (comment: CommentRequest) => {
    try {
      setFormLoading(true);
      
      const newComment = await writeComment(comment, props);
      if (!newComment) throw "Comment write failed."
      console.log("Write result ", newComment)

      setComments([
        ...(comments as Comment[]),
        newComment,
      ]);
    } catch (error) {
      console.error("Error while sending comments: ", error)
      setError(error)
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  if (!comments) {
    return <div>Couldn't load comments</div>;
  }

  if (error) {
    return (
      <div className={classes?.wrapper}>
          Error loading comments
      </div>
    );
  }

  return (
    <div className={classes?.wrapper}>

      <SwarmCommentForm
        className={classes?.form}
        onSubmit={sendComment}
        loading={loading || formLoading}
      />

      <SwarmCommentList 
        className={classes?.comments}
        comments={comments}
      />

    </div>
  );
}
