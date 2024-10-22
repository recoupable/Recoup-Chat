import { useRouter } from "next/navigation";

const Conversation = ({ name, id }: { name: string; id: string }) => {
  const { push } = useRouter();

  return (
    <button
      className="border border-gray-700 rounded-md w-full p-3 text-left"
      type="button"
      onClick={() => push(`/${id}`)}
    >
      <p className="text-sm truncate">{name}</p>
    </button>
  );
};

export default Conversation;
