import { Eval } from "braintrust";
import { SYSTEM_PROMPT } from "@/lib/consts";

// Test data based on actual agents from public/agents.json
const agentTestCases = [
  {
    input: "Tour Strategy",
    agent_prompt: "We're planning a tour for next quarter. Based on our streaming data, social engagement, and fan locations, where should we perform to maximize attendance and revenue? What VIP experiences could we offer, and how should we price tickets across different markets?",
    expected_keywords: ["venue", "attendance", "revenue", "VIP", "market", "pricing"]
  },
  {
    input: "Brand Positioning", 
    agent_prompt: "My artist is ready for a brand refresh. Analyze our current perception across platforms, identify opportunities to evolve while staying authentic, and create visual mockups of what our refreshed identity could look like with implementation steps.",
    expected_keywords: ["brand", "perception", "authentic", "identity", "implementation"]
  },
  {
    input: "Release Optimization",
    agent_prompt: "We're planning our next release. Analyze how our previous releases performed, what fans said about them, and current trends in our genre. Give me recommendations for the ideal release timing, messaging approach, and platform focus to maximize impact.",
    expected_keywords: ["release", "timing", "messaging", "platform", "impact"]
  }
];

// Simple scorer that checks if response contains relevant keywords and follows tone
const AgentComplianceScore = ({ output, expected }: { 
  output: string; 
  expected: { keywords: string[]; tone: string } 
}): { name: string; score: number } => {
  if (!output || typeof output !== 'string') {
    return { name: "Agent Compliance", score: 0 };
  }

  const outputLower = output.toLowerCase();
  
  // Check keyword relevance (60% of score)
  const keywordMatches = expected.keywords.filter(keyword => 
    outputLower.includes(keyword.toLowerCase())
  ).length;
  const keywordScore = keywordMatches / expected.keywords.length;
  
  // Check for strategic music industry tone (40% of score)
  const toneIndicators = [
    "analyze", "recommend", "strategy", "optimize", "data", "fan", "artist", "market"
  ];
  const toneMatches = toneIndicators.filter(indicator => 
    outputLower.includes(indicator)
  ).length;
  const toneScore = Math.min(toneMatches / 4, 1); // Cap at 1.0
  
  const finalScore = (keywordScore * 0.6) + (toneScore * 0.4);
  return { name: "Agent Compliance", score: finalScore };
};

// Mock LLM call - simulates what would happen with real system
async function mockRecoupAgentResponse(systemPrompt: string, agentPrompt: string): Promise<string> {
  // Simulate realistic Recoup responses based on the agent type
  if (agentPrompt.includes("tour")) {
    return `Based on your streaming data and fan engagement, I recommend focusing on these high-opportunity markets:

**Primary Markets (High ROI):**
- Los Angeles, Austin, Nashville - Strong streaming + social engagement
- Chicago, Atlanta - Growing fan bases with concert-going habits

**VIP Strategy:**
- Soundcheck access: $150-200 premium
- Meet & greet packages: $300-500 depending on market
- Exclusive merch bundles: $75-100

**Pricing Strategy:**
Tier your markets: Premium ($80-120), Standard ($50-80), Emerging ($30-50) based on demand data and local venue capacity.`;
  }
  
  if (agentPrompt.includes("brand")) {
    return `Let's analyze your brand positioning opportunity:

**Current Perception Analysis:**
Your artist reads as authentic but could use more strategic positioning in the marketplace.

**Brand Evolution Opportunities:**
- Lean into your storytelling - fans respond to narrative authenticity
- Visual identity refresh: Consider warmer, more personal aesthetic
- Platform-specific brand adaptation while maintaining core identity

**Implementation Steps:**
1. Audit current visual assets across platforms
2. Define 3-5 core brand pillars 
3. Create platform-specific content templates
4. Roll out gradually with A/B testing on engagement`;
  }

  if (agentPrompt.includes("release")) {
    return `Here's your release optimization strategy:

**Previous Release Analysis:**
Your last 3 releases show strongest performance on Spotify (60% of streams) and TikTok engagement peaks 2-3 weeks post-release.

**Timing Recommendations:**
- Target Friday release for playlist placement
- Avoid major artist drop weekends
- Consider pre-release buzz campaign 4-6 weeks prior

**Platform Focus:**
1. **Spotify**: Priority for playlist pitching
2. **TikTok**: 15-30 second hook-focused content
3. **Instagram**: Behind-the-scenes content series

**Messaging Approach:**
Lead with authenticity, follow with strategic amplification across your strongest demographics.`;
  }

  return "I'll help you develop a strategic approach for your music career goals.";
}

Eval("Agent Instruction Following", {
  data: () => agentTestCases.map(testCase => ({
    input: testCase.agent_prompt,
    expected: {
      keywords: testCase.expected_keywords,
      tone: "strategic_music_industry"
    }
  })),
  task: async (input: string): Promise<string> => {
    try {
      // Simulate the full system prompt + agent prompt flow
      const response = await mockRecoupAgentResponse(SYSTEM_PROMPT, input);
      return response;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Agent execution failed'}`;
    }
  },
  scores: [AgentComplianceScore],
}); 