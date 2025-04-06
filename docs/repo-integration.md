# Recoup Repository Integration Documentation

## Overview

This document explains how Recoup-Chat and Recoup-Agent-APIs work together to provide a comprehensive AI agent platform for the music industry. The integration between these two repositories enables real-time chat interactions, data analysis, and actionable insights for music executives.

## Repository Architecture

### Recoup-Chat

Recoup-Chat is a Next.js application that serves as the frontend interface for users to interact with the AI agents. Based on the codebase, Recoup-Chat handles:

- User authentication and session management
- Chat interface and message streaming
- UI components for displaying insights and analytics
- Client-side state management
- API routes for proxying requests to Recoup-Agent-APIs
- Client-side agent processing for simple chat interactions

The application uses React context providers and custom hooks to manage state and interactions with the Recoup-Agent-APIs.

### Recoup-Agent-APIs

According to the [GitHub repository](https://github.com/recoupable/Recoup-Agent-APIs), Recoup-Agent-APIs provides a comprehensive interface for managing and interacting with the wrapped funnel system. The Recoup-Agent-APIs repository structure includes:

- `/agents` - Contains agent implementations for different functionalities
- `/controllers` - API controllers that handle incoming requests
- `/lib` - Utility functions and libraries
- `/types` - TypeScript type definitions
- `/docs` - Documentation files
- `/tests` - Test files

The Recoup-Agent-APIs repository is built with Node.js and uses Express.js for its API endpoints.

## Connection Points

The two repositories connect through several key integration points that can be verified in the Recoup-Chat codebase:

### 1. API Endpoint Configuration

Recoup-Chat defines the Recoup-Agent-APIs endpoint in its constants:

```typescript
// lib/consts.ts
// Define the base URL for all API calls to the Recoup-Agent-APIs backend
export const AGENT_API = "https://api.recoupable.com";
```

This constant is used throughout the Recoup-Chat codebase to make API calls to the Recoup-Agent-APIs backend.

### 2. Dual Agent Processing Architecture

Recoup-Chat implements a dual approach to agent processing:

#### Client-Side Agent Processing (for Chat)

For simple chat interactions, Recoup-Chat initializes and runs agents directly in the Next.js server environment using LangGraph:

```typescript
// lib/agent/initializeAgent.ts
async function initializeAgent(
  options: AgentOptions = {}
): Promise<AgentResponse> {
  // Initialize the LLM with the specified AI model
  const llm = new ChatAnthropic({
    modelName: AI_MODEL,
  });

  // Configure tools based on context - add segment fan tool if segmentId is provided
  const defaultTools = options.segmentId ? [getSegmentFansTool] : [];
  // Merge default tools with any additional tools provided in options
  const tools = options.tools
    ? [...defaultTools, ...options.tools]
    : defaultTools;

  // Create the agent using LangGraph's createReactAgent function
  const agent = createReactAgent({
    llm,
    tools,
    messageModifier: DESCRIPTION,
    checkpointSaver: memory,
  });

  // Return the initialized agent
  return { agent };
}
```

This client-side agent processing is used in the chat API route:

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  // Extract message content and context from the request body
  const body = await req.json();
  const messages = body.messages as Message[];
  const room_id = body.roomId;
  const segment_id = body.segmentId;

  // Initialize agent with the appropriate context
  const { agent } = await initializeAgent({
    threadId: room_id || "default",
    segmentId: segment_id,
  });

  // Stream the response from the agent
  const stream = await agent.stream(messageInput, {
    configurable: {
      thread_id: room_id || "default",
      segmentId: segment_id,
    },
  });

  // Transform the stream to extract relevant content
  const transformedStream = getTransformedStream(stream);
  // Return the stream as a response using LangChainAdapter
  return LangChainAdapter.toDataStreamResponse(transformedStream);
}
```

#### Remote Agent Processing (for Complex Analysis)

For more complex analysis tasks, Recoup-Chat delegates to Recoup-Agent-APIs:

```typescript
// lib/agent/callAgentApi.tsx
const callAgentApi = async (handles: any, type: string, artistId: string) => {
  try {
    // Make a POST request to the Recoup-Agent-APIs endpoint
    const response = await fetch(`${AGENT_API}/api/agentkit/run`, {
      method: "POST",
      // Send the handles, type, and artistId as JSON in the request body
      body: JSON.stringify({ handles, type, artistId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the response JSON
    const data = await response.json();
    // Return the agentId from the response, which will be used to track progress
    return data?.agentId;
  } catch (error) {
    // Log any errors that occur during the API call
    console.error(error);
    return null;
  }
};
```

### 3. API Proxy Routes

Recoup-Chat includes API proxy routes that forward requests to Recoup-Agent-APIs:

```typescript
// app/api/agentkit/run/route.ts
export async function GET() {
  try {
    // Forward the request to the Recoup-Agent-APIs endpoint
    const response = await fetch(
      "http://143.198.164.177:3000/api/agentkit/run",
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    // Parse the response JSON
    const data = await response.json();
    // Return the response data
    return NextResponse.json(data);
  } catch (error) {
    // Log and return any errors
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
```

### 4. Direct API Calls

Recoup-Chat makes direct API calls to Recoup-Agent-APIs for specific functionalities:

#### Agent Status Retrieval

```typescript
// lib/agent/getAgent.tsx
const getAgent = async (agentId: string) => {
  try {
    // Fetch the agent status from Recoup-Agent-APIs using the agentId
    const response = await fetch(
      `${AGENT_API}/api/agentkit?agentId=${agentId}`,
    );
    // Parse the response JSON
    const data = await response.json();

    // Return the agent and comments data
    return {
      agent: data.agent,
      comments: data?.comments || null,
    };
  } catch (error) {
    // Log and handle any errors
    console.error(error);
    return {
      agents: null,
      comments: null,
    };
  }
};
```

#### Report Generation

```typescript
// lib/report/createReport.tsx
const createReport = async (segmentId: string): Promise<string | null> => {
  try {
    // Create a request object with the segmentId
    const request: CreateSegmentReportRequest = { segmentId };
    // Send a POST request to create a report
    const response = await fetch(`${AGENT_API}/api/create_report`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the response JSON
    const data: CreateSegmentReportResponse = await response.json();
    // Return the reportId from the response
    return data.reportId;
  } catch (error) {
    // Log and handle any errors
    console.error("Error creating report:", error);
    return null;
  }
};
```

#### Fan Segments

```typescript
// lib/getFanSegments.tsx
const getFanSegments = async (segmentNames: any, commentIds: any) => {
  try {
    // Send a POST request to get fan segments based on segment names and comment IDs
    const response = await fetch(`${AGENT_API}/api/get_fans_segments`, {
      method: "POST",
      body: JSON.stringify({
        segmentNames,
        commentIds,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is successful
    if (!response.ok) return { error: true };
    // Parse the response JSON
    const data = await response.json();
    // Return the fan segment data
    return data.data;
  } catch (error) {
    // Log and handle any errors
    console.error(error);
    return { error };
  }
};
```

#### Segment Analysis

```typescript
// lib/agent/getSegments.tsx
const getSegments = async (comments: any) => {
  try {
    // Send a POST request to analyze and categorize segments based on comments
    const response = await fetch(`${AGENT_API}/api/get_segments`, {
      method: "POST",
      body: JSON.stringify(comments),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the response JSON
    const data = await response.json();
    // Return the segments with icons for visualization
    return data.segments_with_icons;
  } catch (error) {
    // Log and handle any errors
    console.error(error);
    return [];
  }
};
```

#### Next Steps Recommendations

```typescript
// lib/getReportNextSteps.tsx
const getReportNextSteps = async (context: any) => {
  try {
    // Send a POST request to get recommended next steps based on context
    const response = await fetch(`${AGENT_API}/api/get_next_steps`, {
      method: "POST",
      body: JSON.stringify(context),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the response JSON
    const data = await response.json();
    // Return the next steps data
    return data.data;
  } catch (error) {
    // Log and handle any errors
    console.error(error);
    return "";
  }
};
```

### 5. Direct Database Access Tools

Recoup-Chat includes tools that directly interact with external data services like Supabase, bypassing the Recoup-Agent-APIs backend:

```typescript
// lib/tools/getSegmentFans.ts
export const getSegmentFansTool = tool(
  async (_input: Record<string, never>, runnable) => {
    // Extract the segmentId from the runnable's configurable object
    const segmentId = runnable.configurable?.segmentId;
    // Direct database access to Supabase to fetch fan data
    const fans = await getSegmentFans(segmentId);
    // Return the fan data as a JSON string
    return JSON.stringify({ fans, error: null });
  },
  {
    // Tool metadata for LangGraph
    name: "get_segment_fans",
    description: "Get all fans belonging to the current segment",
    schema: z.object({}),
  }
);
```

This approach allows the frontend to retrieve certain data directly from the database without routing the request through the Recoup-Agent-APIs backend, which can improve performance for simple data operations.

## State Management and Data Flow

### React Context Providers

Recoup-Chat uses a system of React context providers to manage state and facilitate communication with Recoup-Agent-APIs:

1. **FunnelAnalysisProvider**: Manages the state for funnel analysis, including agent status, handles, and loading states. The FunnelAnalysisProvider wraps the AgentsProvider to provide a hierarchical state management structure.

2. **AgentsProvider**: Manages agent-related state and provides methods for interacting with agents, including `runAgents` and `lookupProfiles`.

3. **ArtistProvider**: Manages artist data and selection, providing access to the currently selected artist.

4. **UserProvider**: Manages user authentication and session data, ensuring the user is properly authenticated before making API calls.

### Custom Hooks

The Recoup-Chat application uses custom hooks to encapsulate API interaction logic:

1. **useFunnelAnalysis**: Manages the state and logic for funnel analysis, including polling for agent status updates from Recoup-Agent-APIs. The useFunnelAnalysis hook sets up a timer to periodically check the status of running agents.

2. **useAgents**: Provides methods for looking up profiles and running agents. The useAgents hook delegates to other hooks like `useHandleLookup` and `useAgentRunner`.

3. **useAgentRunner**: Handles the execution of agents via the Recoup-Agent-APIs by calling `callAgentApi` and setting up the necessary state.

4. **useHandleLookup**: Manages the lookup of social media handles, which are then used as inputs for agent execution.

### Streaming Response Handling

Recoup-Chat processes streaming responses using a transform stream, but this is primarily for client-side agent processing rather than streaming from Recoup-Agent-APIs:

```typescript
// lib/agent/getTransformedStream.ts
const getTransformedStream = (
  stream: ReadableStream<AgentChunk>
): ReadableStream<string> => {
  // Counter to track the number of chunks processed
  let chunkCount = 0;

  // Create a transform stream to process chunks from the agent
  const transformStream = new TransformStream<AgentChunk, string>({
    async transform(chunk, controller) {
      chunkCount++;

      let content = "";

      try {
        // Process agent messages
        if ("agent" in chunk && chunk.agent?.messages?.[0]?.content) {
          const message = chunk.agent.messages[0];
          // Extract text content from the message
          const textContent = extractTextContent(message.content);
          // Format any tool use in the message
          const toolContent = formatToolUse(message.content);

          // Combine text and tool content
          content = [textContent, toolContent].filter(Boolean).join(" ");
        } 
        // Process tool messages
        else if ("tools" in chunk && chunk.tools?.messages?.[0]?.content) {
          const message = chunk.tools.messages[0];
          content = extractTextContent(message.content);
        }

        // Enqueue the content if it exists
        if (content) {
          controller.enqueue(content);
        }
      } catch (error) {
        // Log errors but don't throw to allow the stream to continue
        console.error(
          "[Stream Transform] Error processing chunk #" + chunkCount + ":",
          {
            error,
            chunk: JSON.stringify(chunk, null, 2),
          }
        );
        // Don't throw - allow stream to continue
      }
    },
  });

  // Pipe the input stream through the transform stream
  return stream.pipeThrough(transformStream);
};
```

This transformation is applied to the output of the client-side LangGraph agent, not to responses from Recoup-Agent-APIs.

## Verified API Endpoints

Based on direct evidence in the Recoup-Chat codebase, the following endpoints are used to communicate with Recoup-Agent-APIs:

### 1. Agent Execution

- **Endpoint**: `/api/agentkit/run`
- **Method**: POST
- **Used For**: Running an agent with specified parameters
- **Request Parameters**: `handles`, `type`, `artistId`
- **Response**: Returns an `agentId` that can be used to track the agent's progress

### 2. Agent Status

- **Endpoint**: `/api/agentkit`
- **Method**: GET
- **Used For**: Retrieving the status of a running agent
- **Request Parameters**: `agentId`
- **Response**: Returns the agent object with its current status and any comments

### 3. Report Generation

- **Endpoint**: `/api/create_report`
- **Method**: POST
- **Used For**: Creating a segment analysis report
- **Request Parameters**: `segmentId`
- **Response**: Returns a `reportId` that can be used to retrieve the report

### 4. Fan Segments

- **Endpoint**: `/api/get_fans_segments`
- **Method**: POST
- **Used For**: Retrieving fan segments based on segment names and comment IDs
- **Request Parameters**: `segmentNames`, `commentIds`
- **Response**: Returns segment data for the specified fans

### 5. Segment Analysis

- **Endpoint**: `/api/get_segments`
- **Method**: POST
- **Used For**: Analyzing and categorizing segments based on comments
- **Request Parameters**: Comments data
- **Response**: Returns segments with icons for visualization

### 6. Next Steps Recommendations

- **Endpoint**: `/api/get_next_steps`
- **Method**: POST
- **Used For**: Generating recommended next steps based on context
- **Request Parameters**: Context object with relevant data
- **Response**: Returns recommended next steps

## Actual Data Flow

The verified data flow between Recoup-Chat and Recoup-Agent-APIs involves several distinct patterns:

### Pattern 1: Client-Side Chat Processing

1. User sends a message in the chat interface
2. Recoup-Chat initializes a client-side LangGraph agent
3. The agent processes the message and generates a response
4. The response is streamed back to the user interface
5. No interaction with Recoup-Agent-APIs occurs in this flow

### Pattern 2: Complex Analysis Flow

1. User initiates a complex analysis (e.g., funnel analysis)
2. Recoup-Chat prepares the request data (handles, artist ID, etc.)
3. Recoup-Chat calls the Recoup-Agent-APIs to start the analysis
4. Recoup-Chat receives an agent ID from Recoup-Agent-APIs
5. Recoup-Chat periodically polls Recoup-Agent-APIs for the agent status
6. When the analysis is complete, Recoup-Chat fetches the results
7. The UI components in Recoup-Chat render the processed data

### Pattern 3: Direct Data Retrieval

1. User interacts with a component that needs specific data
2. Recoup-Chat makes a direct API call to Recoup-Agent-APIs
3. Recoup-Chat processes the response and updates the UI
4. No polling or streaming is involved in this flow

## Component Interaction

The UI components in Recoup-Chat interact with the Recoup-Agent-APIs through the context providers and hooks:

1. **FunnelAccountAnalysis**: The main component for displaying funnel analysis results. The FunnelAccountAnalysis component uses the ArtistProvider to access the selected artist and conditionally renders either AnalysisChat or AgentSkeleton.

2. **AnalysisChat**: Provides a chat interface for interacting with the agent during analysis. The AnalysisChat component uses the FunnelAnalysisProvider to access agent status and other state.

3. **Agents**: Displays available agents and handles user interactions to initiate agent execution. The Agents component uses multiple providers (ArtistProvider, AgentsProvider, FunnelAnalysisProvider) to coordinate the agent execution flow.

4. **Completion**: Displays the completed analysis results. The Completion component uses the FunnelAnalysisProvider to access the agent data and the PromptsProvider to get relevant prompts.

## Setting Up Both Repositories

### Recoup-Chat Setup

Based on the README.md in Recoup-Chat:

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

### Recoup-Agent-APIs Setup

Based on the [GitHub repository README](https://github.com/recoupable/Recoup-Agent-APIs):

1. Clone the repository:
   ```bash
   git clone https://github.com/recoupable/Recoup-Agent-APIs.git
   cd Recoup-Agent-APIs
   ```

2. Install pnpm (if not already installed):
   ```bash
   npm install -g pnpm
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Configure your environment:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

5. Start the development server:
   ```bash
   pnpm start
   ```

6. Build for production:
   ```bash
   pnpm build
   ```

## Cross-Repo Integration Considerations

When working with both repositories, consider the following:

1. Ensure the `AGENT_API` constant in Recoup-Chat points to the correct Recoup-Agent-APIs instance
2. Verify that API request and response formats match between the two repositories
3. For standard local development of Recoup-Chat, you can use the production Recoup-Agent-APIs instance (https://api.recoupable.com) without running the backend locally
4. Only when developing or testing changes to both repositories would you need to run both services simultaneously and update the `AGENT_API` constant to point to your local Recoup-Agent-APIs instance
5. Both repositories use TypeScript, which helps ensure type safety across the integration
6. The Recoup-Agent-APIs repository handles the complex AI processing, while Recoup-Chat focuses on the user interface and experience
7. The client-side agent processing in Recoup-Chat is primarily for simple chat interactions, while complex analysis tasks are delegated to Recoup-Agent-APIs
8. Polling is used for long-running processes rather than streaming from Recoup-Agent-APIs 