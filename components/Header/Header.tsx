"use client";

import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MobileMenu from "../MobileMenu";

const Header = () => {
  const pathname = usePathname();
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);

  return (
    <div className="w-screen flex p-4 items-center md:hidden block">
      <button
        type="button"
        className="flex items-center gap-2"
        onClick={() => setIsOpenMobileMenu(!isOpenMobileMenu)}
      >
        <MenuIcon />
      </button>
      {isOpenMobileMenu && (
        <MobileMenu toggleMenu={() => setIsOpenMobileMenu(!isOpenMobileMenu)} />
      )}
    </div>
  );
};

export default Header;
