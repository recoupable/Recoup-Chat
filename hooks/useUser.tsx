import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import { Address } from "viem";
import useTrackEmail from "./useTrackEmail";
import { uploadFile } from "@/lib/ipfs/uploadToIpfs";
import getIpfsLink from "@/lib/ipfs/getIpfsLink";

const useUser = () => {
  const { login, user } = usePrivy();
  const address = user?.wallet?.address as Address;
  const email = user?.email?.address;
  const [userData, setUserData] = useState<any>(null);
  const { trackId } = useTrackEmail();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [organization, setOrganization] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const imageRef = useRef() as any;
  const [updating, setUpdating] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleImageSelected = async (e: any) => {
    setImageUploading(true);
    const file = e.target.files[0];
    if (!file) {
      setImageUploading(false);
      return;
    }
    if (file) {
      const { uri } = await uploadFile(file);
      setImage(getIpfsLink(uri));
    }
    setImageUploading(false);
  };

  const save = async () => {
    setUpdating(true);
    const response = await fetch("/api/account/update", {
      method: "POST",
      body: JSON.stringify({
        instruction,
        organization,
        name,
        image,
      }),
    });
    const data = await response.json();
    setUserData(data.data);
    setUpdating(false);
  };

  const isPrepared = () => {
    if (!address) {
      login();
      return false;
    }

    return true;
  };

  useEffect(() => {
    const init = async () => {
      const config = {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("/api/account", config);

      if (!response.ok) {
        throw new Error(
          `Email API request failed with status: ${response.status}`,
        );
      }

      const data = await response.json();
      setUserData(data.data);
      setImage(data.data?.image || "");
      setInstruction(data.data?.instruction || "");
      setName(data?.data?.name || "");
      setOrganization(data?.data?.organization || "");
    };
    if (!email) return;
    init();
  }, [email]);

  return {
    address,
    email,
    login,
    isPrepared,
    userData,
    trackId,
    setIsModalOpen,
    isModalOpen,
    instruction,
    setInstruction,
    image,
    setImage,
    name,
    setName,
    toggleModal,
    handleImageSelected,
    imageRef,
    imageUploading,
    updating,
    save,
    organization,
    setOrganization,
  };
};

export default useUser;
