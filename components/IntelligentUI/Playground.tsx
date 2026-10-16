"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import LogoIcon from "@/components/Logo/LogoIcon";
import { Button } from "@/components/ui/button";
import { playgroundScenarios } from "@/lib/intelligent-ui/playground/scenarios";
import PlaygroundWorkspace from "./PlaygroundWorkspace";

export default function Playground() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const { setTheme, resolvedTheme } = useTheme();
  const scenario = playgroundScenarios[scenarioIndex];

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#playground"
        className="sr-only fixed top-3 left-3 z-50 rounded-xl bg-card p-3 focus:not-sr-only focus:ring-2 focus:ring-ring"
      >
        Skip to the playground
      </a>
      <header className="flex items-center justify-between gap-4 px-6 py-5 shadow-[0_1px_0_var(--border)] sm:px-10 lg:px-14">
        <Link
          href="/"
          aria-label="Recoup home"
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogoIcon className="size-7" />
          <span className="text-xl font-medium tracking-[-0.04em]">recoup</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Design lab / 001
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            aria-label="Toggle color theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Sun className="hidden dark:block" aria-hidden="true" />
            <Moon className="dark:hidden" aria-hidden="true" />
          </Button>
        </div>
      </header>
      <main
        id="playground"
        className="mx-auto max-w-[1440px] px-6 pt-12 pb-8 sm:px-10 sm:pt-16 lg:px-14"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span
                className="size-1.5 rounded-full bg-brand-link"
                aria-hidden="true"
              />
              Intelligent UI playground
            </p>
            <h1 className="max-w-2xl text-[clamp(2.7rem,5.2vw,4.8rem)] leading-[1.04] font-medium tracking-[-0.055em]">
              A workspace that
              <br />
              <span className="text-muted-foreground">keeps up.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              New information, a clearer view. Explore an interface that adapts
              as evidence arrives—and keeps your work intact.
            </p>
          </div>
          <div className="pb-1">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Choose an example
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Choose an example"
            >
              {playgroundScenarios.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={index === scenarioIndex}
                  onClick={() => setScenarioIndex(index)}
                  className={`min-h-11 cursor-pointer rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${index === scenarioIndex ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <PlaygroundWorkspace key={scenario.id} scenario={scenario} />
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 py-5 text-xs text-muted-foreground">
          <p>One renderer. Two domains. Four reusable components.</p>
          <a
            href="https://github.com/recoupable/app/issues/2197"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-2 rounded-md text-brand-link underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Follow the Intelligent UI epic
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </footer>
      </main>
    </div>
  );
}
