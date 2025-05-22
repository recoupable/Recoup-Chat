import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquareOff } from "lucide-react";
import { motion } from "framer-motion";

export function NoMessages() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center h-[70vh] px-4"
      >
        <div className="flex flex-col items-center text-center max-w-md space-y-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="p-4 rounded-full bg-muted"
          >
            <MessageSquareOff className="h-10 w-10 text-muted-foreground" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              No messages found
            </h2>
            <p className="text-muted-foreground">
              This conversation appears to be empty or may have exists.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/chat">
              <Button size="lg" className="mt-4 rounded-xl">
                Start a new conversation
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
