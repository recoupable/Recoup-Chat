import React from "react";
import { Calendar, Clock } from "lucide-react";

const CreateScheduledActionsSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-2xl animate-pulse">
      {/* Loading Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="h-5 w-5 bg-slate-300 rounded-full mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <div className="h-4 bg-slate-300 rounded w-48" />
          </div>
        </div>
      </div>

      {/* Loading Actions List */}
      <div className="space-y-3">
        <div className="space-y-2">
          {/* Skeleton Action Cards */}
          {[1, 2].map((index) => (
            <div 
              key={index}
              className="bg-white border border-slate-200 rounded-lg p-3 space-y-2"
            >
              {/* Action Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <div className="h-4 bg-slate-300 rounded w-32" />
                </div>
                <div className="h-5 bg-slate-300 rounded-full w-16" />
              </div>
              
              {/* Action Details */}
              <div className="space-y-1">
                <div className="h-3 bg-slate-300 rounded w-full" />
                <div className="h-3 bg-slate-300 rounded w-3/4" />
              </div>
              
              {/* Action Metadata */}
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 bg-slate-300 rounded" />
                  <div className="h-3 bg-slate-300 rounded w-20" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 bg-slate-300 rounded" />
                  <div className="h-3 bg-slate-300 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Message */}
      <div className="mt-4 text-center">
        <div className="h-4 bg-slate-300 rounded w-64 mx-auto" />
      </div>
    </div>
  );
};

export default CreateScheduledActionsSkeleton;