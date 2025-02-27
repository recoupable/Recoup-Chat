import { formatText } from "@/lib/chat/assistant/textFormatting";

interface FormattedTextProps {
  content: string;
  className?: string;
}

export const FormattedText = ({
  content,
  className = "",
}: FormattedTextProps) => {
  return (
    <div
      className={`text-sm font-sans max-w-[500px] text-pretty break-words ${className}`}
      dangerouslySetInnerHTML={{
        __html: formatText(content),
      }}
    />
  );
};

export default FormattedText;
