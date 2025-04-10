import supabase from "./serverClient";

const getRoom = async (roomId: string) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export default getRoom;
