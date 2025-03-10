"use client";

import usePWADownload from "@/hooks/usePWADownload";
import Image from "next/image";
import React from "react";

const MobileDownloadModal = () => {
  const { showModal, handleInstallClick } = usePWADownload();

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-60"
            id="tap-close-download"
          />
          <div className="relative bg-white p-4 rounded-md shadow-lg w-4/5 z-10 flex flex-col items-center">
            <Image
              src="/savePhoneIcon.png"
              alt="save phone icon"
              width={100}
              height={100}
            />
            <h2 className="text-lg font-bold mb-2 text-center">
              Add to Home Screen
            </h2>
            <button
              className="border-2 px-4 py-2 rounded-xl border-grey-700"
              onClick={handleInstallClick}
            >
              Install App
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileDownloadModal;
