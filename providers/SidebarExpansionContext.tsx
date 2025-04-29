'use client';

import React, { createContext, useContext, useState } from 'react';

interface SidebarExpansionContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const SidebarExpansionContext = createContext<SidebarExpansionContextType | undefined>(undefined);

export function SidebarExpansionProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SidebarExpansionContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </SidebarExpansionContext.Provider>
  );
}

export function useSidebarExpansion() {
  const context = useContext(SidebarExpansionContext);
  if (context === undefined) {
    throw new Error('useSidebarExpansion must be used within a SidebarExpansionProvider');
  }
  return context;
} 