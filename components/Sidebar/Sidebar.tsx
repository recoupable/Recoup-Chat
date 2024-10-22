import { BookOpen } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const Sidebar = () => {
  const { push } = useRouter();

  return (
    <div className="border-r-[1px] border-r-gray-700 w-16 flex flex-col py-4 px-2 items-center gap-3">
      <button type="button" onClick={() => push("/")}>
        <Image src="/logo.png" width={90} height={90} alt="not found icon" />
      </button>
      <button
        type="button"
        className="border-gray-700 border-[1px] p-2 rounded-md"
        onClick={() => push("/history")}
      >
        <BookOpen />
      </button>
    </div>
  );
};

export default Sidebar;
