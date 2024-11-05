import { useUserProvider } from "@/providers/UserProvder";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";

const UserInfo = () => {
  const { email } = useUserProvider();

  return (
    <div className="flex gap-3 items-center">
      <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-md overflow-hidden">
        <Image
          src="https://i.imgur.com/QCdc8Ai.jpg"
          layout="fill"
          alt="not found icon"
        />
      </div>
      <div>
        <p className="text-xs md:text-sm">{email}</p>
        <p className="text-xs md:text-sm">Team Name</p>
      </div>
      <SquareArrowOutUpRight className="size-5 md:size-8" />
    </div>
  );
};

export default UserInfo;
