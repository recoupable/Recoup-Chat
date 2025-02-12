import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

interface NextButtonProps {
  onContinue: () => Promise<void>;
  disabled?: boolean;
}

const NextButton = ({ onContinue, disabled = false }: NextButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onContinue();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="
        inline-flex items-center justify-center gap-2
        bg-black text-white rounded-lg
        px-6 py-2
        hover:bg-gray-800
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        text-sm font-medium
      "
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Next
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
};

export default NextButton;
