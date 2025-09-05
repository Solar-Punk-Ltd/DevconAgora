export interface Space {
  id: string;
  title: string;
  track: string;
  liked?: boolean;
  slot_roomId?: string;
  slot_start?: string;
  slot_end?: string;
  // todo: store activity in space and session object
  // activity?: number;
}
