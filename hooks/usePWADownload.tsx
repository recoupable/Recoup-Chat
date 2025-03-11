import { useEffect, useState } from "react";
import useIsMobile from "./useIsMobile";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

const usePWADownload = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const isMobile = useIsMobile();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const response = /Android/i.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as NavigatorWithStandalone).standalone;

    if (!isStandalone && response) {
      setShowModal(true);
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    }
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener,
      );
  }, [isMobile]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
      setShowModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.id === "tap-close-download") {
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
