import React from "react";
import { FileText } from "lucide-react";

interface CustomInstructionsSectionProps {
  instruction: string;
}

const CustomInstructionsSection: React.FC<CustomInstructionsSectionProps> = ({
  instruction,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Custom Instructions
      </h3>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <p className="text-gray-300 text-sm leading-relaxed">
          {instruction}
        </p>
      </div>
    </div>
  );
};

export default CustomInstructionsSection; 