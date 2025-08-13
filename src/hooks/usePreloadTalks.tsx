import { useCallback } from "react";

import { useGlobalState } from "@/contexts/global";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { FeedIndex, Topic } from "@ethersphere/bee-js";
import { VisibleMessage } from "./useSwarmComment";
import {
  getPrivateKeyFromIdentifier,
  getReactionFeedId,
  Options,
  readCommentsInRange,
  readReactionsWithIndex,
  readSingleComment,
} from "@solarpunkltd/comment-system";
import { CATEGORIES, MAX_COMMENTS_LOADED, SPACES_KEY } from "@/utils/constants";
import { getSessionsByDay } from "@/utils/helpers";

// TODO: reaction state handling
export const usePreloadTalks = () => {
  const { loadedTalks, setLoadedTalks, recentSessions, sessions, setSpacesActivity, setTalkActivity } = useGlobalState();
  const spacesSessions = getSessionsByDay(sessions, SPACES_KEY);
  const mergedSessions = [...spacesSessions, ...recentSessions];

  const preLoadTalks = useCallback(async () => {
    try {
      const tmpSpacesActivity = new Map<string, bigint>();
      const tmpTalkActivity = new Map<string, bigint>();
      const preLoadedTalks: TalkComments[] = [];
      const commentPromises: Promise<VisibleMessage[] | undefined>[] = [];
      const talkIds: string[] = [];
      const sessionIds: string[] = [];
      const optionsArr: Options[] = [];

      for (let i = 0; i < mergedSessions.length; i++) {
        const sessionId = mergedSessions[i].id;
        const talkId = getTopic(sessionId);

        // todo: is this check need or totally skip preloading if it exists
        if (loadedTalks) {
          const foundIx = loadedTalks.findIndex((t) => t.talkId === talkId);
          if (foundIx > -1) {
            preLoadedTalks.push(loadedTalks[foundIx]);
            console.debug("found preloaded talk, skipping it: ", loadedTalks[foundIx].talkId);
            continue;
          }
        }

        const signer = getPrivateKeyFromIdentifier(talkId);
        const options: Options = {
          identifier: Topic.fromString(talkId).toString(),
          address: signer.publicKey().address().toString(),
          beeApiUrl: process.env.BEE_API_URL,
        };
        // todo: this can be parallel for each comment feed
        const latestComment = await readSingleComment(undefined, options);

        if (!latestComment) {
          continue;
        }

        const latestIx = new FeedIndex(latestComment.index);
        const startIx = latestIx.toBigInt() > MAX_COMMENTS_LOADED ? latestIx.toBigInt() - MAX_COMMENTS_LOADED : 0n;
        const cp = readCommentsInRange(FeedIndex.fromBigInt(startIx), latestIx, options);

        commentPromises.push(cp);
        optionsArr.push(options);
        talkIds.push(talkId);
        sessionIds.push(sessionId);
      }

      const results = await Promise.allSettled(commentPromises);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === "fulfilled") {
          if (!result.value) {
            console.error(`preloading talks: invalid comments found for talkId: ${talkIds[i]}`);
            break;
          }

          const messages = [...result.value];

          const isSpacesSession = CATEGORIES.find((c) => c === sessionIds[i]);
          const latestIx = new FeedIndex(messages[messages.length - 1].index).toBigInt();
          if (isSpacesSession) {
            tmpSpacesActivity.set(sessionIds[i], latestIx);
          } else {
            tmpTalkActivity.set(talkIds[i], latestIx);
          }

          const reactionFeedId = getReactionFeedId(Topic.fromString(talkIds[i]).toString()).toString();
          const options = optionsArr[i];
          const reactionState = await readReactionsWithIndex(undefined, { ...options, identifier: reactionFeedId });

          let reactions: VisibleMessage[] = [];
          if (reactionState.nextIndex !== FeedIndex.MINUS_ONE.toString()) {
            reactions = [...reactionState.messages];
          }

          // todo: find a better way instead of looping all the time...
          for (const message of messages) {
            message.received = true;
          }
          for (const reaction of reactions) {
            reaction.received = true;
          }

          preLoadedTalks.push({
            talkId: talkIds[i],
            messages,
            reactions,
          });
        } else {
          console.error(`preloading talks error: `, result.reason);
        }
      }

      // TODO: why undef ? can be []
      // TODO: set them one by one as they get loaded not in a batch?
      setSpacesActivity(tmpSpacesActivity);
      setTalkActivity(tmpTalkActivity);
      setLoadedTalks(preLoadedTalks.length > 0 ? preLoadedTalks : undefined);
    } catch (error) {
      console.error("preloading talks error: ", error);
    }
  }, [recentSessions, sessions]);

  return { preLoadTalks };
};
