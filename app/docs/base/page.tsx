"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const languages = [
  { name: "cURL", value: "curl" },
  { name: "Python", value: "python" },
  { name: "JavaScript", value: "javascript" },
  { name: "TypeScript", value: "typescript" },
];

const codeExamples = {
  curl: `curl -X GET "https://api.recoupable.com/v1/agent" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
  python: `import requests

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.get("https://api.recoupable.com/v1/agent", headers=headers)
data = response.json()`,
  javascript: `fetch("https://api.recoupable.com/v1/agent", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
  typescript: `const fetchAgent = async () => {
  const response = await fetch("https://api.recoupable.com/v1/agent", {
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
    }
  });
  const data: AgentResponse = await response.json();
  return data;
};`,
};

const exampleResponse = {
  id: "agent_123",
  name: "Music Marketing Assistant",
  description: "AI-powered assistant for music marketing strategies",
  capabilities: ["Campaign Analysis", "Fan Engagement", "Content Strategy"],
  status: "active",
  created_at: "2024-01-15T12:00:00Z",
};

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 rounded bg-gray-800 hover:bg-gray-700"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function AgentKitDocs() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8">AgentKit Documentation</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
        <p className="mb-4">
          To use the AgentKit API, you&apos;ll need an API key. You can find
          your API key in your{" "}
          <a href="/dashboard" className="text-blue-500 hover:text-blue-600">
            dashboard settings
          </a>
          .
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            Keep your API key secure and never share it publicly. If you believe
            your key has been compromised, you can generate a new one in your
            dashboard.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Making Requests</h2>
        <div className="mb-4">
          <div className="flex gap-2 mb-4">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded ${
                  selectedLanguage.value === lang.value
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
          <CodeBlock
            code={
              codeExamples[selectedLanguage.value as keyof typeof codeExamples]
            }
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Response Format</h2>
        <p className="mb-4">
          The API returns JSON responses. Here&apos;s an example response:
        </p>
        <CodeBlock code={JSON.stringify(exampleResponse, null, 2)} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Available Properties</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Agent Object</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 border">Property</th>
                  <th className="text-left p-4 border">Type</th>
                  <th className="text-left p-4 border">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border">id</td>
                  <td className="p-4 border">string</td>
                  <td className="p-4 border">
                    Unique identifier for the agent
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border">name</td>
                  <td className="p-4 border">string</td>
                  <td className="p-4 border">Name of the agent</td>
                </tr>
                <tr>
                  <td className="p-4 border">description</td>
                  <td className="p-4 border">string</td>
                  <td className="p-4 border">
                    Description of the agent&apos;s capabilities
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border">capabilities</td>
                  <td className="p-4 border">string[]</td>
                  <td className="p-4 border">List of agent capabilities</td>
                </tr>
                <tr>
                  <td className="p-4 border">status</td>
                  <td className="p-4 border">string</td>
                  <td className="p-4 border">Current status of the agent</td>
                </tr>
                <tr>
                  <td className="p-4 border">created_at</td>
                  <td className="p-4 border">string</td>
                  <td className="p-4 border">
                    ISO 8601 timestamp of when the agent was created
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">View Your Agent</h2>
        <p className="mb-4">
          You can view and manage your agent through the Recoup dashboard. Visit
          your{" "}
          <a
            href="/dashboard/agents"
            className="text-blue-500 hover:text-blue-600"
          >
            agents page
          </a>{" "}
          to see your agent&apos;s performance, adjust settings, and monitor
          usage.
        </p>
      </section>
    </div>
  );
}
