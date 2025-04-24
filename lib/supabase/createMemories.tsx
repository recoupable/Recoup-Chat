import supabase from "./serverClient";

interface MemoryInput {
  room_id: string;
  content: unknown;
  id: string;
}

const createMemories = async (memory: MemoryInput) => {
  try {
    await supabase.from("memories").insert(memory).select("*");
  } catch (error) {
    console.error(error);
  }
};

export default createMemories;
