import { tool } from "ai";
import { z } from "zod";

const mermaidSyntaxGeneration = tool({
    description: "Generates mermaid syntax for a given context",
    parameters: z.object({
        context: z.string(),
    }),
    execute: async ({ context }) => {
        const text = `flowchart LR
  A[Start] --> B{Condition?}
  B -- Yes --> C[Do something]
  B -- No  --> D[Do something else]
  C --> E[End]
  D --> E`;

        console.log('Mermaid Syntax Generation', context);
        // embed it in a Markdown‐style Mermaid code block
        const mermaidSyntax = `\`\`\`mermaid
${text}
\`\`\``;
        return {
            mermaidSyntax,
            isError: false,
        };
    },
});

export default mermaidSyntaxGeneration;
