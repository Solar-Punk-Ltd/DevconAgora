import { FeedIndex, Topic } from "@ethersphere/bee-js";
import {
  getPrivateKeyFromIdentifier,
  getReactionFeedId,
  Options,
  readCommentsInRange,
  readReactionsWithIndex,
  readSingleComment,
} from "@solarpunkltd/comment-system";
import { useCallback } from "react";

import { VisibleMessage } from "./useSwarmComment";

import { useGlobalState } from "@/contexts/global";
import { Session } from "@/types/session";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { CATEGORIES, MAX_COMMENTS_LOADED, SPACES_KEY } from "@/utils/constants";
import { getSessionsByDay } from "@/utils/helpers";

export const getActivityHelper = (messages: VisibleMessage[], last: boolean): bigint => {
  const index = last ? messages.length - 1 : 0;
  return messages.length > 0 ? new FeedIndex(messages[index].index).toBigInt() : -1n;
};

const processSessionComments = async (
  sessionId: string,
  talkId: string,
  loadedTalks: TalkComments[] | undefined
): Promise<{ talkComments?: TalkComments; activity: bigint; isSpacesSession: boolean } | null> => {
  try {
    if (loadedTalks) {
      const foundIx = loadedTalks.findIndex((t) => t.talkId === talkId);
      if (foundIx > -1) {
        console.debug("found preloaded talk, skipping it: ", loadedTalks[foundIx].talkId);
        return {
          talkComments: loadedTalks[foundIx],
          isSpacesSession: CATEGORIES.includes(sessionId),
          activity: getActivityHelper(loadedTalks[foundIx].messages, true),
        };
      }
    }

    const signer = getPrivateKeyFromIdentifier(talkId);
    const options: Options = {
      identifier: Topic.fromString(talkId).toString(),
      address: signer.publicKey().address().toString(),
      beeApiUrl: process.env.BEE_API_URL,
    };

    const latestComment = await readSingleComment(undefined, options);
    if (!latestComment) {
      return null;
    }

    const latestIx = new FeedIndex(latestComment.index);
    const startIx = latestIx.toBigInt() > MAX_COMMENTS_LOADED ? latestIx.toBigInt() - MAX_COMMENTS_LOADED : 0n;

    const messages = await readCommentsInRange(FeedIndex.fromBigInt(startIx), latestIx, options);

    if (!messages) {
      console.error(`preloading talks: invalid comments found for talkId: ${talkId}`);
      return null;
    }

    const visibleMessages: VisibleMessage[] = messages.map((msg) => ({
      ...msg,
      received: true,
    }));

    const isSpacesSession = CATEGORIES.includes(sessionId);

    return {
      talkComments: {
        talkId,
        messages: visibleMessages,
        reactions: [],
      },
      activity: getActivityHelper(messages, true),
      isSpacesSession,
    };
  } catch (error) {
    console.error(`Error processing session ${sessionId}:`, error);
    return null;
  }
};

const processReactions = async (talkId: string): Promise<VisibleMessage[]> => {
  try {
    const signer = getPrivateKeyFromIdentifier(talkId);
    const reactionFeedId = getReactionFeedId(Topic.fromString(talkId).toString()).toString();
    const options: Options = {
      identifier: reactionFeedId,
      address: signer.publicKey().address().toString(),
      beeApiUrl: process.env.BEE_API_URL,
    };

    const reactionState = await readReactionsWithIndex(undefined, options);
    let reactions: VisibleMessage[] = [];

    if (reactionState.nextIndex !== FeedIndex.MINUS_ONE.toString()) {
      reactions = reactionState.messages.map((reaction) => ({
        ...reaction,
        received: true,
      }));
    }

    return reactions;
  } catch (error) {
    console.error(`Error processing reactions for ${talkId}:`, error);
    return [];
  }
};

const usePreloadSessions = (sessions: Session[] | undefined, isSpacesMode: boolean) => {
  const { loadedTalks, setLoadedTalks, setSpacesActivity, setTalkActivity } = useGlobalState();

  const preloadSessions = useCallback(async () => {
    const debugName = isSpacesMode ? "spaces" : "recent";

    if (!sessions || sessions.length === 0) {
      console.debug(`No sessions available for ${debugName} preloading`);
      return;
    }

    const tmpActivity = new Map<string, bigint>();
    const promises = sessions.map((session) => {
      const talkId = getTopic(session.id);
      return processSessionComments(session.id, talkId, loadedTalks);
    });

    const results = await Promise.allSettled(promises);
    const updatedTalks: TalkComments[] = [...(loadedTalks || [])];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === "fulfilled" && result.value) {
        const { talkComments, activity, isSpacesSession } = result.value;

        if (talkComments) {
          tmpActivity.set(isSpacesSession ? sessions[i].id : talkComments.talkId, activity);

          const existingIndex = updatedTalks.findIndex((t) => t.talkId === talkComments.talkId);
          if (existingIndex > -1) {
            updatedTalks[existingIndex] = talkComments;
          } else {
            updatedTalks.push(talkComments);
          }
        }
      } else if (result.status === "rejected") {
        console.error(`${debugName} session preloading error:`, result.reason);
      }
    }

    if (isSpacesMode) {
      setSpacesActivity(tmpActivity);
    } else {
      setTalkActivity(tmpActivity);
    }
    setLoadedTalks(updatedTalks);
  }, [sessions, setLoadedTalks, setSpacesActivity, setTalkActivity, isSpacesMode]);

  return preloadSessions;
};

export const usePreloadSpacesSessions = () => {
  const { sessions } = useGlobalState();
  const spacesSessions = sessions ? getSessionsByDay(sessions, SPACES_KEY) : [];

  const preloadSpacesSessions = usePreloadSessions(spacesSessions, true);

  return { preloadSpacesSessions };
};

export const usePreloadRecentSessions = () => {
  const { recentSessions } = useGlobalState();

  const preloadRecentSessions = usePreloadSessions(recentSessions, false);

  return { preloadRecentSessions };
};

export const usePreloadReactions = () => {
  const { loadedTalks, setLoadedTalks } = useGlobalState();

  const preloadReactions = useCallback(async () => {
    if (!loadedTalks || loadedTalks.length === 0) {
      console.debug("No loaded talks available for reaction preloading");
      return;
    }

    const reactionPromises = loadedTalks.map((talk) => processReactions(talk.talkId));

    // Promise.allSettled is already safe - it never rejects
    const results = await Promise.allSettled(reactionPromises);
    const updatedTalks: TalkComments[] = [...loadedTalks];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === "fulfilled") {
        updatedTalks[i] = {
          ...updatedTalks[i],
          reactions: result.value,
        };
      } else {
        console.error(`Reaction preloading error for ${loadedTalks[i].talkId}:`, result.reason);
      }
    }

    // State update is synchronous and safe
    setLoadedTalks(updatedTalks);
  }, [setLoadedTalks]);

  return { preloadReactions };
};

// Legacy hook for backward compatibility - now orchestrates the three functions
export const usePreloadTalks = () => {
  const { preloadSpacesSessions } = usePreloadSpacesSessions();
  const { preloadRecentSessions } = usePreloadRecentSessions();
  const { preloadReactions } = usePreloadReactions();

  const preLoadTalks = useCallback(async () => {
    console.debug("Starting parallel preloading...");

    await Promise.allSettled([preloadSpacesSessions(), preloadRecentSessions(), preloadReactions()]);

    console.debug("Parallel preloading completed");
  }, [preloadSpacesSessions, preloadRecentSessions, preloadReactions]);

  return { preLoadTalks };
};
