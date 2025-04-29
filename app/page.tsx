import HomePage from "@/components/Home/HomePage";
import generateUUID from "@/lib/generateUUID";

export const dynamic = "force-dynamic";

export default async function Home() {
  const id = generateUUID();

  return <HomePage id={id} />;
}
