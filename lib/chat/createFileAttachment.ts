import { MessageFileAttachment } from "@/types/Chat";

const createMessageFileAttachment = (file: {
  url: string;
  type: string;
}): MessageFileAttachment | null => {
  if (file.type === "application/pdf") {
    return {
      type: "file" as const,
      data: new URL(file.url),
      mimeType: file.type,
    };
  }

  if (file.type.startsWith("image")) {
    return {
      type: "image",
      image: file.url,
    };
  }

  return null;
};

export default createMessageFileAttachment;