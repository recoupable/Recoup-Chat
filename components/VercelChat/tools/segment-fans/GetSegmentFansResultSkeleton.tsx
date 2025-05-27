import React from "react";
import { motion } from "framer-motion";

/**
 * Loading skeleton for segment fans data
 * Matches the structure defined in types/fans.ts
 */
const GetSegmentFansResultSkeleton = ({ count = 9 }: { count?: number }) => {
  // Animation variants for skeleton pulse effect
  const pulseVariants = {
    initial: { opacity: 0.6 },
    animate: { 
      opacity: 0.9,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 0.8
      }
    }
  };

  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      className="space-y-1.5 max-w-full"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Header skeleton */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center space-x-2 p-1.5 rounded-xl bg-gray-50 border border-gray-200"
      >
        <motion.div 
          className="h-4 w-24 bg-gray-200 rounded"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="h-3 w-10 bg-gray-200 rounded ml-1"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      {/* Fan cards grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
        {/* Generate multiple skeleton cards */}
        {Array.from({ length: count }).map((_, index) => (
          <motion.div 
            key={index} 
            className="flex items-center space-x-2 p-1.5 rounded-xl bg-gray-50 border border-gray-200"
            variants={itemVariants}
          >
            {/* Avatar skeleton */}
            <motion.div 
              className="h-6 w-6 rounded-full bg-gray-200 flex-shrink-0"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            />
            
            <div className="flex-grow min-w-0 space-y-1">
              {/* Username and region skeleton */}
              <div className="flex items-center justify-between">
                <motion.div 
                  className="h-3 w-16 bg-gray-200 rounded"
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                />
                <motion.div 
                  className="h-3 w-10 bg-gray-200 rounded-full"
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
              
              {/* Bio skeleton */}
              <motion.div 
                className="h-2 w-full bg-gray-200 rounded"
                variants={pulseVariants}
                initial="initial"
                animate="animate"
              />
              
              {/* Stats skeleton */}
              <div className="flex gap-2">
                <motion.div 
                  className="h-2 w-8 bg-gray-200 rounded"
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                />
                <motion.div 
                  className="h-2 w-8 bg-gray-200 rounded"
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default GetSegmentFansResultSkeleton; 