import { z } from "zod";
// import getFans from "../chat/getFans";
// import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { tool } from "ai";

const createArtist = (question: string, email: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for ANY question related to creating artist.:
    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "Create a new aritst"
    - "I wanna create a new artist."

    When in doubt, call this tool to ensure you have the most up-to-date and accurate information.`,
    parameters: z.object({}),
    execute: async () => {
      return {
        context: {
          question,
          email,
        },
      };
    },
  });

export default createArtist;
