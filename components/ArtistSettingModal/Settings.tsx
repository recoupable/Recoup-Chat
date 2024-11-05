import useArtistSetting from "@/hooks/useArtistSetting";
import { MicVocal, Plus, X } from "lucide-react";
import Image from "next/image";

const Settings = ({ toggleModal }: { toggleModal: () => void }) => {
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
  } = useArtistSetting();

  return (
    <div className="w-full grid grid-cols-12 gap-3">
      <div className="col-span-12 flex justify-between items-center border-b-gray-700 border-b-[1px] pb-3">
        <div className="flex gap-2 items-center">
          <MicVocal />
          <p>Artist Settings</p>
        </div>
        <button type="button" onClick={toggleModal}>
          <X />
        </button>
      </div>
      <div className="col-span-4 space-y-2">
        <p className="text-sm">Artist Image</p>
        <button
          className="w-full"
          type="button"
          onClick={() => imageRef.current.click()}
        >
          <div className="w-[120px] aspect-[1/1] rounded-md relative overflow-hidden">
            <Image
              src={image || "https://i.imgur.com/QCdc8Ai.jpg"}
              layout="fill"
              className="object-cover"
              alt="not found pic"
            />
          </div>
        </button>
        <input
          type="file"
          hidden
          ref={imageRef}
          onChange={handleImageSelected}
        />
      </div>
      <div className="col-span-8 space-y-2">
        <p className="text-sm">Custom Intruction</p>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          rows={5}
          className="w-full !outline-none border-gray-700 border-[1px] p-2 rounded-md text-sm"
        />
      </div>
      <div className="col-span-6 space-y-2">
        <p className="text-sm">Artist Name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full !outline-none border-gray-700 border-[1px] p-2 rounded-md text-sm"
        />
      </div>
      <div className="col-span-6 space-y-2">
        <p className="text-sm">Artist Label</p>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full !outline-none border-gray-700 border-[1px] p-2 rounded-md text-sm"
        />
      </div>
      <div className="col-span-6 space-y-2">
        <p className="text-sm">Spotify URL</p>
        <input
          type="text"
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          className="w-full !outline-none border-gray-700 border-[1px] p-2 rounded-md text-sm"
        />
      </div>
      <div className="col-span-6 space-y-2">
        <p className="text-sm">Apple URL</p>
        <input
          type="text"
          value={appleUrl}
          onChange={(e) => setAppleUrl(e.target.value)}
          className="w-full !outline-none border-gray-700 border-[1px] p-2 rounded-md text-sm"
        />
      </div>
      <div className="col-span-6 space-y-2">
        <p className="text-sm">TikTok</p>
        <input
          type="text"
          value={tiktok}
          onChange={(e) => setTikTok(e.target.value)}
          className="w-full !outline-none border-gray-700 border-[1px] p-2 rounded-md text-sm"
        />
      </div>
      <div className="col-span-6 space-y-2">
        <p className="text-sm">Instagram</p>
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full !outline-none border-gray-700 border-[1px] p-2 rounded-md text-sm"
        />
      </div>
      <div className="col-span-6 space-y-2">
        <p className="text-sm">YouTube</p>
        <input
          type="text"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          className="w-full !outline-none border-gray-700 border-[1px] p-2 rounded-md text-sm"
        />
      </div>
      <div className="col-span-6 space-y-2">
        <p className="text-sm">X</p>
        <input
          type="text"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          className="w-full !outline-none border-gray-700 border-[1px] p-2 rounded-md text-sm"
        />
      </div>
      <div className="col-span-5 space-y-2">
        <p className="text-sm">Knowledge Base</p>
        <button
          className="w-full flex gap-2 items-center border-gray-700 rounded-md p-2 border-[1px]"
          onClick={() => baseRef.current.click()}
        >
          <Plus />
          <p className="text-sm">Click or Drop Files</p>
        </button>
        <input type="file" hidden ref={baseRef} />
      </div>
      <button className="col-span-12 border-gray-700 border-[1px] rounded-md py-1 mb-4">
        Save
      </button>
    </div>
  );
};

export default Settings;
