"use client";

import { useTimelineApi } from "@/hooks/useTimelineApi";
import { type TimelineMoment } from "@/types/Timeline";
import HideButton from "@/components/HideButton";

interface TimelineExampleProps {
  artistId: string;
}

const TimelineExample = ({ artistId }: TimelineExampleProps) => {
  const { data: moments, isLoading, error } = useTimelineApi({
    artistId,
    limit: 10,
    includeHidden: false,
  });

  const handleVisibilityChange = (moment: TimelineMoment, isHidden: boolean) => {
    console.log(`Moment ${moment.id} visibility changed to:`, isHidden ? 'hidden' : 'visible');
    // You can add additional logic here, such as:
    // - Updating local state
    // - Showing notifications
    // - Triggering refetch of data
  };

  if (isLoading) {
    return <div className="p-4">Loading timeline moments...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  if (!moments || moments.length === 0) {
    return <div className="p-4">No timeline moments found.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Timeline Moments</h2>
      {moments.map((moment) => (
        <div 
          key={moment.id} 
          className="group/moment border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">
                  {moment.type} • {new Date(moment.createdAt).toLocaleDateString()}
                </span>
                {moment.metadata?.platform && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {moment.metadata.platform}
                  </span>
                )}
              </div>
              <p className="text-gray-800">{moment.content}</p>
              {moment.metadata?.engagement && (
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>❤️ {moment.metadata.engagement.likes}</span>
                  <span>🔄 {moment.metadata.engagement.shares}</span>
                  <span>💬 {moment.metadata.engagement.comments}</span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <HideButton 
                moment={moment}
                onVisibilityChange={handleVisibilityChange}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineExample;