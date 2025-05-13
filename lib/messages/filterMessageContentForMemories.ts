import { Message } from "ai";

const filterMessageContentForMemories = (message: Message) => {
  return {
    role: message.role,
    parts: message.parts,
    content: message.content,
    experimental_attachments: message.experimental_attachments,
  };
};

export default filterMessageContentForMemories;
