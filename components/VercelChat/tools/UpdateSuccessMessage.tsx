import React from "react";
import { CheckCircle } from "lucide-react";

interface UpdateSuccessMessageProps {
  message: string;
}

const UpdateSuccessMessage: React.FC<UpdateSuccessMessageProps> = ({
  message,
}) => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden max-w-2xl w-full my-4 p-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <span className="text-white font-medium">{message}</span>
      </div>
    </div>
  );
};

export default UpdateSuccessMessage; 