export interface Room {
  topic: string;
  userCount?: bigint;
}

export interface RoomWithUserCounts {
  url: string;
  gateway: string;
  topic: string;
  userCount?: bigint;
}
