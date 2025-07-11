"use client";

import React, { useState, useEffect } from "react";
import { X, MessageCircle, Info } from "lucide-react";
import { VercelChatProvider, useVercelChatContext } from "@/providers/VercelChatProvider";
import { Messages } from "@/components/VercelChat/messages";
import ChatInput from "@/components/VercelChat/ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "ai";

export interface MetadataItem {
  title: string;
  artist: string;
  album: string;
  designer: string;
  devs: string[];
  producers?: string[];
  description: string;
  id: string;
}

interface MetadataPopupProps {
  metadata: MetadataItem;
  isOpen: boolean;
  onClose: () => void;
}

// Chat tab component that uses the chat context
function ChatTab() {
  const {
    messages,
    status,
    isLoading,
    hasError,
    isGeneratingResponse,
    handleSendMessage,
    stop,
    setInput,
    input,
    setMessages,
    reload,
  } = useVercelChatContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <p>Failed to load chat. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <Messages
          messages={messages}
          status={status}
          setMessages={setMessages}
          reload={reload}
        />
      </div>
      <div className="mt-4">
        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isGeneratingResponse={isGeneratingResponse}
          onStop={stop}
        />
      </div>
    </div>
  );
}

// Static info tab component  
function InfoTab({ metadata }: { metadata: MetadataItem }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{metadata.title}</h2>
        <p className="text-gray-300 text-sm leading-relaxed">{metadata.description}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Artist</h3>
          <p className="text-white">{metadata.artist}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Album</h3>
          <p className="text-white">{metadata.album}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Designer</h3>
          <p className="text-white">{metadata.designer}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Devs</h3>
          <div className="space-y-1">
            {metadata.devs.map((dev, index) => (
              <p key={index} className="text-white">• {dev}</p>
            ))}
          </div>
        </div>

        {metadata.producers && metadata.producers.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Producers</h3>
            <div className="space-y-1">
              {metadata.producers.map((producer, index) => (
                <p key={index} className="text-white">• {producer}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main popup component
function MetadataPopupContent({ metadata, onClose }: { metadata: MetadataItem; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'info' | 'chat'>('info');
  
  // Create initial message for chat context
  const initialMessages: Message[] = [
    {
      id: 'initial',
      role: 'assistant',
      content: `Hi! I'm here to help you learn more about "${metadata.title}" by ${metadata.artist}. Feel free to ask me anything about this project, the artists involved, or anything else you'd like to know!`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-purple-600 to-blue-600">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        <h1 className="text-xl font-bold text-white pr-12">{metadata.title}</h1>
        <p className="text-purple-100 text-sm mt-1">by {metadata.artist}</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'info'
              ? 'bg-gray-700 text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-750'
          }`}
        >
          <Info className="w-4 h-4" />
          Info
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'chat'
              ? 'bg-gray-700 text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-750'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 h-96 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'info' ? (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto"
            >
              <InfoTab metadata={metadata} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <VercelChatProvider chatId={`metadata-${metadata.id}`} initialMessages={initialMessages}>
                <ChatTab />
              </VercelChatProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Main exported component
export function MetadataPopupWithChat({ metadata, isOpen, onClose }: MetadataPopupProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <MetadataPopupContent metadata={metadata} onClose={onClose} />
    </div>
  );
}

export default MetadataPopupWithChat;