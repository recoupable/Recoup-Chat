"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const subscribe = () => () => undefined;
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function PlaygroundThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const { setTheme, resolvedTheme } = useTheme();
  const ready = mounted && Boolean(resolvedTheme);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-11"
      disabled={!ready}
      aria-label={
        !ready
          ? "Color theme loading"
          : resolvedTheme === "dark"
            ? "Switch to light theme"
            : "Switch to dark theme"
      }
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
    </Button>
  );
}
