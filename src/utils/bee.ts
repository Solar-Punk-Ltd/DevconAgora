import { Bee, Signer, Reference } from "@ethersphere/bee-js";
import {
  FEEDTYPE_SEQUENCE,
  ADDRESS_HEX_LENGTH,
  DEFAULT_URL,
} from "../utils/constants";

// TODO: global bee var vs init in every function ?
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

export function getTopic(rawTopic: string): string {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  return bee.makeFeedTopic(rawTopic);
}

export async function uploadData(
  stamp: string,
  data: string | Uint8Array
): Promise<string> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  try {
    console.log("uploading data to swarm");
    const sessionsReference = await bee.uploadData(stamp, data);
    console.log("success, data reference: ", sessionsReference.reference);
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

    console.log("updating feed with the file reference: ", ref);
    const feedUpdateRes = await feedWriter.upload(stamp, ref as Reference);
    console.log("feed upload result: ", feedUpdateRes);
    return feedUpdateRes.reference;
  } catch (error) {
    console.log("error feed update: ", error);
    return "";
  }
}
