import { Message } from "ai";

const rearrangesMessages = (messages: Message[]) => {
  const flattenMessages = [];
  const usersMessage = messages.filter((r) => r.role === "user");
  const userCount = usersMessage.length;
  const assistantMessages = messages.filter((r) => r.role === "assistant");
  const assistantCount = assistantMessages.length;

  const maxCount = Math.max(userCount, assistantCount);

  let userIndex = 0;
  let assistantIndex = 0;

  for (let i = 0; i < maxCount * 2; i++) {
    if (i % 2 === 0 && userIndex < userCount) {
      // Push user role
      flattenMessages.push(usersMessage[userIndex]);
      userIndex++;
    } else if (i % 2 !== 0 && assistantIndex < assistantCount) {
      // Push assistant role
      flattenMessages.push(assistantMessages[assistantIndex]);
      assistantIndex++;
    }
  }

  return flattenMessages;
};

export default rearrangesMessages;
