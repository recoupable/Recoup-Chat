import { FileImage, MessageSquareText, ImageIcon } from "lucide-react";

const FileDragOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-lg">
      <div className="relative w-24 h-24 mb-6">
        {/* Code icon (top left) */}
        <div className="absolute left-0 top-2 bg-blue-200 dark:bg-blue-900/30 p-3 rounded-2xl transform -rotate-12 shadow-sm opacity-50 scale-75">
          <MessageSquareText className="h-6 w-6 text-blue-600" />
        </div>

        {/* Document icon (top right) */}
        <div className="absolute right-0 top-0 bg-blue-300 dark:bg-blue-800/40 p-3 rounded-2xl transform rotate-12 shadow-sm opacity-60 scale-90">
          <FileImage className="h-6 w-6 text-blue-700" />
        </div>

        {/* Image icon (bottom center) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 bg-blue-500 dark:bg-blue-700/50 p-3 rounded-2xl shadow-sm z-10">
          <ImageIcon className="h-7 w-7 text-white" />
        </div>
      </div>
      <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-100 mb-2">
        Add anything
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Drop any file here to add it to the conversation
      </p>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Supported formats: JPG, PNG, GIF, WEBP, PDF
      </div>
    </div>
  );
};

export default FileDragOverlay;
