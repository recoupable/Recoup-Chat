"use client";

import { type NextPage } from "next";
import SegmentsWrapper from "@/components/Funnels/SegmentsWrapper";

const SegmentsPage: NextPage = () => {
  return (
    <div className="max-w-screen min-h-screen p-4">
      <h1 className="text-lg md:text-xl font-bold pb-4">Fan Segments</h1>
      <SegmentsWrapper />
    </div>
  );
};

export default SegmentsPage;
