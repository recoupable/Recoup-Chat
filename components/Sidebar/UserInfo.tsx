import { useUserProvider } from "@/providers/UserProvder";
import Image from "next/image";
import Icon from "../Icon";

const UserInfo = ({
  toggleMenuExpanded,
}: {
  toggleMenuExpanded: () => void;
}) => {
  const { email, toggleModal, userData } = useUserProvider();

  return (
    <div
      className={`w-full flex gap-3 items-center ${email ? "justify-between" : "justify-end pr-2"}`}
    >
      {userData && (
        <button
          className="flex gap-2 items-center"
          type="button"
          onClick={toggleModal}
        >
          <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-md overflow-hidden">
            <Image
              src={userData?.image || "https://i.imgur.com/QCdc8Ai.jpg"}
              layout="fill"
              alt="not found icon"
            />
          </div>
          <div>
            <p className="text-xs md:text-sm truncate max-w-[190px]">
              {userData?.name || email || userData?.wallet}
            </p>
            <p className="text-xs md:text-sm text-left">
              {userData?.organization}
            </p>
          </div>
        </button>
      )}
      <button type="button" onClick={toggleMenuExpanded}>
        <Icon name="exit" />
      </button>
    </div>
  );
};

export default UserInfo;
