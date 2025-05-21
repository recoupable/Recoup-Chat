import { createContext, useContext, ReactNode } from "react";
import { useMiniApp, MiniApp } from "../hooks/useMiniApp";

const MiniAppContext = createContext<MiniApp | undefined>(undefined);

export const MiniAppProvider = ({ children }: { children: ReactNode }) => {
  const miniApp = useMiniApp();

  return (
    <MiniAppContext.Provider value={{ ...miniApp }}>
      {children}
    </MiniAppContext.Provider>
  );
};

export const useMiniAppContext = () => {
  const context = useContext(MiniAppContext);
  if (context === undefined) {
    throw new Error("useMiniAppContext must be used within a MiniAppProvider");
  }
  return context;
};
