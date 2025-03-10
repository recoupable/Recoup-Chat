"use client";

import usePWADownload from "@/hooks/usePWADownload";
import React from "react";

const MobileDownloadModal = () => {
  // Just to keep the hook in place for future use
  usePWADownload();

  // Return empty fragment as we're not showing any UI right now
  return <></>;
};

export default MobileDownloadModal;
