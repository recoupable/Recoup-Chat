import LucideIcon from "@/components/LucideIcon";

interface SocialHandleInputProps {
  platform: string;
  value: string;
  isRemoving?: boolean;
  onRemove?: (platform: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, platform: string) => void;
}

const SocialHandleInput = ({
  platform,
  value,
  isRemoving = false,
  onRemove,
  onChange,
}: SocialHandleInputProps) => {
  return (
    <div
      className={`
        group relative flex items-center gap-3 w-full
        transition-all duration-300 ease-in-out
        ${isRemoving ? "opacity-0 -translate-x-2" : "opacity-100"}
      `}
    >
      <div className="w-20 text-sm font-medium text-gray-500">
        {platform.charAt(0).toUpperCase() + platform.slice(1)}:
      </div>

      <div className="flex-1">
        <input
          id={`${platform}-input`}
          type="text"
          value={value}
          onChange={(e) => onChange(e, platform)}
          className="w-full bg-white text-gray-900 text-sm focus:outline-none border border-gray-200 rounded-lg px-4 py-3"
          placeholder={`@${platform.toLowerCase()}`}
        />
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(platform)}
          className="
            p-1.5 rounded-full
            text-red-500
            transition-transform duration-200
            hover:scale-110
            disabled:opacity-50
          "
          title={`Remove ${platform}`}
          disabled={isRemoving}
        >
          <LucideIcon name="Trash2" size={20} />
        </button>
      )}
    </div>
  );
};

export default SocialHandleInput;
