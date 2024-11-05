import useModalAnimation from "@/hooks/useModalAnimation";
import { motion } from "framer-motion";

const SideModal = ({
  isVisible,
  toggleModal,
  children,
}: {
  isVisible: boolean;
  toggleModal: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}) => {
  const { animate, initial } = useModalAnimation(isVisible);
  return (
    <div
      className={`!fixed left-0 top-0 z-[200] flex h-screen w-screen backdrop-blur-[5px] overflow-hidden ${isVisible ? "block" : "hidden"}`}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick={(e: any) => {
        if (e.target === e.currentTarget) toggleModal();
      }}
    >
      <motion.div
        className="flex h-full w-full flex-col bg-black max-w-[300px] px-4 py-8"
        animate={animate}
        initial={initial}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SideModal;
