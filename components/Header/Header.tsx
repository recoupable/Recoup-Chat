"use client";

import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import MobileMenu from "../MobileMenu";

const Header = () => {
  const pathname = usePathname();
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);

  const label = useMemo(() => {
    if (pathname.includes("/history")) return "Chat History";
    return "Home";
  }, [pathname]);

  return (
    <div className="w-screen flex p-4 items-center md:hidden block">
      <button
        type="button"
        className="flex items-center gap-2"
        onClick={() => setIsOpenMobileMenu(!isOpenMobileMenu)}
      >
        <MenuIcon />
        {label}
      </button>
      {isOpenMobileMenu && (
        <MobileMenu toggleMenu={() => setIsOpenMobileMenu(!isOpenMobileMenu)} />
      )}
    </div>
  );
};

export default Header;
