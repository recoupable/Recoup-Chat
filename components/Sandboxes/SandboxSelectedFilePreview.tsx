import SandboxFilePreview from "./SandboxFilePreview";
import type useSandboxFileContent from "@/hooks/useSandboxFileContent";

export default function SandboxSelectedFilePreview({
  fileContent,
}: {
  fileContent: ReturnType<typeof useSandboxFileContent>;
}) {
  if (!fileContent.selectedPath) return null;
  return (
    <SandboxFilePreview
      {...fileContent}
      selectedPath={fileContent.selectedPath}
    />
  );
}
