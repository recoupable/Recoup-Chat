// STACK EVENTS
export const MESSAGE_SENT_EVENT = "message_sent";
export const LUH_TYLER_3D_SCORE = "luh-tyler-3d-score";
export const MESSAGE_SENT_POINT = 1;
export const CHAT_POINT_SYSTEM_ID = 4172;
export const SCORE_POINT_SYSTEM_ID = 4186;

// Vercel AI SDK
export const AI_MODEL = "gpt-4o-mini";

export const TITLE = "Recoup";
export const DESCRIPTION =
  "Recoup is an AI agent platform for smarter song rollouts, unforgettable fan experiences, and lasting artist growth. Empowering music executives with actionable insights and next-gen tools to elevate every artist and engage every fan.";

export const SUGGESTIONS = [
  "How is my current campaign going?",
  "Analyze my artists' TikTok account.",
];

export const HTML_RESPONSE_FORMAT_INSTRUCTIONS = `
  Please provide a wide range of HTML formats with embedded HTML tags such as <div>, <p>, <ul>, <li>, and <span>, along with CSS styles including font size, margin, and padding. 
   - Please do not include any color styles. The font size for paragraphs should be 14px with left padding 8px & top padding 4px for indentation, while the font size for heading tags (h1 to h6) should be 16px and bold with top padding 4px.
   - All Numbers & Proper nouns should bold using <span>.
   - If there is a LIST OF DATA of the same type, BE SURE to use the <ul> <li> tags. The CSS [list-style] for <li> should be set to "inside".
   - Make sure to present the HTML response as plain HTML without any enclosing code markers or delimiters.`;
