import { Bee, BeeRequestOptions, FeedIndex, PrivateKey, Reference, Topic } from "@ethersphere/bee-js";

import { FeedResultWithIndex } from "../types/common";
import { DEFAULT_URL, FEED_INDEX_ZERO, SWARM_ZERO_ADDRESS } from "../utils/constants";

import { isNotFoundError } from "./helpers";

export async function getFeedUpdate(owner: string, topic: string, raw?: boolean): Promise<string> {
  let feedTopic: string = topic;
  if (!raw) {
    feedTopic = Topic.fromString(topic).toString();
  }

  const { payload } = await getFeedData(owner, feedTopic.toString());
  if (SWARM_ZERO_ADDRESS.equals(payload)) {
    console.error("feed data is empty for topic: ", feedTopic.toString());
    return "";
  }

  return JSON.stringify(payload.toJSON());
}

export async function getFeedData(owner: string, topic: string, index?: bigint, options?: BeeRequestOptions): Promise<FeedResultWithIndex> {
  if (!process.env.BEE_API_URL) {
    console.error("BEE_API_URL is not configured.");
    return {
      feedIndex: FeedIndex.MINUS_ONE,
      feedIndexNext: FEED_INDEX_ZERO,
      payload: SWARM_ZERO_ADDRESS,
    };
  }
  const bee = new Bee(process.env.BEE_API_URL);

  try {
    const feedReader = bee.makeFeedReader(topic, owner, options);
    const data = await feedReader.download(index ? { index: FeedIndex.fromBigInt(index) } : {});

    return {
      feedIndex: data.feedIndex,
      feedIndexNext: data.feedIndexNext ?? data.feedIndex.next(),
      payload: data.payload,
    };
  } catch (e) {
    if (isNotFoundError(e)) {
      console.debug("feed data not found");
    } else {
      console.error("feed download error", e);
    }
  }

  return {
    feedIndex: FeedIndex.MINUS_ONE,
    feedIndexNext: FEED_INDEX_ZERO,
    payload: SWARM_ZERO_ADDRESS,
  };
}

export async function getData(ref: string): Promise<string> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);

  try {
    //validate reference
    new Reference(ref);

    const data = (await bee.downloadData(ref)).toString();
    return data;
  } catch (e) {
    console.error("session " + ref + " download/cast error", e);
    return "";
  }
}

export async function uploadData(stamp: string, data: string | Uint8Array): Promise<Reference> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  try {
    console.debug("uploading data to swarm");
    const sessionsReference = await bee.uploadData(stamp, data);
    return sessionsReference.reference;
  } catch (error) {
    console.error("error data upload", error);
    return SWARM_ZERO_ADDRESS;
  }
}

export async function updateFeed(signer: PrivateKey, topic: Topic, stamp: string, ref: Reference): Promise<string> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);

  try {
    const feedWriter = bee.makeFeedWriter(topic.toUint8Array(), signer);
    const uploadReferenceResult = await feedWriter.upload(stamp, ref, { index: undefined });
    return uploadReferenceResult.reference.toString();
  } catch (error) {
    console.error("error feed update: ", error);
    return "";
  }
}

// adds ENV suffix to the topic if raw is true, so that environments can be separated: talkId == sessionId + ENV
export function getTopic(topic: string): string {
  return topic + process.env.ENV;
}
