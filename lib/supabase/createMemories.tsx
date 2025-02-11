import supabase from "./serverClient";

// eslint-disable-next-line
const createMemories = async (memory: any) => {
  try {
    await supabase.from("memories").insert(memory).select("*");
  } catch (error) {
    console.error(error);
  }
};

export default createMemories;
