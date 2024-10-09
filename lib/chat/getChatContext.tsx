import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import getFandata from "./getFandata";
import { INSTRUCTION } from "./const";
import getFollows from "./getFollows";
import getTopScore from "./getTopScore";
import getMostPlayed from "./getMostPlayed";
import getStreamsCount from "./getStreamsCount";

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

    context.push(INSTRUCTION);

    const fanContext = `\n\n1. Fans for the latest campaign in the format (${columns.join(
      ", ",
    )}):\n\t
    ${rows.join("\n\t")}`;
    context.push(fanContext);

    const follows = await getFollows(client);
    context.push(`\n2. Followers: ${follows}`);

    const topSoredName = await getTopScore(client);
    context.push(`\n3. Highest scoring fan: ${topSoredName}`);

    const mostPlayedFan = await getMostPlayed(client);
    context.push(`\n4. Most played fan: ${mostPlayedFan}`);

    const streamsCount = await getStreamsCount(client);
    context.push(`\n5. Streams Count: ${streamsCount}`);
  }

  return context.join("\n");
};

export default getChatContext;
