import React from "react";
import { motion } from "framer-motion";
import { headerVariants } from "./animations";

interface SegmentHeaderProps {
  segmentName: string;
  totalCount: number;
}

/**
 * Header component showing segment name and total count
 */
const SegmentHeader: React.FC<SegmentHeaderProps> = ({ segmentName, totalCount }) => {
  return (
    <motion.div 
      className="flex items-center space-x-2 p-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800"
      variants={headerVariants}
    >
      <div className="flex-shrink-0">
        <span className="text-xs font-medium">
          {segmentName || "Segment"} Fans
        </span>
        <span className="text-xs text-gray-500 ml-1.5">
          ({totalCount})
        </span>
      </div>
    </motion.div>
  );
};

export default SegmentHeader; 