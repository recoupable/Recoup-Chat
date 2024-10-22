import ChatInput from "./ChatInput";

const InitialChat = () => {
  return (
    <div className="grow h-screen overflow-hidden flex flex-col items-center justify-center">
      <p className="font-sans font-semibold text-2xl mb-2 text-center">
        {`How is Luh Tyler's 3D Game Performing?`}
      </p>
      <ChatInput />
    </div>
  );
};

export default InitialChat;
