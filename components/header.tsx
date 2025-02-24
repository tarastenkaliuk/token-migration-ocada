"use client";
import Image from "next/image";
import Link from "next/link";
import { BiSolidLock } from "react-icons/bi";
import { OcadaLogoFull } from "@/components/ui/icon";

const Header = () => {
  return (
    <header className="absolute inset-x-0 top-20 md:top-12 lg:top-12 w-full z-[5000] bg-[#fffbf1] flex items-center content-center py-3">
      <div className="container mx-auto px-4">
        <nav className="flex w-full items-center justify-between">
          <Link href="/">
            <OcadaLogoFull className="w-[80%]" />
          </Link>
          <ul className="hidden lg:flex justify-between items-center ml-10 gap-8 font-medium font-sans [&>li]:pt-2 text-sm">
            <li>
              <a href="https://ocada.ai/"> Home </a>
            </li>
            <li>
              {" "}
              <a href="https://ocada.gitbook.io/docs" className="text-sm">
                Read Docs
              </a>
            </li>
            <li>
              {" "}
              <a href="/files/OCADA-Litepaper-v01-B.pdf" className="">
                Litepaper
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
