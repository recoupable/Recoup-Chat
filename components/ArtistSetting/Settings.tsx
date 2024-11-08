"use client";

import useIsMobile from "@/hooks/useIsMobile";
import { MicVocal, Plus, X } from "lucide-react";
import Image from "next/image";
import Form from "../Form";
import { validation } from "@/lib/utils/setting";
import Input from "../Input";
import TextArea from "../TextArea";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { SETTING_MODE } from "@/types/Setting";

const Settings = () => {
  const isMobile = useIsMobile();
  const {
    imageRef,
    baseRef,
    image,
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
    handleImageSelected,
    imageUploading,
    updating,
    saveSetting,
    toggleSettingModal,
    settingMode,
  } = useArtistProvider();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async () => {
    await saveSetting();
    toggleSettingModal();
  };

  return (
    <Form
      id="artist-setting"
      className="w-full grid grid-cols-12 gap-2 md:gap-3"
      validationSchema={validation}
      onSubmit={handleSave}
    >
      <div className="col-span-12 flex justify-between items-center border-b-gray-700 border-b-[1px] pb-3">
        <div className="flex gap-2 items-center">
          <MicVocal />
          <p>
            {settingMode === SETTING_MODE.CREATE
              ? "Add Artist"
              : "Artist Settings"}
          </p>
        </div>
        {!isMobile && (
          <button type="button" onClick={toggleSettingModal}>
            <X />
          </button>
        )}
      </div>
      <div className="col-span-4 space-y-1 md:space-y-2">
        <p className="text-sm">Artist Image</p>
        <button
          className="w-full"
          type="button"
          onClick={() => imageRef.current.click()}
        >
          <div className="w-[90px] aspect-[5/4] md:w-[120px] aspect-[1/1] rounded-md relative overflow-hidden flex items-center justify-center">
            {imageUploading ? (
              <p className="text-sm">Uploading...</p>
            ) : (
              <Image
                src={image || "https://i.imgur.com/QCdc8Ai.jpg"}
                layout="fill"
                className="object-cover"
                alt="not found pic"
              />
            )}
          </div>
        </button>
        <input
          type="file"
          hidden
          ref={imageRef}
          onChange={handleImageSelected}
        />
      </div>
      <div className="col-span-8 space-y-1 md:space-y-2">
        <TextArea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          label="Custom Instruction"
          id="instruction"
          name="instruction"
          rows={3}
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Artist Name"
          id="name"
          name="name"
          required
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          label="Artist Label"
          id="label"
          name="label"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          label="Spotify URL"
          id="spotifyUrl"
          name="spotifyUrl"
          required
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={appleUrl}
          onChange={(e) => setAppleUrl(e.target.value)}
          label="Apple URL"
          id="appleUrl"
          name="appleUrl"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={tiktok}
          onChange={(e) => setTikTok(e.target.value)}
          label="TikTok"
          id="tiktok"
          name="tiktok"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          label="Instagram"
          id="instagram"
          name="instagram"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          label="YouTube"
          id="youtube"
          name="youtube"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          label="X"
          id="twitter"
          name="twitter"
          hookToForm
        />
      </div>
      <div className="col-span-7 md:col-span-5 space-y-1 md:space-y-2">
        <p className="text-sm">Knowledge Base</p>
        <button
          className="w-full flex gap-2 items-center border-gray-700 rounded-md p-2 border-[1px]"
          onClick={() => baseRef.current.click()}
        >
          <Plus className="size-5 md:size-8" />
          <p className="text-xs md:text-sm">Click or Drop Files</p>
        </button>
        <input type="file" hidden ref={baseRef} />
      </div>
      <button
        className="col-span-12 border-gray-700 border-[1px] rounded-md py-1"
        type="submit"
      >
        {updating ? "Saving..." : "Save"}
      </button>
      <button
        className="col-span-12 border-gray-700 border-[1px] rounded-md py-1 mb-4"
        onClick={toggleSettingModal}
      >
        Close
      </button>
    </Form>
  );
};

export default Settings;
