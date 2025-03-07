import { useState } from "react";
import Slider from "../Slider";
import { Mousewheel } from "swiper/modules";
import Swiper from "swiper";
import { usePromptsProvider } from "@/providers/PromptsProvider";
import SuggestionPill from "./SuggestionPill";
import { Skeleton } from "../ui/skeleton";

Swiper.use([Mousewheel]);

const SideSuggestions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { prompts } = usePromptsProvider();

  return (
    <div className="relative py-2">
      {currentIndex !== 0 && (
        <div className="absolute left-0 top-0 size-full bg-gradient-to-r from-[#ffffffcc] via-[#ffffff00] to-[#ffffff00] z-[2] pointer-events-none" />
      )}
      {currentIndex !== 3 && (
        <div className="absolute left-0 top-0 size-full bg-gradient-to-l from-[#ffffffcc] via-[#ffffff00] to-[#ffffff00] z-[3] pointer-events-none" />
      )}
      <Slider
        className="!overflow-hidden pl-0"
        sliderProps={{
          initialSlide: 0,
          slidesPerView: 1.2,
          spaceBetween: 20,
          grabCursor: true,
          centeredSlides: false,
          onSlideChange: (swiperCtrl) =>
            setCurrentIndex(swiperCtrl.activeIndex),
          breakpoints: {
            770: {
              slidesPerView: 3.5,
              spaceBetween: 12,
              centeredSlides: false,
            },
            440: {
              initialSlide: 0,
              slidesPerView: 1.5,
              spaceBetween: 20,
              centeredSlides: false,
            },
          },
          mousewheel: {
            sensitivity: 1,
          },
        }}
      >
        {prompts?.length
          ? prompts.map((suggestion: string) => (
              <SuggestionPill suggestion={suggestion} key={suggestion} />
            ))
          : Array.from({ length: 4 }).map((_, index) => (
              <Skeleton className="min-w-[200px] h-[66px]" key={index} />
            ))}
      </Slider>
    </div>
  );
};

export default SideSuggestions;
