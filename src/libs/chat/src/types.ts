import { HexString } from "@ethersphere/bee-js/dist/types/utils/hex";
import { Signature } from "ethers";
import { ETH_ADDRESS_LENGTH } from "./constants";

// This is a hex string of specific length (42)
export type EthAddress = HexString<typeof ETH_ADDRESS_LENGTH>;

// TODO: participant should be EthAddress, most likely
// Client-side user details, includes private key, and stamp
export interface ParticipantDetails {
    nickName: string;
    participant: EthAddress;
    key: string;
    stamp: string;
}

// Message object, contains the message, nickname that is not unique, an Ethereum address, and timestamp
export interface MessageData {
    message: string;
    username: string;
    address: EthAddress;
    timestamp: number;
}

// This is the object that is uploaded to the Graffiti-feed (Users feed)
export interface User {
    username: string;
    address: EthAddress;
    timestamp: number;
    signature: Signature;
}

// UserActivity shows last message timestamp for each user
export interface UserActivity {
    [address: EthAddress]: {
        timestamp: number,
        readFails: number                   // how many times read failed for this user
    };
}

// IdleMs shows how much was a user idle, in ms
export interface IdleMs {
    [address: EthAddress]: number;
}

// This object will be pushed to the Users feed
export interface UsersFeedCommit {
    users: User[];
    overwrite: boolean;
}
  
export interface UserWithIndex extends User {
    index: number;
}

// Where we use it, it is string. Will be used to create SHA hash
export type Sha3Message = string | number[] | ArrayBuffer | Uint8Array;