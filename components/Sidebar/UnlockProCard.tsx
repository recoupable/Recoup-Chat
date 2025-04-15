import { ArrowRight } from "lucide-react";
import Icon from "../Icon";
import { usePaymentProvider } from "@/providers/PaymentProvider";

const UnlockProCard = () => {
  const { toggleModal } = usePaymentProvider();

  return (
    <div className="w-full md:w-[250px] shadow-grey-light flex flex-col rounded-3xl overflow-hidden my-4 aspect-[212/175] md:aspect-[212/180] bg-[url('/unlock-pro.png')] bg-cover bg-center">
      <div className="w-full relative aspect-[212/100]">
        <div className="absolute right-4 top-4">
          <Icon name="star" />
        </div>
        <div className="absolute size-full z-[1] font-inter_bold text-white text-xl p-4">
          Unlock PRO:
          <br />
          Smarter Brand
          <br />
          Deals Made Easy
        </div>
      </div>
      <div className="bg-white grow pt-3 px-4">
        <p className="text-[11px] font-plus_jakarta_sans_bold">
          Unlock unlimited reports and let AI find your next big brand deal
          automatically.
        </p>
        <button
          type="button"
          className="font-inter_bold text-xs bg-black text-white rounded-md px-2 py-1 flex justify-center gap-2 items-center mt-2"
          onClick={() => toggleModal(false)}
        >
          Unlock PRO Now
          <ArrowRight className="size-3" />
        </button>
      </div>
    </div>
  );
};

export default UnlockProCard;
