import ChatInput from "./ChatInput";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useEffect, useState, useMemo } from "react";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['600']
});

const InitialChat = () => {
  const words = useMemo(() => ["artist?", "campaign?", "fans?"], []);
  const [currentWord, setCurrentWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const currentFullWord = words[wordIndex];
    
    const typeNextCharacter = () => {
      if (isDeleting) {
        if (currentWord.length > 0) {
          setCurrentWord(prev => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        if (currentWord.length < currentFullWord.length) {
          setCurrentWord(prev => currentFullWord.slice(0, prev.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      }
    };

    const timer = setTimeout(typeNextCharacter, isDeleting ? 100 : 200);
    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, wordIndex, words]);

  return (
    <div className="grow h-screen overflow-hidden flex flex-col items-center justify-center w-full px-6">
      <div className="max-w-[900px] w-full mx-auto text-center -mt-20">
        <div className={`
          ${plusJakartaSans.className} 
          text-[28px]
          sm:text-3xl 
          lg:text-[32px] 
          leading-[1.2] 
          lg:leading-[40px] 
          tracking-[-0.5px] 
          mb-12
          lg:mb-8 
          lg:whitespace-nowrap 
          inline-block 
          font-semibold 
          text-center
        `}>
          <span className="lg:inline block mb-4 lg:mb-0">What would you like to know </span>
          <span className="lg:inline block lg:ml-0">
            about your&nbsp;
            <span className="inline-block min-w-[1ch] text-center transition-all duration-100">
              {currentWord}
              <span className="animate-pulse">|</span>
            </span>
          </span>
        </div>
      </div>
      <ChatInput />
    </div>
  );
};

export default InitialChat;
