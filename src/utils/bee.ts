import { Bee, Reference, Signer } from "@ethersphere/bee-js";

import {
  ADDRESS_HEX_LENGTH,
  DEFAULT_URL,
  FEEDTYPE_SEQUENCE,
} from "../utils/constants";

export async function getFeedUpdate(
  owner: string,
  rawTopic: string
): Promise<string> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  const topic = bee.makeFeedTopic(rawTopic);
  const feedReader = bee.makeFeedReader(FEEDTYPE_SEQUENCE, topic, owner);
  try {
    const feedUpdateRes = await feedReader.download();
    return feedUpdateRes.reference as string;
  } catch (e) {
    console.log("feed download error", e);
    return "";
  }
}

export async function getData(ref: string): Promise<string> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  if (ref.length !== ADDRESS_HEX_LENGTH) {
    console.log("session hash invalid");
    return "";
  }

  try {
    const data = (await bee.downloadData(ref)).text();
    return data;
  } catch (e) {
    console.log("session " + ref + " download/cast error", e);
    return "";
  }
}

export async function uploadData(
  stamp: string,
  data: string | Uint8Array
): Promise<string> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  try {
    console.log("uploading data to swarm");
    const sessionsReference = await bee.uploadData(stamp, data);
    return sessionsReference.reference;
  } catch (error) {
    console.log("error data upload", error);
    return "";
  }
}

export async function updateFeed(
  owner: string,
  signer: Signer,
  rawTopic: string,
  stamp: string,
  ref: string
): Promise<string> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  const topic = bee.makeFeedTopic(rawTopic);
  try {
    const feedManif = await bee.createFeedManifest(
      stamp,
      FEEDTYPE_SEQUENCE,
      topic,
      owner
    );
    console.log("created feed manifest", feedManif.reference);
    const feedWriter = bee.makeFeedWriter(FEEDTYPE_SEQUENCE, topic, signer);
    const feedUpdateRes = await feedWriter.upload(stamp, ref as Reference);
    return feedUpdateRes.reference;
  } catch (error) {
    console.log("error feed update: ", error);
    return "";
  }
}

// adds ENV suffix to the topic if raw is true, so that dev and prod topics can be separated
export function getTopic(topic: string, raw: boolean): string {
  if (raw) {
    return topic + process.env.ENV;
  }
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  return bee.makeFeedTopic(topic);
}
