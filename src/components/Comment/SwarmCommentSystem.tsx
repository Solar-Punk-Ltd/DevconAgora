import { Comment, CommentRequest } from "../../libs/comment-system/model/comment.model";
import { readComments, writeComment } from "../../libs/comment-system/comments";
import SwarmCommentList from "./swarm-comment-list/swarm-comment-list";
import { useEffect, useState } from "react";
import SwarmCommentForm from "./swarm-comment-form/swarm-comment-form";
import { Bee, Signer, Topic } from "@ethersphere/bee-js";

/**
 * stamp - Postage stamp ID. If ommitted a first available stamp will be used.
 * identifier - Resource identifier. If not sepcified it's calculated from bzz path.
 * beeApiUrl - Bee API URL, default http://localhost:1633
 * beeDebugApiUrl - Bee Debug API URL, default http://localhost:1635
 */
export interface SwarmCommentSystemProps {
  stamp: string;
  topic: string;
  beeApiUrl: string;
  beeDebugApiUrl?: string;  // not needed
  approvedFeedAddress?: string; // not needed, signer.address
  privateKey: string;
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
  const { stamp, topic, beeApiUrl, privateKey, signer } = props;
  const bee = new Bee(beeApiUrl);
  const topicHex: Topic = bee.makeFeedTopic(topic);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);


  useEffect(() => {
    init();
  }, []);

  /** If the room already exists, it will load the messages,
   *  otherwise, it will create the room */
  async function init() {
    const retrievable =  await bee.isFeedRetrievable('sequence', signer.address, topicHex);
    
    if (retrievable) loadComments();
    else createFeed();
  }

  // Will create a feed, with topic (room-name)
  async function createFeed() {
    try {
      console.info("Feed does not exist. Creating feed...");

      const feedReference = await bee.createFeedManifest(
        stamp, 
        'sequence', 
        topicHex, 
        signer.address
      );

      console.info(`Created feed with reference ${feedReference.reference}`);
      setComments([]);
      setLoading(false);
    } catch (e) {
      console.error("feed gen error", e);
    }
  }

  // Will load comments for the given topic (which is the room-name)
  const loadComments = async () => {
    try {
      setLoading(true);

      const comments = await readComments({
        stamp,
        identifier: topicHex,
        signer,
        beeApiUrl,
        approvedFeedAddress: signer.address as unknown as string,
        privateKey
      });

      console.log("readed comments: ", comments)
      setComments(comments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Sends a message to the room
  const sendComment = async (comment: CommentRequest) => {
    try {
      setFormLoading(true);
      
      const newComment = await writeComment(
        comment, {
          stamp,
          identifier: topicHex,
          signer,
          beeApiUrl,
          privateKey
        }
      );

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


  if (!comments) {
    return <div>Loading comments...</div>;
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
