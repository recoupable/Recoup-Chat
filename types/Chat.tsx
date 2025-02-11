export type Conversation = {
  topic: string;
  id: string;
  account_id: string;
  memories: Array<{
    artist_id: string;
  }>;
  room_reports: Array<{
    report_id: string;
  }>;
  updated_at: string;
};
