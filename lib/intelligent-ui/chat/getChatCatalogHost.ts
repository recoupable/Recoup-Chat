import { z } from "zod";
import { isChatIntelligentUIEnabled } from "./isChatIntelligentUIEnabled";

const catalogIdSchema = z.string().uuid().brand<"CatalogId">();
const workspaceIdSchema = z.string().uuid();

export interface CatalogIntelligentUIContext {
  schemaVersion: 1;
  workspace: { kind: "organization" | "account"; id: string };
  subject: { kind: "catalog"; id: z.infer<typeof catalogIdSchema> };
}

type CatalogHost =
  | { kind: "absent" }
  | { kind: "invalid" }
  | {
      kind: "catalog";
      subject: CatalogIntelligentUIContext["subject"];
      workspace?: CatalogIntelligentUIContext["workspace"];
    };

/** Browser context only. The API must independently authorize these references. */
export function getChatCatalogHost({
  catalogId,
  workspaceInitialized,
  organizationId,
  accountId,
}: {
  catalogId?: string | string[];
  workspaceInitialized: boolean;
  organizationId: string | null;
  accountId?: string;
}): CatalogHost {
  if (!isChatIntelligentUIEnabled() || catalogId === undefined)
    return { kind: "absent" };
  const catalog = catalogIdSchema.safeParse(catalogId);
  if (!catalog.success) return { kind: "invalid" };
  // A null initial selection is not a deliberate Personal selection.
  const workspace = workspaceIdSchema.safeParse(organizationId ?? accountId);
  return {
    kind: "catalog",
    subject: { kind: "catalog", id: catalog.data },
    ...(workspaceInitialized && workspace.success
      ? {
          workspace: {
            kind: organizationId === null ? "account" : "organization",
            id: workspace.data,
          },
        }
      : {}),
  };
}
