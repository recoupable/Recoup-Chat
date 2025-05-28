import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

const SkeletonShimmer = ({ className, children }: SkeletonShimmerProps) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden bg-gray-200 rounded",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{
          translateX: ["-100%", "200%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 0.5,
        }}
      />
    </motion.div>
  );
};

export default SkeletonShimmer; 