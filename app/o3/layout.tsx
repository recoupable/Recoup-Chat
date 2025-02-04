import { Metadata } from "next";

export const metadata: Metadata = {
  title: "O3 Chat | Recoup",
  description: "Chat with O3",
};

export default function O3Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="size-full flex flex-col items-center justify-center">
      {children}
    </main>
  );
}
