import Conversation from "./Conversation";
import SearchInput from "./SearchInput";

const History = () => {
  return (
    <div
      className={`grow h-screen overflow-hidden flex flex-col gap-3 items-center pt-20`}
    >
      <SearchInput />
      <div className="max-w-3xl mx-auto w-full space-y-3">
        <Conversation />
        <Conversation />
        <Conversation />
      </div>
    </div>
  );
};

export default History;
