import { useEffect, useState } from "react";
import useIsMobile from "./useIsMobile";

const usePWADownload = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const isMobile = useIsMobile();
  // For testing: Set to true to force the modal to show
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show the modal when the event is triggered
      setShowModal(true);
    };
    const response = /Android/i.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;
    
    if (!isStandalone && response) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }
    
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, [isMobile]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
      setShowModal(false);
    } else {
      // For testing: Just close the modal when no actual prompt is available
      setShowModal(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document.addEventListener("click", (e: any) => {
      if (e.target.id === "tap-close-download") {
        setShowModal(false);
      }
    });
  }, []);

  return {
    showModal,
    handleInstallClick,
  };
};

export default usePWADownload;
