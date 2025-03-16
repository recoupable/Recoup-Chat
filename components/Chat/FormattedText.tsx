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
      className={`text-sm font-sans max-w-full text-pretty break-words formatted-content first-p-mt-0 mt-1.5 ${className}`}
      dangerouslySetInnerHTML={{
        __html: formatText(content),
      }}
    />
  );
};

export default FormattedText;
