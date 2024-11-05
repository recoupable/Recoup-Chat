import { X } from "lucide-react";

const Introducing = ({ toggleVisible }: { toggleVisible: () => void }) => {
  return (
    <div className="border-[1px] border-gray-700 rounded-md my-2 md:my-4 p-2 md:p-3">
      <div className="flex w-full justify-between">
        <p className="text-xs md:text-sm">Introducing Artist Mode</p>
        <button type="button" onClick={toggleVisible}>
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs md:text-sm">{`Choose an artist to explore their campaign insights and fan data. Dive into everything you need to know about your roster.`}</p>
    </div>
  );
};

export default Introducing;
