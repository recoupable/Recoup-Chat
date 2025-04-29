interface TooltipPosition {
  position: string;
}

export const getTooltipPositioning = (
  isExpanded: boolean,
  hasArtists: boolean,
): TooltipPosition => {
  return {
    position: '',  // Position is now handled by the parent container
  };
}; 