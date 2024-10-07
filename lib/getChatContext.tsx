import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import getFandata from "./getFandata";

const getChatContext = async () => {
  const context = [];

  const client = getSupabaseServerAdminClient();
  console.log("SWEETS client", client);
  const { data: fans } = await client.from("fans").select("*");
  console.log("SWEETS FANS", fans);

  if (fans?.length && fans[0]) {
    const columns = Object.keys(fans[0]);
    const rows = fans.map((fan) => {
      const data = getFandata(fan);
      return Object.values(data);
    });

    const fanContext = `The following is the data about fans in the format (${columns.join(
      ", "
    )})
    ${rows.join("\n")}`;
    context.push(fanContext);
  }

  console.log("SWEETS context", context);

  return context.join("\n");
};

export default getChatContext;
