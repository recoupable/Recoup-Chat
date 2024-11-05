import useIsMobile from "./useIsMobile";

const useModalAnimation = (isOpenModal: boolean) => {
  const mobileAnimate = {
    y: isOpenModal ? "-100%" : "0%",
    maxHeight: isOpenModal ? "80%" : "0px",
  };
  const mobileInitial = { y: "-100%" };
  const desktopAnimate = { x: isOpenModal ? "0%" : "-100%" };
  const desktopInitial = { x: 0 };

  const isMobile = useIsMobile();

  return {
    animate: isMobile ? mobileAnimate : desktopAnimate,
    initial: isMobile ? mobileInitial : desktopInitial,
  };
};

export default useModalAnimation;
