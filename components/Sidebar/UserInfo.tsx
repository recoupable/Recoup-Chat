import { useUserProvider } from "@/providers/UserProvder";
import Image from "next/image";
import Icon from "../Icon";
import AccountModal from "../AccountModal";

const UserInfo = ({
  toggleMenuExpanded,
}: {
  toggleMenuExpanded: () => void;
}) => {
  const { email, toggleModal } = useUserProvider();

  return (
    <>
      <div className="w-full flex gap-3 items-center justify-between">
        <button
          className="flex gap-2 items-center"
          type="button"
          onClick={toggleModal}
        >
          <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-md overflow-hidden">
            <Image
              src="https://i.imgur.com/QCdc8Ai.jpg"
              layout="fill"
              alt="not found icon"
            />
          </div>
          <div>
            <p className="text-xs md:text-sm">{email}</p>
            <p className="text-xs md:text-sm text-left">Team Name</p>
          </div>
        </button>
        <button type="button" onClick={toggleMenuExpanded}>
          <Icon name="exit" />
        </button>
      </div>
      <AccountModal />
    </>
  );
};

export default UserInfo;
