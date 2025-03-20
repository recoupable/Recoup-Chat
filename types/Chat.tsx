export type Conversation = {
  topic: string;
  id: string;
  account_id: string;
  artist_id: string;
  memories: Array<{
    id: string;
    content: unknown;
    room_id: string;
    created_at: string;
  }>;
  room_reports: Array<{
    report_id: string;
  }>;
  updated_at: string;
};
