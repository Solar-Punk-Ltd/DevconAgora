import { Bee } from "@ethersphere/bee-js";
import { Session } from "../types/session";
import {
  FEEDTYPE_SEQUENCE,
  ADDRESS_HEX_LENGTH,
  DEFAULT_URL,
} from "../utils/constants";

export async function getFeedUpdate(): Promise<string> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  const rawFeedTopicSession = "sessions";
  const sessionFeedTopic = bee.makeFeedTopic(rawFeedTopicSession);
  const feedReader = bee.makeFeedReader(
    FEEDTYPE_SEQUENCE,
    sessionFeedTopic,
    process.env.FEED_OWNER_ADDRESS as string
  );
  try {
    const feedUpdateRes = await feedReader.download();
    return feedUpdateRes.reference as string;
  } catch (e) {
    console.log("feed download error", e);
    return "";
  }
}

export async function getSessionsData(
  ref: string
): Promise<Map<string, Session[]>> {
  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  if (ref.length !== ADDRESS_HEX_LENGTH) {
    console.log("session hash invalid");
    return new Map<string, Session[]>();
  }

  try {
    const data = JSON.parse((await bee.downloadData(ref)).text());
    return new Map<string, Session[]>(Object.entries(data));
  } catch (e) {
    console.log("session " + ref + " download/cast error", e);
    return new Map<string, Session[]>();
  }
}
