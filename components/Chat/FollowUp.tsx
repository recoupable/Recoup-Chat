const FollowUp = ({ toolName }: { toolName: string | undefined }) => {
  return (
    <div>
      {toolName === "getArtistAnalysis" && (
        <>
          <p className="text-sm">
            To create a new campaign for the next step, click the button below.
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
