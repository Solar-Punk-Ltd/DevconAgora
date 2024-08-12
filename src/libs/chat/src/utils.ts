import { ethers, BytesLike, utils, Wallet } from 'ethers';
import * as crypto from 'crypto';
import { BatchId, Bee, BeeRequestOptions, Signer, UploadResult, Utils } from '@ethersphere/bee-js';
import { EthAddress, IdleMs, MessageData, Sha3Message, UserActivity, UserWithIndex } from './types';
import { CONSENSUS_ID, F_STEP, HEX_RADIX, IDLE_TIME, MAX_TIMEOUT, MESSAGE_FETCH_MAX, MESSAGE_FETCH_MIN } from './constants';

// Generate an ID for the feed, that will be connected to the stream, as Users list
export function generateUsersFeedId(topic: string) {
  return `${topic}_EthercastChat_Users`;
}

// Generate an ID for the feed, that is owned by a single user, who is writing messages to the chat
export function generateUserOwnedFeedId(topic: string, userAddress: EthAddress) {
  return `${topic}_EthercastChat_${userAddress}`;
}

// Validates a User object, including incorrect type, and signature
export function validateUserObject(user: any): boolean {
  try {
    if (typeof user.username !== 'string') throw 'username should be a string';
    if (typeof user.address !== 'string') throw 'address should be a string';
    if (typeof user.timestamp !== 'number') throw 'timestamp should be number';
    if (typeof user.signature !== 'string') throw 'signature should be a string';

    // Check for absence of extra properties
    const allowedProperties = ['username', 'address', 'timestamp', 'signature', 'index'];
    const extraProperties = Object.keys(user).filter((key) => !allowedProperties.includes(key));
    if (extraProperties.length > 0) {
      throw `Unexpected properties found: ${extraProperties.join(', ')}`;
    }

    // Create the message that is signed, and validate the signature
    const message = {
      username: user.username,
      address: user.address,
      timestamp: user.timestamp,
    };

    const returnedAddress = ethers.utils.verifyMessage(JSON.stringify(message), user.signature);
    if (returnedAddress !== user.address) throw 'Signature verification failed!';

    return true;
  } catch (error) {
    console.error('This User object is not correct: ', error);
    return false;
  }
}

// Returns timesstamp ordered messages (currently not used)
export function orderMessages(messages: MessageData[]) {
  return messages.sort((a, b) => a.timestamp - b.timestamp);
}

// Removes duplicates, also pays attention to same-timestamp unique messages (currently not used)
export function removeDuplicate(messages: MessageData[]): MessageData[] {
  const uniqueMessages: { [key: string]: MessageData } = {};

  messages.forEach((message) => {
    const key = `${message.timestamp}_${message.message}`;
    uniqueMessages[key] = message;
  });

  const uniqueMessagesArray = Object.values(uniqueMessages);

  return uniqueMessagesArray;
}

// Remove duplicated elements from users object
export function removeDuplicateUsers(users: UserWithIndex[]): UserWithIndex[] {
  const userMap: Record<string, UserWithIndex> = {};

  users.forEach(user => {
      if (!userMap[user.address]) {
          userMap[user.address] = user;
      } else {
          const existingUser = userMap[user.address];
          if (
              user.timestamp > existingUser.timestamp || 
              (user.timestamp === existingUser.timestamp && user.index > existingUser.index)
          ) {
              userMap[user.address] = user;
          }
      }
  });

  return Object.values(userMap);
}

// getConsensualPrivateKey will generate a private key, that is used for the Graffiti-feed (which is a public feed, for user registration)
function getConsensualPrivateKey(resource: Sha3Message) {
  if (Utils.isHexString(resource) && resource.length === 64) {
    return Utils.hexToBytes(resource);
  }

  return Utils.keccak256Hash(resource);
}

// getGraffitiWallet generates a Graffiti wallet, from provided private key (see getConsensualPrivateKey)
function getGraffitiWallet(consensualPrivateKey: BytesLike) {
  const privateKeyBuffer = utils.hexlify(consensualPrivateKey);
  return new Wallet(privateKeyBuffer);
}

// Serializes a js object, into Uint8Array
function serializeGraffitiRecord(record: Record<any, any>) {
  return new TextEncoder().encode(JSON.stringify(record));
}

// Creates feed-index-format index, from a number
export function numberToFeedIndex(index: number) {
  const bytes = new Uint8Array(8);
  const dv = new DataView(bytes.buffer);
  dv.setUint32(4, index);

  return Utils.bytesToHex(bytes);
}

// General sleep function, usage: await sleep(ms)
export function sleep(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

// Increment hex string, default value is 1
export function incrementHexString(hexString: string, i = 1n) {
  const num = BigInt('0x' + hexString);
  return (num + i).toString(HEX_RADIX).padStart(HEX_RADIX, '0');
}

// retryAwaitableAsync will retry a promise if fails, default retry number is 3, default delay between attempts is 250 ms
export async function retryAwaitableAsync<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 250,
): Promise<T> {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        if (retries > 0) {
          console.log(`Retrying... Attempts left: ${retries}. Error: ${error.message}`);
          setTimeout(() => {
            retryAwaitableAsync(fn, retries - 1, delay)
              .then(resolve)
              .catch(reject);
          }, delay);
        } else {
          console.error(`Failed after ${retries} initial attempts. Last error: ${error.message}`);
          reject(error);
        }
      });
  });
}

// Uploads a js object to Swarm, a valid stamp needs to be provided
export async function uploadObjectToBee(bee: Bee, jsObject: object, stamp: BatchId): Promise<UploadResult | null> {
  try {
    const result = await bee.uploadData(stamp as any, serializeGraffitiRecord(jsObject), { redundancyLevel: 4 });
    return result;
  } catch (error) {
    console.error(`There was an error while trying to upload object to Swarm: ${error}`);
    return null;
  }
}

// Creates a Graffiti feed writer from provided topic, Bee request options can be provided, e.g. timeout
export function graffitiFeedWriterFromTopic(bee: Bee, topic: string, options?: BeeRequestOptions) {
  const { consensusHash, graffitiSigner } = generateGraffitiFeedMetadata(topic);
  return bee.makeFeedWriter('sequence', consensusHash, graffitiSigner, options);
}

// Creates a Graffiti feed reader from provided topic, Bee request options can be provided, e.g. timeout
export function graffitiFeedReaderFromTopic(bee: Bee, topic: string, options?: BeeRequestOptions) {
  const { consensusHash, graffitiSigner } = generateGraffitiFeedMetadata(topic);
  return bee.makeFeedReader('sequence', consensusHash, graffitiSigner.address, options);
}

// generateGraffitiFeedMetadata will give back a consensus hash, and a Signer, from provided topic
export function generateGraffitiFeedMetadata(topic: string) {
  const roomId = generateUsersFeedId(topic);
  const privateKey = getConsensualPrivateKey(roomId);
  const wallet = getGraffitiWallet(privateKey);

  const graffitiSigner: Signer = {
    address: Utils.hexToBytes(wallet.address.slice(2)),
    sign: async (data: any) => {
      return await wallet.signMessage(data);
    },
  };

  const consensusHash = Utils.keccak256Hash(CONSENSUS_ID);

  return {
    consensusHash,
    graffitiSigner,
  };
}

// getLatestFeedIndex will give back latestIndex and nextIndex, if download succeeds, if not, latestIndex will be -1, and nextIndex is 0
export async function getLatestFeedIndex(bee: Bee, topic: string, address: EthAddress) {
  try {
  console.log("topic: ", topic)
    const feedReader = bee.makeFeedReader('sequence', topic, address);
  console.log("feedReader: ", feedReader)
    const feedEntry = await feedReader.download();
  console.log("feedEntry: ", feedEntry)
    const latestIndex = parseInt(feedEntry.feedIndex.toString(), HEX_RADIX);
    const nextIndex = parseInt(feedEntry.feedIndexNext, HEX_RADIX);

    return { latestIndex, nextIndex };
  } catch (error) {
    if (isNotFoundError(error)) {
      return { latestIndex: -1, nextIndex: 0 };
    }
    throw error;
  }
}

// TODO: why bee-js do this?
// status is undefined in the error object
// Determines if the error is about 'Not Found'
export function isNotFoundError(error: any) {
  return error.stack.includes('404') || error.message.includes('Not Found') || error.message.includes('404');
}

// Calculates and stores average, used for request time averaging
export class RunningAverage {
  private maxSize: number;
  private values: number[];
  private sum: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.values = [];
    this.sum = 0;
  }

  addValue(newValue: number) {
    if (this.values.length === this.maxSize) {
      const removedValue = this.values.shift();
      if (removedValue !== undefined) {
        this.sum -= removedValue;
      }
    }

    this.values.push(newValue);
    this.sum += newValue;

    console.log("Current average: ", this.getAverage())
  }

  getAverage() {
    if (this.values.length === 0) {
      return 200;
    }
    return this.sum / this.values.length;
  }
}

// selectUsersFeedCommitWriter will select a user who will write a UsersFeedCommit object to the feed
export function selectUsersFeedCommitWriter(activeUsers: UserWithIndex[]): EthAddress {
  const minUsersToSelect = 3;
  const numUsersToselect = Math.max(Math.ceil(activeUsers.length * 0.3), minUsersToSelect);     // Select top 30% of activeUsers, but minimum 1
  const sortedActiveUsers = activeUsers.sort((a, b) => b.timestamp - a.timestamp);              // Sort activeUsers by timestamp
  const mostActiveUsers = sortedActiveUsers.slice(0, numUsersToselect);                         // Top 30% but minimum 3 (minUsersToSelect)

  // Lottery about UsersFeedCommit
  console.log("Most active users: ", mostActiveUsers);
  const sortedMostActiveAddresses = mostActiveUsers.map((user) => user.address).sort();
  const seedString = sortedMostActiveAddresses.join(',');                                       // All running instances should have the same string at this time
  const hash = crypto.createHash('sha256').update(seedString).digest('hex');                    // Hash should be same in all computers that are in this chat
  const randomIndex = parseInt(hash, 16) % mostActiveUsers.length;                              // They should have the same number, thus, selecting the same user
  
  return mostActiveUsers[randomIndex].address;
}

//TODO this is an utils function
export function getActiveUsers(users: UserWithIndex[], userActivityTable: UserActivity): UserWithIndex[] {
  const idleMs: IdleMs = {};
  const now = Date.now();

  for (const rawKey in userActivityTable) {
    const key = rawKey as unknown as EthAddress;
    idleMs[key] = now - userActivityTable[key].timestamp;
  }

  console.log("Users inside removeIdle: ", users)
  const activeUsers = users.filter((user) => {
    const userAddr = user.address;
    if (!userActivityTable[userAddr]) {
      userActivityTable[userAddr] = {
        timestamp: user.timestamp,
        readFails: 0
      }
      return true;
    }
          
    return idleMs[userAddr] < IDLE_TIME;
  });

  return activeUsers;
}