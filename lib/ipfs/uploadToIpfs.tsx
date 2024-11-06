import { hashFiles } from "./hash";

export type IPFSUploadResponse = {
  cid: string;
  uri: string;
};

const uploadCache = {
  prefix: "Pinata/IPFSUploadCache",
  get(files: File[]): IPFSUploadResponse | undefined {
    const digest = hashFiles(files);
    try {
      const cid = localStorage.getItem(`${this.prefix}/${digest}`);
      if (cid) {
        return { cid, uri: `ipfs://${cid}` };
      }
    } catch {}
  },
  put(files: File[], cid: string) {
    const digest = hashFiles(files);
    try {
      localStorage.setItem(`${this.prefix}/${digest}`, cid);
    } catch {}
  },
};

export const uploadFile = async (file: File): Promise<IPFSUploadResponse> => {
  try {
    const data = new FormData();
    data.set("file", file);
    const cached = uploadCache.get([file]);
    if (cached) return cached;
    const res = await fetch("/api/ipfs", {
      method: "POST",
      body: data,
    });
    const json = await res.json();
    const { cid } = json;
    uploadCache.put([file], cid);
    return { cid, uri: `ipfs://${cid}` };
  } catch (error) {
    console.error(error);
    return { cid: "", uri: "" };
  }
};
