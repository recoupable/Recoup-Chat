import { BookOpen, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MobileMenu = ({ toggleMenu }: { toggleMenu: () => void }) => {
  const { push } = useRouter();

  return (
    <motion.div
      className="fixed w-[80%] !bg-[#0a0a0a] h-full left-0 top-0 z-[10000] px-4 py-4 border-r-gray-700 border-r-[1px]"
      initial={{
        x: "-80%",
      }}
      animate={{
        x: "0%",
      }}
      exit={{
        x: "0%",
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <div className="flex justify-between mb-6">
        <button
          type="button"
          onClick={() => {
            push("/");
            toggleMenu();
          }}
        >
          <Image src="/logo.jpg" width={40} height={40} alt="not found icon" />
        </button>
        <button type="button" onClick={toggleMenu}>
          <X />
        </button>
      </div>
      <button
        className="flex gap-2 items-center"
        type="button"
        onClick={() => {
          push("/history");
          toggleMenu();
        }}
      >
        <BookOpen />
        Chat History
      </button>
    </motion.div>
  );
};

export default MobileMenu;
