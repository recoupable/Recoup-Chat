import React from "react";
import { motion } from "framer-motion";
import { Fan } from "@/types/fans";
import formatFollowerCount from "@/lib/utils/formatFollowerCount";

interface FanCardProps {
  fan: Fan;
  index: number;
}

// Animation variant for items
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

const FanCard: React.FC<FanCardProps> = ({ fan, index }) => {
  return (
    <motion.div 
      key={fan.id} 
      className="flex items-center space-x-2 p-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800"
      variants={itemVariants}
      custom={index}
    >
      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={fan.avatar}
          alt={fan.username}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center">
          <p className="text-xs font-medium truncate">{fan.username}</p>
          <span className="ml-1.5 text-[10px] text-gray-500 px-1 py-0.5 bg-gray-100 rounded-full">
            {fan.region}
          </span>
        </div>
        
        <p className="text-[10px] text-gray-500 truncate">{fan.bio}</p>
        
        <div className="text-[10px] text-gray-500">
          {formatFollowerCount(fan.follower_count)} • {formatFollowerCount(fan.following_count)}
        </div>
      </div>
    </motion.div>
  );
};

export default FanCard; 