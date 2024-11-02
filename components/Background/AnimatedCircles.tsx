const AnimatedCircles = () => {
  return (
    <div className="fixed right-0 left-[60px] top-0 bottom-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80 dark:from-black/80 dark:to-black/80 z-10" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Largest circle */}
        <div className="absolute w-[140vh] h-[140vh] opacity-0
                      border-[1px] border-gray-800/30 dark:border-gray-400/30 rounded-full
                      animate-expand-slowest" 
        />
        
        {/* Middle circle */}
        <div className="absolute w-[100vh] h-[100vh] opacity-0
                      border-[1px] border-gray-800/30 dark:border-gray-400/30 rounded-full
                      animate-expand-slower"
        />
        
        {/* Smallest circle */}
        <div className="absolute w-[60vh] h-[60vh] opacity-0
                      border-[1px] border-gray-800/30 dark:border-gray-400/30 rounded-full
                      animate-expand-slow"
        />
      </div>
    </div>
  );
};

export default AnimatedCircles;
