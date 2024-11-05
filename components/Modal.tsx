import React, { ReactNode } from "react";

interface IModal {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: () => any;
  children: ReactNode;
  className?: string;
}

const Modal = ({ children, onClose, className }: IModal) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    className={`fixed left-0 md:left-[60px] top-0 w-screen h-screen z-[150] flex items-center justify-center bg-[#6262626b] bg-[url('/circle.png')] bg-center bg-cover px-3 md:px-0 ${className || ""}`}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick={(e: any) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="relative z-[2] max-h-[95%] md:max-h-[85%] overflow-y-auto rounded-2xl md:rounded-md w-full md:w-[500px] bg-black border-gray-700 border-[1px] px-4 py-3 md:p-4">
      {children}
    </div>
  </div>
);

export default Modal;
