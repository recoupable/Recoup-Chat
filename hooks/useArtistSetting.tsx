import { useArtistProvider } from "@/providers/ArtistProvider";
import { useEffect, useRef, useState } from "react";

const useArtistSetting = () => {
  const imageRef = useRef() as any;
  const baseRef = useRef() as any;
  const [image, setImage] = useState("");
  const [instruction, setInstruction] = useState("");
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [appleUrl, setAppleUrl] = useState("");
  const [tiktok, setTikTok] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");
  const [bases, setBases] = useState("");
  const { selectedArtist } = useArtistProvider();

  const handleImageSelected = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);
    }
  };

  useEffect(() => {
    if (selectedArtist) {
      setName(selectedArtist.name || "");
      setImage(selectedArtist.image || "");
    }
  }, [selectedArtist]);

  return {
    handleImageSelected,
    image,
    setImage,
    instruction,
    setInstruction,
    name,
    setName,
    label,
    setLabel,
    spotifyUrl,
    setSpotifyUrl,
    appleUrl,
    setAppleUrl,
    tiktok,
    setTikTok,
    instagram,
    setInstagram,
    youtube,
    setYoutube,
    twitter,
    setTwitter,
    bases,
    setBases,
    imageRef,
    baseRef,
  };
};

export default useArtistSetting;
