import supabase from "./serverClient";

const getRoom = async (roomId: string) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  if (error) {
    return null;
  }

  return data;
};

export default getRoom;
