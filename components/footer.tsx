"use client";
import Image from "next/image";
import Link from "next/link";
import { OcadaLogoFull } from "@/components/ui/icon";
import { FaTelegramPlane } from "react-icons/fa";
import { LiaGlobeSolid } from "react-icons/lia";
import { RiTwitterXFill } from "react-icons/ri";
import { FaMedium } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="absolute inset-x-0 bottom-0 w-full z-[5000] bg-[#fffbf1] flex items-center content-center py-3">
      <div className="container mx-auto px-4">
        <nav className="flex w-full items-center justify-between text-xs lg:text-sm">
          <span>© {new Date().getFullYear()} Ocada. All rights reserved.</span>
          <ul className="hidden lg:flex justify-between items-center ml-10 gap-8 font-medium font-sans [&>li]:pt-2 text-sm">
            <li className="">
              <a
                href="https://t.me/Ocada_AI"
                className="flex items-center gap-1"
              >
                <span className="flex items-center justify-center">
                  {" "}
                  <FaTelegramPlane />
                </span>{" "}
                Telegram{" "}
              </a>{" "}
            </li>
            <li className="">
              <a
                href="https://x.com/ocada_ai"
                className="flex items-center gap-1"
              >
                <span className="flex items-center justify-center">
                  {" "}
                  <RiTwitterXFill />
                </span>{" "}
                Twitter{" "}
              </a>{" "}
            </li>
            <li className="">
              <a
                href="https://medium.com/bird-money"
                className="flex items-center gap-1"
              >
                <span className="flex items-center justify-center">
                  {" "}
                  <FaMedium />
                </span>{" "}
                medium{" "}
              </a>{" "}
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
