"use client";

import { useArtistProvider } from "@/providers/ArtistProvider";
import { useEffect, useState } from "react";
import { useSidebarExpansion } from "@/providers/SidebarExpansionContext";
import { usePrivy } from "@privy-io/react-auth";
import useIsMobile from "@/hooks/useIsMobile";
import { ArtistTooltip } from "./common/ArtistTooltip";
import { motion } from "framer-motion";

/**
 * Overlay component that dims the UI when no artist is selected
 * Excludes only the artist elements in the sidebar (right side), not the sidebar
 * Works properly with the hover effect of the sidebar
 */
export function ArtistSelectionOverlay() {
  const { selectedArtist, sorted, isOpenSettingModal } = useArtistProvider();
  const { isExpanded } = useSidebarExpansion();
  const { authenticated, ready } = usePrivy();
  const isMobile = useIsMobile();
  const hasArtists = sorted.length > 0;
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Only show tooltip on desktop
    const shouldShowTooltip =
      !selectedArtist && // No artist selected
      !isMobile && // Not on mobile
      authenticated && // User is logged in
      ready && // Privy is ready
      !isOpenSettingModal; // Modal is closed

    if (shouldShowTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [selectedArtist, isOpenSettingModal, authenticated, ready, isMobile]);

  // Show overlay if no artist is selected and user is authenticated
  const shouldShowOverlay =
    !selectedArtist &&
    authenticated &&
    ready &&
    !isOpenSettingModal &&
    hasArtists;

  if (!shouldShowOverlay) {
    return null;
  }

  return (
    <>
      {/* Semi-transparent overlay */}
      <div
        className="fixed inset-0 z-30 bg-black/80 backdrop-blur-[1px] transition-opacity duration-300 pointer-events-none"
        style={{ opacity: 1 }}
      />

      {/* Tooltip Container - only shown on desktop */}
      {showTooltip && !isMobile && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <motion.div
            className={`absolute ${hasArtists ? "top-8" : "bottom-4"}`}
            initial={{ right: "8rem" }}
            animate={{ right: isExpanded ? "15rem" : "8rem" }}
            transition={{ duration: 0.2 }}
          >
            <ArtistTooltip
              isExpanded={isExpanded}
              hasArtists={hasArtists}
              message={hasArtists ? "Select Your Artist" : "Add Your Artist"}
            />
          </motion.div>
        </div>
      )}
    </>
  );
}

export default ArtistSelectionOverlay;
