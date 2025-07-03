import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { youtubeLogin } from "@/lib/youtube/youtubeLogin";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import getYouTubeTokens from "@/lib/supabase/youtubeTokens/getYouTubeTokens";
import { generateUUID } from "@/lib/generateUUID";

export interface YouTubeErrorDisplayProps {
  errorMessage: string;
}

export function YouTubeErrorDisplay({
  errorMessage,
}: YouTubeErrorDisplayProps) {
  const { selectedArtist } = useArtistProvider();
  const { append, messages } = useVercelChatContext();
  const hasCheckedOAuth = useRef(false);

  // Check for successful OAuth and continue conversation
  useEffect(() => {
    console.log('🔍 YouTubeErrorDisplay useEffect triggered');
    
    // Only run once
    if (hasCheckedOAuth.current) {
      console.log('❌ Already checked OAuth, skipping');
      return;
    }

    // Check if this component is part of the latest message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== 'assistant') {
      console.log('❌ Not part of latest assistant message, skipping');
      return;
    }

    console.log('✅ Part of latest message, checking for YouTube tokens');
    hasCheckedOAuth.current = true;

    // Check for valid YouTube tokens
    if (selectedArtist?.account_id) {
      getYouTubeTokens(selectedArtist.account_id)
        .then(tokens => {
          console.log('🔗 YouTube tokens check:', { hasTokens: !!tokens });
          
          if (tokens && tokens.access_token) {
            console.log('🎉 Found valid YouTube tokens, appending success message');
            
            const successMessage = {
              id: generateUUID(),
              role: "user" as const,
              content: "Great! I've successfully connected my YouTube account. Please continue with what you were helping me with.",
            };
            
            append(successMessage);
            console.log('✅ Successfully appended OAuth success message');
          } else {
            console.log('ℹ️ No valid YouTube tokens found');
          }
        })
        .catch(error => {
          console.error('❌ Error checking YouTube tokens:', error);
        });
    } else {
      console.log('❌ No selected artist, cannot check tokens');
    }
  }, [selectedArtist?.account_id, messages, append]);

  return (
    <div className="flex flex-col space-y-3 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 max-w-md">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Youtube className="h-5 w-5 text-gray-600" />
        <span className="font-medium text-gray-800">
          YouTube Access Required
        </span>

        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
          Live
        </span>
      </div>

      {/* Artist Context */}
      <div className="text-xs text-gray-600">
        Artist: <span className="font-medium">{selectedArtist?.account_id}</span>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600">{errorMessage}</p>

      {/* Login Button */}
      <Button
        onClick={() => youtubeLogin(selectedArtist?.account_id)}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        size="sm"
        disabled={!selectedArtist?.account_id}
      >
        <Youtube className="h-4 w-4 mr-2" />
        Connect YouTube Account
      </Button>

      <p className="text-xs text-gray-500 text-center">
        You&apos;ll be redirected to Google to authorize access to your YouTube
        channel for this artist.
      </p>
    </div>
  );
}
