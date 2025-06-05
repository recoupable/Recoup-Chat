import { Button } from "@/components/ui/button";
import { ToolSuccessResponse } from "@/types/youtube";
import { CheckCircle, AlertCircle, Youtube } from "lucide-react";

interface YouTubeLoginResult {
  success: boolean;
  message: string;
  status?: string;
}

const YoutubeLoginResult = ({
  result,
}: {
  result: ToolSuccessResponse | YouTubeLoginResult;
}) => {
  const isSuccess = result.success;

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200 my-2 text-gray-800 w-fit md:rounded-xl">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
          isSuccess ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
      </div>

      <div className="flex-grow min-w-0 space-y-2">
        <p className="font-medium text-sm leading-tight">
          {isSuccess ? "YouTube Connected" : "Authentication Required"}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed max-w-[400px]">
          {result.message ||
            (isSuccess
              ? "YouTube access confirmed"
              : "Please connect your YouTube account")}
        </p>
        {!isSuccess && (
          <div className="pt-1">
            <Button className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors w-fit h-auto">
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
