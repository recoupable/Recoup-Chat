import { ArtistToolResponse } from "@/types/Tool";

const FollowUp = ({
  toolName,
  context,
  loading,
}: {
  toolName: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any;
  loading: boolean | undefined;
}) => {
  return (
    <div>
      {toolName === "getArtistAnalysis" &&
        context.status === ArtistToolResponse.TIKTOK_TRENDS &&
        !loading && (
          <>
            <p className="text-sm mt-3">
              To create a new campaign for the next step, click the button
              below.
            </p>
            <button
              type="button"
              className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm"
            >
              Create a new campaign
            </button>
          </>
        )}
    </div>
  );
};

export default FollowUp;
