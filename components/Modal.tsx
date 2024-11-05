import React, { ReactNode } from "react";

interface IModal {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: () => any;
  children: ReactNode;
}

const Modal = ({ children, onClose }: IModal) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    className="absolute left-0 top-0 w-full h-full z-[150] flex items-center justify-center backdrop-blur-[4px]"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick={(e: any) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="relative z-[2] max-h-[90%] overflow-y-auto rounded-md w-[500px] bg-black border-gray-700 border-[1px] p-4">
      {children}
    </div>
  </div>
);

export default Modal;
