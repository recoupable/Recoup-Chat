export interface Language {
  readonly name: string;
  readonly value: string;
}

export const languages: readonly Language[] = [
  { name: "cURL", value: "curl" },
  { name: "Python", value: "python" },
  { name: "JavaScript", value: "javascript" },
  { name: "TypeScript", value: "typescript" },
] as const;
