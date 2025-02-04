const analyzeArtist = (question: string) => ({
  type: "function",
  function: {
    name: "analyzeArtist",
    description: `Please only trigger this tool for questions in the example format below.
    Questions must begin with the word **Analyze** to trigger this tool.

    Example questions that MUST trigger this tool:
    - "Analyze [handles]'s [social platform] posts from this week."
    - "Analyze my musician."
    - "Analyze my artists' [social platform] account."
    - "Analyze [handle]."`,
    parameters: {
      type: "object",
      properties: {
        handle: {
          type: "handle",
          description: "The handle to be analyzed.",
        },
        social_platform: {
          type: "social_platform",
          description: "The social platform to be analyzed.",
        },
        question,
      },
    },
  },
});
export default analyzeArtist;
