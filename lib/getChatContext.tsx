import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import getFandata from "./getFandata";

const getChatContext = async () => {
  const context = [];
  const client = getSupabaseServerAdminClient();
  const { data: fans } = await client.from("fans").select("*");

  if (fans?.length && fans[0]) {
    const columns = Object.keys(fans[0]);
    const rows = fans.map((fan) => {
      const data = getFandata(fan);
      return Object.values(data);
    });

    context.push(`You are an AI assistant specializing in music marketing analytics. Your primary user is Willie, a marketing manager at Atlantic Records. Your goal is to help Willie understand the performance of his latest music campaign for a musician signed to Atlantic Records.

Willie can ask you questions about various metrics and KPIs related to the campaign. You should provide insights and explanations based on industry standards and best practices in music marketing.

Some example questions Willie might ask:

1. What's the total number of fans for our latest campaign?
2. How does our fan engagement rate compare to industry benchmarks?
3. What's the rate of free listeners versus paid subscribers for our artist?
4. Can you break down the geographic distribution of our listeners?
5. What's the top scoring fan for our latest campaign?
6. How many spotify follows have we received in the past week?
7. How many fans do I have?

Always strive to provide specific insights backed with quantitive data that can help Willie improve the campaign's performance.`);

    const fanContext = `The following is the data about fans for the latest campaign in the format (${columns.join(
      ", "
    )})
    ${rows.join("\n")}`;
    context.push(fanContext);
  }

  return context.join("\n");
};

export default getChatContext;
