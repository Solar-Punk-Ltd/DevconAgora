import { Bee, BeeRequestOptions, FeedIndex, PrivateKey, Topic } from "@ethersphere/bee-js";

import { FeedResultWithIndex } from "../types/common";
import { ADDRESS_HEX_LENGTH, DEFAULT_URL, FEED_INDEX_ZERO, SWARM_ZERO_ADDRESS } from "../utils/constants";

import { isNotFoundError } from "./helpers";

export async function getFeedUpdate(owner: string, rawTopic: string): Promise<string> {
  const { payload } = await getFeedData(owner, rawTopic);
  if (SWARM_ZERO_ADDRESS.equals(payload)) {
    console.error("feed data is empty for topic: ", rawTopic);
    return "";
  }

  return JSON.stringify(payload.toJSON());
}

export async function getFeedData(owner: string, rawTopic: string, index?: bigint, options?: BeeRequestOptions): Promise<FeedResultWithIndex> {
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
    const topic = Topic.fromString(rawTopic);
    const feedReader = bee.makeFeedReader(topic.toUint8Array(), owner, options);
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
  if (ref.length !== ADDRESS_HEX_LENGTH) {
    console.debug("session hash invalid");
    return "";
  }

  try {
    const data = (await bee.downloadData(ref)).toString();
    return data;
  } catch (e) {
    console.error("session " + ref + " download/cast error", e);
    return "";
  }
}

export async function uploadData(stamp: string, data: string | Uint8Array): Promise<string> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  try {
    console.debug("uploading data to swarm");
    const sessionsReference = await bee.uploadData(stamp, data);
    return sessionsReference.reference.toString();
  } catch (error) {
    console.error("error data upload", error);
    return "";
  }
}

export async function updateFeed(owner: string, signer: PrivateKey, rawTopic: string, stamp: string, ref: string): Promise<string> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  const topicBytes = Topic.fromString(rawTopic);

  try {
    await bee.createFeedManifest(stamp, topicBytes, owner);
    const feedWriter = bee.makeFeedWriter(topicBytes, signer);
    const uploadReferenceResult = await feedWriter.uploadReference(stamp, ref);
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
