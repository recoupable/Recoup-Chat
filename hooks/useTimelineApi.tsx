"use client";

import { useState, useCallback } from 'react';
import { TimelineMoment, TimelineApiResponse } from '@/types/Timeline';

interface UseTimelineApiReturn {
  moments: TimelineMoment[];
  loading: boolean;
  error: string | null;
  fetchTimeline: (accountId?: string) => Promise<void>;
  hideMoment: (momentId: string) => Promise<void>;
  showMoment: (momentId: string) => Promise<void>;
}

export const useTimelineApi = (): UseTimelineApiReturn => {
  const [moments, setMoments] = useState<TimelineMoment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = useCallback(async (accountId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/timeline${accountId ? `?accountId=${accountId}` : ''}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch timeline');
      }
      
      const data: TimelineApiResponse = await response.json();
      setMoments(data.moments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const hideMoment = useCallback(async (momentId: string) => {
    try {
      const response = await fetch(`/api/timeline/${momentId}/hide`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to hide moment');
      }
      
      // Update local state
      setMoments((prev: TimelineMoment[]) => 
        prev.map((moment: TimelineMoment) => 
          moment.id === momentId 
            ? { ...moment, isVisible: false }
            : moment
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to hide moment');
    }
  }, []);

  const showMoment = useCallback(async (momentId: string) => {
    try {
      const response = await fetch(`/api/timeline/${momentId}/show`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to show moment');
      }
      
      // Update local state
      setMoments((prev: TimelineMoment[]) => 
        prev.map((moment: TimelineMoment) => 
          moment.id === momentId 
            ? { ...moment, isVisible: true }
            : moment
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to show moment');
    }
  }, []);

  return {
    moments,
    loading,
    error,
    fetchTimeline,
    hideMoment,
    showMoment,
  };
};