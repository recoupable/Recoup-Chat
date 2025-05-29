import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SkeletonShimmer from "../ui/SkeletonShimmer";

interface ArtistSkeletonProps {
  isMini?: boolean;
  index?: number;
}

const ArtistSkeleton = ({ isMini, index = 0 }: ArtistSkeletonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.1, // Staggered animation
      }}
      className={cn(
        "py-2 w-full",
        isMini
          ? "flex justify-center items-center"
          : "flex gap-3 items-center px-2"
      )}
    >
      {/* Avatar Skeleton */}
      <div className="relative">
        <SkeletonShimmer className="w-8 h-8 aspect-1/1 rounded-full min-w-8 min-h-8" />
      </div>
      
      {/* Name and Settings Skeleton - Only show when expanded */}
      {!isMini && (
        <>
          {/* Name Skeleton */}
          <div className="grow">
            <SkeletonShimmer className="h-4 w-20 rounded" />
          </div>
          
          {/* Settings Button Skeleton */}
          <div className="ml-auto flex-shrink-0">
            <SkeletonShimmer className="w-5 h-5 rounded" />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ArtistSkeleton; 