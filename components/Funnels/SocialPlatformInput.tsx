import { X } from "lucide-react";

interface SocialPlatformInputProps {
  id: string;
  value: string;
  isRemoving: boolean;
  onRemove: (id: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}

const SocialPlatformInput = ({
  id,
  value,
  isRemoving,
  onRemove,
  onChange,
}: SocialPlatformInputProps) => {
  return (
    <div
      className={`
        flex gap-2 items-center w-full
        transition-all duration-300 ease-in-out
        ${isRemoving ? "opacity-0 -translate-x-2" : "opacity-100"}
      `}
    >
      <p className="min-w-[90px]">{id.toUpperCase()}: </p>
      <div className="flex-1 flex items-center gap-2 max-w-[200px]">
        <input
          value={value}
          className="w-full border rounded-md border-grey-700 px-4 py-1 !outline-none transition-colors focus:border-purple-dark"
          onChange={(e) => onChange(e, id)}
        />
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors group shrink-0"
          title="Remove platform"
          disabled={isRemoving}
        >
          <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default SocialPlatformInput;
