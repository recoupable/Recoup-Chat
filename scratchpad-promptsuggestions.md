# P1 - Prompt Suggestions for Chat: Implementation Plan

## Goal
Re-implement and improve prompt suggestions in the chat, ensuring they are high quality, concise, and only show prompts that the app can handle. The UI should be simple, intuitive, and help move conversations forward.

## Requirements Summary

- Prompt suggestions should guide users to get the most value from the platform by:
  - Predicting what the user would want to do next, OR
  - Suggesting paths the user may not have considered, leading to new insights.
- Suggestions must always be tailored to the current chat context (no generic suggestions).
- Show exactly 3 prompt suggestions at a time.
- When a user clicks a suggestion, it should immediately send as a message.
- Each suggestion should be unique for the current chat context (no repeats in a session).
- Suggestions must be concise enough to fit in the UI box and not look overwhelming (exact limit to be determined by design/testing).
- Only show suggestions that the app can handle and provide a meaningful response to (no unsupported or open-ended prompts).
- Suggestions should refresh dynamically after every new message in the chat.
- Suggestions should be written at a 3rd grade reading level (may change later).
- Suggestions can reference specific user data, such as the selected artist.
- Suggestions should always be shown as long as the chat is ongoing (no need to hide for special states for now).

> **Note:** Consider adding tracking & analytics in a future ticket to optimize and analyze prompt suggestion usage.

## Plan

1. **Review Existing Code**
   - [ ] Locate and review the old prompt suggestion code that was removed after migrating to AIDSK.
   - [ ] Identify what worked and what didn't in the previous implementation.
   - [ ] **Verify:** Confirm that the old code is present and accessible in the codebase.
   - [ ] **Discoveries:**
     - Prompt suggestion logic and UI are present in several files:
       - `components/Chat/SideSuggestions.tsx`: Renders prompt suggestions using a slider and `SuggestionPill` components. Gets suggestions from a provider.
       - `components/Chat/SuggestionPill.tsx`: Handles individual suggestion UI and click-to-append behavior.
       - `hooks/usePrompts.tsx`: Contains logic for fetching and setting prompt suggestions, including API calls for context-aware suggestions.
       - `app/api/prompts/route.ts`, `app/api/prompts/funnel_analysis/route.ts`, `app/api/prompts/funnel_report/route.ts`: API endpoints that generate prompt suggestions using OpenAI, with specific instructions for concise, actionable, and context-aware questions.
       - `lib/consts.ts`: Contains a static list of fallback suggestions.
     - The system supports both static and dynamic (AI-generated) suggestions, depending on context and chat state.
     - The UI is already modular, with clear separation between fetching logic, display, and user interaction.
     - There is logic to differentiate between new and ongoing chats in `usePrompts.tsx` (using `pathname`).
   - [ ] **What Worked:**
     - Modular and reusable UI components for suggestions.
     - Support for both static and dynamic suggestions.
     - Context-aware API endpoints for generating relevant prompts.
     - Clear separation of concerns between fetching, display, and user interaction.
   - [ ] **What Didn't Work / Areas for Improvement:**
     - Previous prompt suggestions were described as "mid" (mediocre) and not always relevant or actionable.
     - UI could be clunky or not fit well in all contexts.
     - Some suggestions may not have passed evals or been actionable by the app.
     - Need for more concise, forward-moving, and UI-fitting suggestions.
     - Ensure suggestions only appear in ongoing chats, not at chat start.

2. **Requirements Gathering**
   - [ ] List the requirements for prompt suggestions (e.g., must pass evals, concise, fit UI, move conversation forward).
   - [ ] Define what makes a prompt suggestion "amazing" and actionable for the app.
   - [ ] **Only show prompt suggestions in ongoing chats (not when starting a new chat).**
   - [ ] **Verify:** Check with stakeholders or documentation to ensure requirements are complete and correct.
   - [ ] **Verify:** Get clear criteria or examples of "amazing" prompt suggestions from users, product owners, or designers.
   - [ ] **Verify:** Confirm with stakeholders that prompt suggestions should only appear in ongoing chats.

3. **Design Prompt Suggestion Logic**
   - [ ] Decide how prompt suggestions will be generated (static list, AI-generated, context-aware, etc.).
   - [ ] Ensure only prompts that the app can handle are shown.
   - [ ] Plan for concise, UI-fitting suggestions.
   - [ ] **Add logic to detect if the chat has started (at least one message exists) before displaying suggestions.**
   - [ ] **Verify:** Validate the chosen approach for generating suggestions with the team or stakeholders.
   - [ ] **Verify:** Ensure chat state logic is robust and covers all edge cases for detecting ongoing chats.

4. **UI/UX Design**
   - [ ] Sketch or wireframe a simple, intuitive UI for prompt suggestions.
   - [ ] Ensure the UI is not clunky and fits well with the existing chat interface.
   - [ ] Plan for responsive design and accessibility.
   - [ ] **Verify:** Create wireframes or prototypes and get feedback from users or designers.
   - [ ] **Verify:** Review the current chat UI and test integration with prompt suggestions.

5. **Implementation Steps**
   - [ ] Restore or refactor the old prompt suggestion code as a starting point (if useful).
   - [ ] Implement the new prompt suggestion logic.
   - [ ] Integrate the new UI for prompt suggestions.
   - [ ] Ensure suggestions are contextually relevant and actionable.
   - [ ] **Implement conditional rendering so prompt suggestions only appear after the first message is sent in a chat.**
   - [ ] **Verify:** Assess the old code for compatibility and usefulness before reusing.
   - [ ] **Verify:** Test with real chat data and user feedback to ensure suggestions are relevant and actionable.

6. **Testing & Evaluation**
   - [ ] Write tests to ensure only valid prompts are shown.
   - [ ] Test UI for usability and responsiveness.
   - [ ] Gather feedback and iterate on suggestions and UI.
   - [ ] **Verify:** Review test plans with the team and consider edge cases.

7. **Documentation & Cleanup**
   - [ ] Document the new prompt suggestion system and how to maintain/extend it.
   - [ ] Remove any unused or deprecated code from the old implementation.
   - [ ] **Verify:** Ensure documentation is clear and codebase is free of deprecated code.

---

**Next Step:**
- Review and confirm this plan before starting any code changes.

---

# P2 - Tool Usage Tracking: Proposal

## Goal
Implement a low-effort way to track when tools from `lib/tools` are used and which specific tool is called. This will help understand feature popularity.

## Investigation Summary
- The file `lib/tools/getMcpTools.ts` imports most tool functions and returns an object mapping tool names to tool functions.
- This `getMcpTools` function is called in `app/api/chat/route.ts`, which appears to be a central handler for chat operations and tool execution.
- This makes `getMcpTools.ts` an ideal place to inject tracking logic with minimal changes to the rest of the codebase.

## Proposed Solutions (Lowest Lift First)

### Option 1: Modify `getMcpTools.ts` to Wrap Tool Functions (Recommended)

This is likely the lowest-lift and least intrusive method.

**How it would work:**
Inside `getMcpTools.ts`, before returning the `tools` object, iterate through its properties (each tool function). For each tool function, replace it with a new wrapper function. This wrapper function would:
1.  Log the tool name (which is the key in the `tools` object). This could be a simple `console.log` for now, or a call to a more sophisticated logging service/database later.
2.  Execute the original tool function with the provided arguments.
3.  Return the result of the original tool function.

**Example Snippet (Conceptual - for `getMcpTools.ts`):**
```typescript
// ... existing imports ...
// Hypothetical simple logger
const trackToolUsage = (toolName: string, args: any) => {
  console.log(`Tool Used: ${toolName}, Arguments:`, args);
  // In a real scenario, this could send data to an analytics service, database, etc.
};

export async function getMcpTools() {
  const originalTools = {
    contact_team: contactTeam,
    // ... other tools
  };

  const wrappedTools: { [key: string]: (...args: any[]) => any } = {};

  for (const toolName in originalTools) {
    const originalTool = originalTools[toolName as keyof typeof originalTools];
    wrappedTools[toolName] = async (...args: any[]) => { // Ensure args are correctly typed
      trackToolUsage(toolName, args); // Log before execution
      return originalTool(...args);
    };
  }
  return wrappedTools;
}
```

**Pros:**
-   **Centralized:** Logic is in one place.
-   **Low Impact:** No need to modify each individual tool file or the calling code in `app/api/chat/route.ts`.
-   **Comprehensive:** Captures all tools routed through `getMcpTools`.
-   **Simple to Implement:** Requires changing only one file.

**Cons:**
-   Relies on `getMcpTools` being the *sole* way tools are invoked. If tools are imported and called directly elsewhere, those calls won't be tracked. (Our investigation suggests this is unlikely for most tools, but it's a consideration).
-   The logging is synchronous before the tool executes. If a tool fails, it's still logged as "used". This is generally acceptable for usage tracking.

### Option 2: Modify the Calling Code (e.g., `app/api/chat/route.ts`)

**How it would work:**
In `app/api/chat/route.ts`, after `const tools = await getMcpTools();` is called, you would need to wrap the tool execution logic. When the AI model decides to call a tool (e.g. `tools.some_tool_name()`), you would insert logging code there.

**Pros:**
-   Doesn't modify the `getMcpTools` function itself.

**Cons:**
-   **More Invasive:** The logic for how tools are called by the AI/LangChain library might be complex or spread out, making it harder to find the exact spot to add logging.
-   **Potentially Less Centralized:** If tools can be invoked in multiple ways by the AI framework, you might need to add logging in several places.
-   **Error-Prone:** Modifying the core AI tool-handling logic could introduce bugs if not done carefully.

### Option 3: Modify Each Tool File (Highest Lift)

**How it would work:**
Go into every single file in `lib/tools` (e.g., `contactTeam.ts`, `generateImage.ts`) and add a logging line at the beginning of each exported tool function.

**Pros:**
-   **Guaranteed Tracking:** Every tool execution will be logged, regardless of how it's called.

**Cons:**
-   **Very High Effort:** Requires modifying many files (you listed ~30 files).
-   **Maintenance Nightmare:** If you add new tools, you have to remember to add logging. If you change the logging mechanism, you have to change it in all files.
-   **Code Duplication:** The same logging code will be repeated in many places.

## Recommendation:
**Option 1 (Modify `getMcpTools.ts` to Wrap Tool Functions)** is strongly recommended. It provides a good balance of effectiveness, low effort, and maintainability for your stated goal.

## Next Steps:
-   User to review and approve a path.
-   If Option 1 is approved, I will proceed to implement the changes in `lib/tools/getMcpTools.ts`.
-   Decide on the exact logging mechanism (e.g., `console.log` for now, or a specific analytics endpoint/database if available). For now, `console.log` is the simplest.
