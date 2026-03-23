/**
 * SwarmIdClient adapter utilities (Phase 3)
 * 
 * Mirrors bee.ts interface but uses SwarmIdClient instead of raw Bee SDK.
 * These functions accept a SwarmIdClient instance and delegate operations to it.
 */

import { SwarmIdClient } from "swarm-id/lib/src/index.ts";
import { FeedResultWithIndex } from "../types/bee.ts";
import { FEED_INDEX_ZERO, SWARM_ZERO_ADDRESS } from "../constants/network";
import { FeedIndex } from "@ethersphere/bee-js";

/**
 * Download data via SwarmIdClient
 * Mirrors bee.ts getData()
 */
export async function swarmIdGetData(client: SwarmIdClient, ref: string): Promise<string> {
  try {
    // Validate reference format (64 or 128 hex chars)
    if (!/^[a-fA-F0-9]{64}([a-fA-F0-9]{64})?$/.test(ref)) {
      throw new Error(`Invalid Swarm reference: ${ref}`);
    }

    const data = await client.downloadData(ref);
    return new TextDecoder().decode(data);
  } catch (error) {
    console.error(`Failed to download data ${ref} via SwarmIdClient`, error);
    return "";
  }
}

/**
 * Upload data via SwarmIdClient
 * Mirrors bee.ts uploadData()
 * 
 * Note: stamp parameter is ignored; SwarmIdClient uses authenticated user's postage stamp
 */
export async function swarmIdUploadData(
  client: SwarmIdClient,
  _stamp: string,
  data: string | Uint8Array,
): Promise<string> {
  try {
    const payload = typeof data === "string" ? new TextEncoder().encode(data) : data;
    const result = await client.uploadData(payload);
    return result.reference;
  } catch (error) {
    console.error("Failed to upload data via SwarmIdClient", error);
    return SWARM_ZERO_ADDRESS.toString();
  }
}

/**
 * Read a sequential feed via SwarmIdClient
 * Mirrors bee.ts getFeedUpdate()
 * 
 * @param client SwarmIdClient instance
 * @param topic Feed topic (32-byte hex string or readable string)
 * @param owner Optional owner address; if omitted, uses authenticated user or proxy-resolved owner
 * @param encryptionKey Optional encryption key if the feed is encrypted
 * @param index Optional feed index to read from (defaults to latest)
 * @returns JSON string of the feed payload
 */
export async function swarmIdGetFeedUpdate(
  client: SwarmIdClient,
  topic: string,
  owner?: string,
  encryptionKey?: string,
  index?: bigint,
): Promise<string> {
  try {
    const reader = client.makeSequentialFeedReader({ topic, owner });

    // Download payload at index or latest
    // Only pass encryptionKey if provided
    const downloadOptions: any = {};
    if (index !== undefined) {
      downloadOptions.index = index;
    }
    debugger;
    const result = await reader.downloadPayload(
      encryptionKey || "",
      downloadOptions,
    );

    if (!result.payload || result.payload.length === 0) {
      console.debug(`No payload found in feed ${topic} at index ${index}`);
      return "";
    }

    return new TextDecoder().decode(result.payload);
  } catch (error) {
    console.error(`Failed to fetch feed update ${topic} via SwarmIdClient`, error);
    return "";
  }
}

/**
 * Write to a sequential feed via SwarmIdClient
 * Mirrors bee.ts updateFeed()
 * 
 * Note: Uses app signer from SwarmIdClient; no manual signer needed
 */
export async function swarmIdUpdateFeed(
  client: SwarmIdClient,
  topic: string,
  dataReference: string,
  index?: bigint,
): Promise<string> {
  try {
    const writer = client.makeSequentialFeedWriter({ topic });

    const result = await writer.uploadReference(dataReference, {
      index: index !== undefined ? index : undefined,
      encrypt: false, // Store reference unencrypted for public feeds
    });

    return result.reference || "";
  } catch (error) {
    console.error(`Failed to update feed ${topic} via SwarmIdClient`, error);
    return "";
  }
}

/**
 * Upload payload directly to feed via SwarmIdClient
 * Convenience method for uploading data + updating feed in one call
 */
export async function swarmIdUploadToFeed(
  client: SwarmIdClient,
  topic: string,
  data: string | Uint8Array,
  index?: bigint,
): Promise<{ payload: string; dataReference: string }> {
  try {
    const payload = typeof data === "string" ? new TextEncoder().encode(data) : data;
    const writer = client.makeSequentialFeedWriter({ topic });

    const result = await writer.uploadPayload(payload, {
      index: index !== undefined ? index : undefined,
      encrypt: false,
    });

    return {
      dataReference: result.reference,
      payload: new TextDecoder().decode(payload),
    };
  } catch (error) {
    console.error(`Failed to upload to feed ${topic} via SwarmIdClient`, error);
    return { dataReference: "", payload: "" };
  }
}

/**
 * Read feed data with index metadata via SwarmIdClient
 * Mirrors bee.ts getFeedData()
 */
export async function swarmIdGetFeedData(
  client: SwarmIdClient,
  topic: string,
  index?: bigint,
  encryptionKey?: string,
): Promise<FeedResultWithIndex> {
  try {
    const reader = client.makeSequentialFeedReader({ topic });

    const downloadOptions: any = {};
    if (index !== undefined) {
      downloadOptions.index = index;
    }

    const result = await reader.downloadPayload(encryptionKey || "", downloadOptions);

    if (!result.payload || result.payload.length === 0) {
      return {
        feedIndex: FeedIndex.MINUS_ONE,
        feedIndexNext: FEED_INDEX_ZERO,
        payload: SWARM_ZERO_ADDRESS,
      };
    }

    // Note: SwarmIdClient doesn't return FeedIndex directly
    // We'll construct a simplified result; this can be enhanced if needed
    return {
      feedIndex: FeedIndex.MINUS_ONE,
      feedIndexNext: FEED_INDEX_ZERO,
      payload: {
        toJSON: () => JSON.parse(new TextDecoder().decode(result.payload!)),
      } as any,
    };
  } catch (error) {
    console.error(`Failed to fetch feed data ${topic} via SwarmIdClient`, error);
    return {
      feedIndex: FeedIndex.MINUS_ONE,
      feedIndexNext: FEED_INDEX_ZERO,
      payload: SWARM_ZERO_ADDRESS,
    };
  }
}
