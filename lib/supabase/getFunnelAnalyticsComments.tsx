import supabase from "./serverClient";

const getFunnelAnalyticsComments = async (ids: Array<string>) => {
  const { data: analytics } = await supabase
    .from("funnel_analytics")
    .select("*")
    .in("chat_id", ids);

  const analysesIds = analytics?.map((analysis) => analysis.id);

  const { data } = await supabase
    .from("funnel_analytics_comments")
    .select("*")
    .in("analysis_id", analysesIds || [])
    .order("timestamp", { ascending: false });

  return data;
};

export default getFunnelAnalyticsComments;
