"use client";

import useIsMobile from "@/hooks/useIsMobile";
import { MicVocal, X } from "lucide-react";
import Form from "../Form";
import { validation } from "@/lib/utils/setting";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { SETTING_MODE } from "@/types/Setting";
import Knowledges from "./Knowledges";
import ImageSelect from "./ImageSelect";
import KnowledgeSelect from "./KnowledgeSelect";
import Inputs from "./Inputs";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import { useAgentsProvider } from "@/providers/AgentsProvider";
import { useFunnelAnalysisProvider } from "@/providers/FunnelAnalysisProvider";
import AccountIdDisplay from "./AccountIdDisplay";

const Settings = () => {
  const isMobile = useIsMobile();
  const {
    toggleSettingModal,
    saveSetting,
    updating,
    settingMode,
    knowledgeUploading,
    setSelectedArtist,
    editableArtist,
  } = useArtistProvider();
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  const { lookupProfiles } = useAgentsProvider();
  const { setIsLoading } = useFunnelAnalysisProvider();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async () => {
    const artistInfo = await saveSetting();
    setSelectedArtist(artistInfo);
    toggleSettingModal();
    if (editableArtist) return;
    setIsLoading(true);
    lookupProfiles("wrapped", artistInfo);
  };

  return (
    <Form
      id="artist-setting"
      className="w-full grid grid-cols-12 gap-2 md:gap-3"
      validationSchema={validation}
      onSubmit={handleSave}
    >
      <div className="col-span-12 flex justify-between items-center border-b-grey border-b-[1px] pb-3">
        <div className="flex gap-2 items-center">
          <MicVocal />
          <div className="flex flex-col">
            <p>
              {settingMode === SETTING_MODE.CREATE
                ? "Add Artist"
                : "Artist Settings"}
            </p>
            {settingMode === SETTING_MODE.UPDATE && editableArtist && (
              <AccountIdDisplay accountId={editableArtist.account_id} />
            )}
          </div>
        </div>
        {!isMobile && (
          <button type="button" onClick={toggleSettingModal}>
            <X />
          </button>
        )}
      </div>
      <div className="col-span-4 space-y-1 md:space-y-2">
        <p className="text-sm">Artist Image</p>
        <ImageSelect />
      </div>
      <Inputs />
      <div className="col-span-7 md:col-span-5 space-y-1 md:space-y-2">
        <p className="text-sm">Knowledge Base</p>
        <KnowledgeSelect />
      </div>
      <div className="col-span-7 space-y-1 md:space-y-2 flex flex-col justify-end items-start">
        {knowledgeUploading ? (
          <p className="text-sm">Uploading...</p>
        ) : (
          <Knowledges />
        )}
      </div>
      <button
        className="col-span-12 border-grey border-[1px] rounded-md py-1"
        type="submit"
      >
        {updating ? "Saving..." : "Save"}
      </button>
      <button
        className="col-span-12 border-grey border-[1px] rounded-md py-1 mb-4 text-red-700"
        onClick={() => setIsVisibleDeleteModal(true)}
        type="button"
      >
        Delete
      </button>
      {isVisibleDeleteModal && (
        <DeleteModal
          toggleModal={() => setIsVisibleDeleteModal(!isVisibleDeleteModal)}
        />
      )}
    </Form>
  );
};

export default Settings;
