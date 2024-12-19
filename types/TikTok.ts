export enum ERRORS {
  UNKNOWN_PROFILE_ERROR = "This profile/hashtag does not exist.",
}

export enum STEP_OF_ANALYSIS {
  INITITAL,
  ERROR,
  FINISHED,
  UNKNOWN_PROFILE,
  PROFILE,
  POSTURLS,
  ALBUMS,
  TRACKS,
  VIDEO_COMMENTS,
  SEGMENTS,
  CREATING_ARTIST,
  SAVING_ANALYSIS,
}

export type Comment = {
  videoWebUrl: string;
  submittedVideoUrl: string | null;
  cid: string;
  createTime: number;
  createTimeISO: string;
  text: string;
  diggCount: number;
  repliesToId: string | null;
  replyCommentTotal: number | null;
  uid: string;
  uniqueId: string | null;
  avatarThumbnail: string | null;
};
