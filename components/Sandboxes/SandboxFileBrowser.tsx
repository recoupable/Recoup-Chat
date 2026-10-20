import { FileTree } from "@/components/ai-elements/file-tree";
import FileNodeComponent from "./FileNodeComponent";
import SandboxSelectedFilePreview from "./SandboxSelectedFilePreview";
import type { FileNode } from "@/lib/sandboxes/parseFileTree";
import type useSandboxFileContent from "@/hooks/useSandboxFileContent";

/** Existing read-only tree/preview, shared with the replacement controller. */
export default function SandboxFileBrowser({
  filetree,
  fileContent,
}: {
  filetree: FileNode[];
  fileContent: ReturnType<typeof useSandboxFileContent>;
}) {
  return (
    <>
      <div className="w-full lg:max-w-md lg:shrink-0">
        <h2 className="mb-2 text-lg font-medium">Repository Files</h2>
        <FileTree
          selectedPath={fileContent.selectedPath}
          onSelect={fileContent.select}
        >
          {filetree.map((node) => (
            <FileNodeComponent key={node.path} node={node} />
          ))}
        </FileTree>
      </div>
      <SandboxSelectedFilePreview fileContent={fileContent} />
    </>
  );
}
