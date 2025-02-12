import { ReactNode } from "react";

interface VerifyCardProps {
  children: ReactNode;
}

const VerifyCard = ({ children }: VerifyCardProps) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">
          You can approve (or edit) Recoup&apos;s progress every step of the way
        </h1>

        <div className="flex items-center gap-4">
          <h2 className="text-xl">Are these handles correct?</h2>
        </div>

        {children}
      </div>
    </div>
  );
};

export default VerifyCard;
