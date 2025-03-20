import supabase from "./serverClient";

interface MemoryInput {
  room_id: string;
  content: unknown;
}

const createMemories = async (memory: MemoryInput) => {
  try {
    await supabase.from("memories").insert(memory).select("*");
  } catch (error) {
    console.error(error);
  }
};

export default createMemories;
