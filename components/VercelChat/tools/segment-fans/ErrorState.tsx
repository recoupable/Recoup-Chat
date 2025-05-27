import React from "react";
import { motion } from "framer-motion";
import { fadeInVariants } from "./animations";

interface ErrorStateProps {
  message?: string;
}

/**
 * Component to display error state for segment fans
 */
const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  return (
    <motion.div 
      className="text-xs text-red-500 p-1.5 rounded bg-red-50"
      {...fadeInVariants}
    >
      Error: {message || "Unknown error"}
    </motion.div>
  );
};

export default ErrorState; 