import LucideIcon from "@/components/LucideIcon";

interface SocialHandleInputProps {
  platform: string;
  value: string;
  isRemoving?: boolean;
  onRemove?: (platform: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, platform: string) => void;
}

const platformIcons = {
  spotify: "Music2",
  twitter: "Twitter",
  tiktok: "Ticket",
  instagram: "Instagram",
};

const SocialHandleInput = ({
  platform,
  value,
  isRemoving = false,
  onRemove,
  onChange,
}: SocialHandleInputProps) => {
  const iconName =
    platformIcons[platform.toLowerCase() as keyof typeof platformIcons];

  return (
    <div
      className={`
        group relative flex items-center gap-3 w-full
        transition-all duration-300 ease-in-out
        ${isRemoving ? "opacity-0 -translate-x-2" : "opacity-100"}
      `}
    >
      <div className="flex items-center justify-center w-8 h-8 text-gray-500">
        {iconName && <LucideIcon name={iconName} size={20} />}
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
            opacity-0 group-hover:opacity-100
            p-1.5 rounded-full
            hover:bg-gray-100
            transition-all duration-200
            disabled:opacity-50
            text-lg
          "
          title={`Remove ${platform}`}
          disabled={isRemoving}
        >
          🗑️
        </button>
      )}
    </div>
  );
};

export default SocialHandleInput;
