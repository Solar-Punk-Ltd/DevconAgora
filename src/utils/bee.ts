import { Bee, BeeRequestOptions, FeedIndex, PrivateKey, Topic } from "@ethersphere/bee-js";

import { FeedPayloadResult, FeedResultWithIndex } from "../types/common";
import { ADDRESS_HEX_LENGTH, DEFAULT_URL, FEED_INDEX_ZERO, SWARM_ZERO_ADDRESS } from "../utils/constants";

import { isNotFoundError } from "./helpers";

export async function getFeedUpdate(owner: string, rawTopic: string): Promise<string> {
  const { payload } = await getFeedData(owner, rawTopic);
  return payload.toString();
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
    const topic = new Topic(rawTopic);
    let data: FeedPayloadResult;
    const feedReader = bee.makeFeedReader(topic.toUint8Array(), owner, options);
    if (index !== undefined) {
      data = await feedReader.download({ index: FeedIndex.fromBigInt(index) });
    } else {
      data = await feedReader.download();
    }

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
  const topic = new Topic(rawTopic);
  try {
    const feedManif = await bee.createFeedManifest(stamp, topic, owner);
    console.debug("created feed manifest", feedManif);
    const feedWriter = bee.makeFeedWriter(topic, signer);
    const feedUpdateRes = await feedWriter.upload(stamp, ref);
    return feedUpdateRes.reference.toString();
  } catch (error) {
    console.error("error feed update: ", error);
    return "";
  }
}

// adds ENV suffix to the topic if raw is true, so that environments can be separated: talkId == sessionId + ENV
export function getTopic(topic: string, raw: boolean): string {
  if (raw) {
    return topic + process.env.ENV;
  }

  return new Topic(topic).toString();
}
