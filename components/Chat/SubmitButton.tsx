import { ArrowUpRightIcon } from "lucide-react";

const SubmitButton = ({ isChatboxFocused }: { isChatboxFocused: boolean }) => {
  return (
    <button
      type="submit"
      className={`absolute bottom-1.5 right-1.5 p-1.5 rounded-md transition-all duration-150 ease-in-out ${
        isChatboxFocused
          ? "bg-[#00309A] text-white hover:bg-[#002277]"
          : "bg-white text-[#00309A] border border-[#00309A] hover:bg-gray-100"
      } hover:shadow-md group-hover:scale-105`}
      aria-label="Send message"
    >
      <ArrowUpRightIcon className="w-3 h-3" />
    </button>
  );
};

export default SubmitButton;
