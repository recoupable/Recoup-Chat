import { Button } from "@/components/ui/button";
import { useYouTubeAccess } from "@/hooks/useYouTubeAccess";
import { ToolSuccessResponse } from "@/types/youtube";
import { CheckCircle, AlertCircle, Youtube, Loader } from "lucide-react";

type YouTubeLoginResult = ToolSuccessResponse;

const YoutubeLoginResult = ({ result }: { result: YouTubeLoginResult }) => {
  const { isCheckingStatus, isAuthenticated, login } = useYouTubeAccess(result);

  // Show loading state while checking authentication
  if (isCheckingStatus) {
    return (
      <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 text-gray-800 w-fit md:rounded-xl">
        <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-gray-200">
          <Loader className="w-5 h-5 text-gray-600 animate-spin" />
        </div>
        <div className="flex-grow min-w-0 space-y-2">
          <p className="font-medium text-sm leading-tight">
            Checking YouTube Access...
          </p>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[400px]">
            Verifying your authentication status
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 text-gray-800 w-fit md:rounded-xl">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
          isAuthenticated ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {isAuthenticated ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
      </div>

      <div className="flex-grow min-w-0 space-y-2">
        <p className="font-medium text-sm leading-tight">
          {isAuthenticated ? "YouTube Connected" : "Authentication Required"}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed max-w-[400px]">
          {isAuthenticated
            ? "YouTube access confirmed. Now you can ask any Youtube related questions."
            : "Please connect your YouTube account to continue."}
        </p>
        {!isAuthenticated && (
          <div className="pt-1">
            <Button
              onClick={login}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors w-fit h-auto"
            >
              <Youtube className="w-3 h-3" />
              Connect YouTube
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeLoginResult;
