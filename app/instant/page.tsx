import { Chat } from "@/components/VercelChat/chat";
import generateUUID from "@/lib/generateUUID";

export default async function Home() {
  const id = generateUUID();

  return (
    <div className="flex flex-col size-full items-center">
      <Chat id={id} />
    </div>
  );
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
