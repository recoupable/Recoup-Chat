import { AGENT_API } from "../consts";

const getAgent = async (agentId: string) => {
  try {
    const response = await fetch(
      `${AGENT_API}/api/agentkit?agentId=${agentId}`,
    );
    const data = await response.json();

    return {
      agent: data.agent,
      comments: data?.comments || null,
    };
  } catch (error) {
    console.error(error);
    return {
      agents: null,
      comments: null,
    };
  }
};

export default getAgent;
