"use client";

import { useState } from "react";
import { PaletteIcon } from "lucide-react";
import Link from "next/link";
import Chat from "../Chat";
import Header from "./Header";
const RecordIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

const BankIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M20 10V21M8 14V17M12 14V17M16 14V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PersonWithHardhatIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
      fill="currentColor"
    />
    <path d="M12 0L8 4H16L12 0Z" fill="currentColor" />
  </svg>
);

const MobileLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 1080 1080"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="1080" height="1080" rx="120" fill="#EDFF44" />
    <path
      d="M694.516 366.305C724.333 366.305 750.049 368.909 771.664 374.117C793.409 379.326 811.964 387.724 827.328 399.312C842.823 410.771 854.346 426.005 861.898 445.016C869.581 464.026 873.422 487.008 873.422 513.961C873.422 537.008 870.883 557.06 865.805 574.117C860.727 591.044 853.5 605.107 844.125 616.305C834.75 627.503 822.576 636.487 807.602 643.258C792.628 650.029 776.091 654.781 757.992 657.516C739.893 660.38 718.734 661.812 694.516 661.812H383.578C360.792 661.812 340.544 660.445 322.836 657.711C305.258 654.977 288.852 650.224 273.617 643.453C258.513 636.552 246.013 627.568 236.117 616.5C226.221 605.302 218.474 591.174 212.875 574.117C207.406 556.93 204.672 536.878 204.672 513.961C204.672 487.008 208.448 464.026 216 445.016C223.552 426.005 235.01 410.771 250.375 399.312C265.87 387.724 284.424 379.326 306.039 374.117C327.784 368.909 353.63 366.305 383.578 366.305H694.516ZM694.516 591.695C708.839 591.695 720.948 590.589 730.844 588.375C740.87 586.031 749.724 581.995 757.406 576.266C765.089 570.536 770.753 562.529 774.398 552.242C778.174 541.956 780.062 529.195 780.062 513.961C780.062 498.596 778.24 485.836 774.594 475.68C771.078 465.393 765.479 457.385 757.797 451.656C750.245 445.927 741.456 441.956 731.43 439.742C721.404 437.398 709.099 436.227 694.516 436.227H383.578C369.125 436.227 356.885 437.398 346.859 439.742C336.833 441.956 327.979 445.927 320.297 451.656C312.745 457.385 307.081 465.393 303.305 475.68C299.659 485.836 297.836 498.596 297.836 513.961C297.836 529.326 299.659 542.151 303.305 552.438C307.081 562.594 312.745 570.536 320.297 576.266C327.979 581.995 336.833 586.031 346.859 588.375C356.885 590.589 369.125 591.695 383.578 591.695H694.516Z"
      fill="#00309A"
    />
  </svg>
);

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const wrapTextInSpans = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className="hover-outline-letter" data-letter={char}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div
      className="flex min-h-screen bg-[#00309A] text-white font-inter relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Icons and Logo */}
      <div className="fixed left-0 top-0 bottom-0 w-12 flex flex-col items-center py-4 z-30">
        <div className="relative w-8 h-8 mb-8 transition-all duration-300 ease-in-out">
          <MobileLogo />
        </div>
        <div className="flex-grow flex flex-col items-center justify-center space-y-6">
          <div
            className="icon-wrapper group relative flex items-center justify-center w-8 h-8 transition-all duration-300"
            aria-label="Label"
          >
            <button className="w-full h-full flex items-center justify-center">
              <RecordIcon />
            </button>
            <div className="icon-tooltip opacity-0 invisible group-hover:opacity-100 group-hover:visible">
              <div className="tooltip-arrow"></div>
              <span>Label</span>
            </div>
          </div>
          <div
            className="icon-wrapper group relative flex items-center justify-center w-8 h-8 transition-all duration-300"
            aria-label="Publisher"
          >
            <button className="w-full h-full flex items-center justify-center">
              <BankIcon />
            </button>
            <div className="icon-tooltip opacity-0 invisible group-hover:opacity-100 group-hover:visible">
              <div className="tooltip-arrow"></div>
              <span>Publisher</span>
            </div>
          </div>
          <div
            className="icon-wrapper group relative flex items-center justify-center w-8 h-8 transition-all duration-300"
            aria-label="Manager"
          >
            <button className="w-full h-full flex items-center justify-center">
              <PersonWithHardhatIcon />
            </button>
            <div className="icon-tooltip opacity-0 invisible group-hover:opacity-100 group-hover:visible">
              <div className="tooltip-arrow"></div>
              <span>Manager</span>
            </div>
          </div>
          <div
            className="icon-wrapper group relative flex items-center justify-center w-8 h-8 transition-all duration-300"
            aria-label="Creative"
          >
            <button className="w-full h-full flex items-center justify-center">
              <PaletteIcon className="w-4 h-4" />
            </button>
            <div className="icon-tooltip opacity-0 invisible group-hover:opacity-100 group-hover:visible">
              <div className="tooltip-arrow"></div>
              <span>Creative</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col ml-12">
        <div
          className="absolute inset-0 bg-dots"
          style={{
            backgroundPosition: `${mousePosition.x / 25}px ${
              mousePosition.y / 25
            }px`,
            transition: "background-position 0.2s ease-out",
          }}
        ></div>

        <div className="flex flex-col min-h-screen w-full z-10">
          <Header />
          <main className="flex-grow flex flex-col items-center justify-center text-center p-3 sm:p-4">
            <h1 className="mb-2 tracking-tight">
              <div className="font-['Joyride_Std'] text-xl sm:text-2xl md:text-3xl leading-tight hover-outline-container">
                {wrapTextInSpans("A CHATB")}
                <span className="font-['JoyrideALT'] text-[#EDFF44]">O</span>
                {wrapTextInSpans("T MADE FOR")}
              </div>
              <div className="font-['Joyride_Std'] text-xl sm:text-2xl md:text-3xl leading-tight hover-outline-container">
                {wrapTextInSpans("THE MUSIC BUSINESS")}
              </div>
            </h1>
            <p className="mb-4 text-[10px] sm:text-xs text-white max-w-lg font-inter font-light hover-outline-container">
              {wrapTextInSpans(
                "Meet your new assistant for engagement, strategy, and growth."
              )}
            </p>
            <Chat />
          </main>
          <footer className="p-3 sm:p-4 flex flex-col items-center">
            <div className="flex flex-wrap justify-center items-center text-[8px] mb-2">
              <Link
                href="#"
                className="hover:underline font-normal transition-colors duration-150 ease-in-out hover:text-[#FFFF00]"
              >
                FAQ
              </Link>
              <span className="mx-2">|</span>
              <Link
                href="#"
                className="hover:underline font-normal transition-colors duration-150 ease-in-out hover:text-[#FFFF00]"
              >
                Terms
              </Link>
              <span className="mx-2">|</span>
              <Link
                href="#"
                className="hover:underline font-normal transition-colors duration-150 ease-in-out hover:text-[#FFFF00]"
              >
                AI Policy
              </Link>
              <span className="mx-2">|</span>
              <Link
                href="#"
                className="hover:underline font-normal transition-colors duration-150 ease-in-out hover:text-[#FFFF00]"
              >
                Privacy
              </Link>
            </div>
          </footer>
        </div>
      </div>

      <style jsx global>{`
        @keyframes moveDots {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 25px 25px;
          }
        }
        .bg-dots {
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );
          background-size: 25px 25px;
          animation: moveDots 20s linear infinite;
        }
        .bg-dots:hover {
          animation-play-state: paused;
        }
        .bubble-prompt {
          position: relative;
          overflow: hidden;
        }
        .bubble-prompt:hover {
          border-color: #ffff00;
          color: #ffff00;
        }
        .bubble-prompt:hover svg {
          stroke: #ffff00;
        }
        .hover-outline-container {
          display: inline-block;
        }
        .hover-outline-letter {
          position: relative;
          display: inline-block;
          transition: all 0.15s ease;
        }
        .hover-outline-letter::before {
          content: attr(data-letter);
          position: absolute;
          top: 0;
          left: 0;
          color: transparent;
          -webkit-text-stroke: 1px white;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .hover-outline-container:hover .hover-outline-letter:hover::before {
          opacity: 1;
        }
        .icon-wrapper {
          transition: all 0.3s ease-in-out;
        }
        .icon-wrapper button {
          position: relative;
          z-index: 1;
        }
        .icon-wrapper button::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .icon-wrapper:hover button::before {
          opacity: 1;
        }
        .icon-wrapper svg {
          transition: all 0.3s ease-in-out;
        }
        .icon-tooltip {
          position: absolute;
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
          background-color: white;
          color: #00309a;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .tooltip-arrow {
          position: absolute;
          left: -4px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          background-color: white;
        }
      `}</style>
    </div>
  );
}
