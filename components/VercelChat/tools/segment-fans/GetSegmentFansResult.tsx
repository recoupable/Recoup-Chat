import React from "react";
import { motion } from "framer-motion";
import { SegmentFansResult } from "@/types/fans";
import FanCard from "./FanCard";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import SegmentHeader from "./SegmentHeader";
import { containerVariants } from "./animations";

/**
 * Component to display segment fans data
 */
const GetSegmentFansResult: React.FC<{ result: SegmentFansResult }> = ({ result }) => {
  // Handle error state
  if (!result.success || result.status === "error") {
    return <ErrorState message={result.message} />;
  }

  // Handle empty state
  if (!result.fans || result.fans.length === 0) {
    return <EmptyState />;
  }

  const segmentName = result.fans[0]?.segment_name || "Segment";
  const { total_count } = result.pagination;

  return (
    <motion.div 
      className="space-y-1.5 max-w-full"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Header with segment name and total count */}
      <SegmentHeader segmentName={segmentName} totalCount={total_count} />

      {/* Grid of fan cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
        {result.fans.map((fan, index) => (
          <FanCard key={fan.id} fan={fan} index={index} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default GetSegmentFansResult; 