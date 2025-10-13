import { FeedIndex, Topic } from "@ethersphere/bee-js";
import {
  getPrivateKeyFromIdentifier,
  getReactionFeedId,
  Options,
  readCommentsInRange,
  readReactionsWithIndex,
  readSingleComment,
} from "@solarpunkltd/comment-system";
import { indexStrToBigint } from "@solarpunkltd/swarm-comment-js";
import { useCallback } from "react";

import { VisibleMessage } from "./useSwarmComment";

import { useGlobalState } from "@/contexts/global";
import { Session } from "@/types/session";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { CATEGORIES, MAX_COMMENTS_LOADED, MAX_PRELOADED_TALKS, SPACES_KEY } from "@/utils/constants";
import { getActivityHelper, getSessionsByDay } from "@/utils/helpers";

const processSessionComments = async (
  sessionId: string,
  talkId: string,
  currentLoadedTalks: TalkComments[] | undefined
): Promise<{ talkComments?: TalkComments; activity: bigint; isSpacesSession: boolean } | null> => {
  try {
    if (currentLoadedTalks && currentLoadedTalks.length >= MAX_PRELOADED_TALKS) {
      return null;
    }

    if (currentLoadedTalks) {
      const foundIx = currentLoadedTalks.findIndex((t) => t.talkId === talkId);
      if (foundIx > -1) {
        console.debug("found preloaded talk, skipping it: ", currentLoadedTalks[foundIx].talkId);
        return {
          talkComments: currentLoadedTalks[foundIx],
          isSpacesSession: CATEGORIES.includes(sessionId),
          activity: getActivityHelper(currentLoadedTalks[foundIx].messages, true),
        };
      }
    }

    const signer = getPrivateKeyFromIdentifier(talkId);
    const options: Options = {
      identifier: Topic.fromString(talkId).toString(),
      address: signer.publicKey().address().toString(),
      beeApiUrl: process.env.BEE_API_URL,
      signer,
    };

    const latestComment = await readSingleComment(undefined, options);
    const latestIx = indexStrToBigint(latestComment?.index);
    if (!latestComment || !latestIx) {
      return null;
    }

    const startIx = latestIx > MAX_COMMENTS_LOADED ? latestIx - MAX_COMMENTS_LOADED : 0n;

    const messages = await readCommentsInRange(FeedIndex.fromBigInt(startIx), FeedIndex.fromBigInt(latestIx), options);

    if (!messages) {
      console.error(`preloading talks: no comments found for talkId: ${talkId}`);
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

    const nextIxBigInt = indexStrToBigint(reactionState.nextIndex);
    if (!nextIxBigInt) {
      return [];
    }

    if (!FeedIndex.fromBigInt(nextIxBigInt).equals(FeedIndex.MINUS_ONE)) {
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

    const currentLoadedTalks = loadedTalks;
    if (currentLoadedTalks && currentLoadedTalks.length >= MAX_PRELOADED_TALKS) {
      console.debug(`Maximum number of preloaded talks (#${MAX_PRELOADED_TALKS}) reached, skipping ${debugName} preloading`);
      return;
    }

    const tmpActivity = new Map<string, number>();
    const promises = sessions.map((session) => {
      const talkId = getTopic(session.id);
      return processSessionComments(session.id, talkId, currentLoadedTalks);
    });

    const results = await Promise.allSettled(promises);
    const updatedTalks: TalkComments[] = [...(currentLoadedTalks || [])];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === "fulfilled" && result.value) {
        const { talkComments, activity, isSpacesSession } = result.value;

        if (talkComments) {
          // TODO: activity number vs bigint
          tmpActivity.set(isSpacesSession ? sessions[i].id : talkComments.talkId, Number(activity));

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

    setLoadedTalks(updatedTalks);
  }, [setLoadedTalks]);

  return { preloadReactions };
};

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
