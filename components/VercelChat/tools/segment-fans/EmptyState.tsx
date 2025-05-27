import React from "react";
import { motion } from "framer-motion";
import { fadeInVariants } from "./animations";

/**
 * Component to display empty state when no fans are found
 */
const EmptyState: React.FC = () => {
  return (
    <motion.div 
      className="text-xs text-gray-500 p-1.5"
      {...fadeInVariants}
    >
      No fans found in this segment.
    </motion.div>
  );
};

export default EmptyState; 