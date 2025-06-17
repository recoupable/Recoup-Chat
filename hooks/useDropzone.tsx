import { useCallback } from "react";
import { useDropzone as useReactDropzone } from "react-dropzone";
import { usePureFileAttachments } from "./usePureFileAttachments";

export const useDropzone = () => {
  const { uploadFile, MAX_FILES } = usePureFileAttachments();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Limit to MAX_FILES
      const filesToUpload = acceptedFiles.slice(0, MAX_FILES);

      if (acceptedFiles.length > MAX_FILES) {
        console.warn(`Only the first ${MAX_FILES} files will be uploaded`);
      }

      filesToUpload.forEach(async (file) => {
        try {
          await uploadFile(file);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      });
    },
    [uploadFile, MAX_FILES]
  );

  return useReactDropzone({
    onDrop,
    noClick: true, // Only trigger on drag, not on click
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    multiple: true,
    maxFiles: MAX_FILES,
  });
};
