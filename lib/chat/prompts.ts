import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import getSystemMessage from "./getSystemMessage";

const createSystemMessage = (context: string, question: string) =>
  new SystemMessage(getSystemMessage(context, question));

const createHumanMessage = (input: string) => new HumanMessage(input);

export const formatPrompt = async (
  context: string,
  question: string,
  input: string
) => {
  return [createSystemMessage(context, question), createHumanMessage(input)];
};
