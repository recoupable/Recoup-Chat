export interface TimelineMoment {
  id: string;
  timestamp: number;
  content: string;
  type: 'post' | 'comment' | 'interaction' | 'event';
  metadata?: {
    platform?: 'twitter' | 'instagram' | 'tiktok' | 'youtube';
    engagement?: {
      likes: number;
      shares: number;
      comments: number;
    };
    visibility?: 'public' | 'private' | 'hidden';
  };
  createdAt: string;
  updatedAt: string;
}

export interface TimelineApiResponse {
  status: 'success' | 'error';
  moments: TimelineMoment[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface TimelineApiError {
  message: string;
  code: string;
  status?: number;
}