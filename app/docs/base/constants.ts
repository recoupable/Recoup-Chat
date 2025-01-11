export const languages = [
  { name: "cURL", value: "curl" },
  { name: "Python", value: "python" },
  { name: "JavaScript", value: "javascript" },
  { name: "TypeScript", value: "typescript" },
];

export const codeExamples = {
  curl: `curl -X GET "https://api.recoupable.com/v1/agent" \\
  -H "campaignId: YOUR_CAMPAIGN_ID" \\
  -H "Content-Type: application/json"`,
  python: `import requests

headers = {
    "campaignId": "YOUR_CAMPAIGN_ID",
    "Content-Type": "application/json"
}

response = requests.get("https://api.recoupable.com/v1/agent", headers=headers)
data = response.json()`,
  javascript: `fetch("https://api.recoupable.com/v1/agent", {
  headers: {
    "campaignId": "YOUR_CAMPAIGN_ID",
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
  typescript: `const fetchAgent = async () => {
  const response = await fetch("https://api.recoupable.com/v1/agent", {
    headers: {
      "campaignId": "YOUR_CAMPAIGN_ID",
      "Content-Type": "application/json"
    }
  });
  const data: AgentResponse = await response.json();
  return data;
};`,
} as const;

export const exampleResponse = {
  status: "success",
  message: "Agent completed execution (33s timeout reached)",
  walletAddress: "0xBC0F483b793EAD92F015a2cd27C819F0b7722308",
} as const;

export const responseProperties = [
  {
    name: "status",
    type: "string",
    description: 'Status of the agent execution ("success" or "error")',
  },
  {
    name: "message",
    type: "string",
    description: "Detailed message about the agent execution",
  },
  {
    name: "walletAddress",
    type: "string",
    description: "The Base wallet address associated with the agent",
  },
] as const;
