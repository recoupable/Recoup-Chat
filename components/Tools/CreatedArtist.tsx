// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CreatedArtist = ({ context }: any) => {
  const data = context?.data;

  return (
    <div>
      <p className="text-sm">Name: {data?.name}</p>
      <p className="text-sm">Id: {data?.id}</p>
      <p className="py-2 text-sm">
        To create a new campaign for the next step, click the button below.
      </p>
      <button
        type="button"
        className="border-gray-700 border-[1px] px-3 py-1 rounded-full text-sm"
      >
        Create a new campaign
      </button>
    </div>
  );
};

export default CreatedArtist;
