import { useEffect, useRef, useState } from "react";

const useClickOutsideSelect = () => {
  const selectRef = useRef() as any;
  const [isVisibleSelect, setIsVisibleSelect] = useState(false);

  useEffect(() => {
    const handleClose = (e: any) => {
      if (selectRef.current && !selectRef.current.contains(e.target))
        setIsVisibleSelect(false);
    };

    document.addEventListener("mousedown", handleClose);

    return () => document.removeEventListener("mousedown", handleClose);
  }, [selectRef]);

  return {
    isVisibleSelect,
    setIsVisibleSelect,
    selectRef,
  };
};

export default useClickOutsideSelect;
