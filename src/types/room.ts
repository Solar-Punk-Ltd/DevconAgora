export interface Room {
  name: string;
  description: string;
  info: string;
  capacity: string;
}

export interface RoomWithUserCounts {
  url: string;
  gateway: string;
  topic: string;
  userCount?: number;
}
