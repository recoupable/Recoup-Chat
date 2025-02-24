import { HTML_RESPONSE_FORMAT_INSTRUCTIONS } from "../consts";

const getSystemMessage = (context: string, question: string) => {
  return `
*****
[Context]: ${context}
*****
[Question]: ${question}
*****
[Instruction]: 
*****
Do not include descriptive text before or after your answer. Answer the question only based on given musician context.
If fan context is provided, please try to provide accurate information about fans, including their names.
${HTML_RESPONSE_FORMAT_INSTRUCTIONS}
`;
};

export default getSystemMessage;
