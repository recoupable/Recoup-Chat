export interface TimelineMoment {
  id: string;
  timestamp: number;
  content: string;
  type: 'post' | 'comment' | 'interaction' | 'milestone';
  isVisible: boolean;
  metadata?: {
    author?: string;
    platform?: string;
    engagement?: number;
    [key: string]: any;
  };
}

export interface Moment {
  id: string;
  timestamp: number;
  content: string;
  // Note: Missing isVisible and other timeline-specific properties
}

export interface TimelineApiResponse {
  moments: TimelineMoment[];
  pagination?: {
    hasMore: boolean;
    nextCursor?: string;
  };
}