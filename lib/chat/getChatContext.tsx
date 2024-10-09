import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import getFandata from "./getFandata";
import { INSTRUCTION } from "./const";
import getFollows from "./getFollows";

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
      ", "
    )}):\n\t
    ${rows.join("\n\t")}`;
    context.push(fanContext);

    const follows = await getFollows(client)
    context.push(`\n2. Followers: ${follows}`)
  }

  console.log("ZIAD", context.join("\n"))
  return context.join("\n");
};

export default getChatContext;
