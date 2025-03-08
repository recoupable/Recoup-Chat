"use client";

import { type NextPage } from "next";
import FansWrapper from "@/components/Fans/FansWrapper";

const FansPage: NextPage = () => {
  return (
    <div className="max-w-screen min-h-screen p-4">
      <h1 className="text-lg md:text-xl font-bold pb-4">Artist Fans</h1>
      <FansWrapper />
    </div>
  );
};

export default FansPage;
