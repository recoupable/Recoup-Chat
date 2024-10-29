// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CreatedArtist = ({ context }: any) => {
  const data = context?.data;

  return (
    <div>
      <p className="text-sm">
        {data?.name} - {data?.id}
      </p>
      <button
        type="button"
        className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm"
      >
        Create a new campaign.
      </button>
    </div>
  );
};

export default CreatedArtist;
