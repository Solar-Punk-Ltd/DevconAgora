export interface Room {
  topic: string;
  userCount?: number;
}

export interface RoomWithUserCounts {
  url: string;
  gateway: string;
  topic: string;
  userCount?: number;
}
