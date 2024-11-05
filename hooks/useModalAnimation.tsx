const useModalAnimation = (isOpenModal: boolean) => {
  const desktopAnimate = { x: isOpenModal ? "0%" : "-100%" };
  const desktopInitial = { x: 0 };

  return {
    animate: desktopAnimate,
    initial: desktopInitial,
  };
};

export default useModalAnimation;
