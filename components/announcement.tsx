"use client";
import Image from "next/image";
import Link from "next/link";
import { BiSolidLock } from "react-icons/bi";
// import styles from "../../styles/nav.module.scss";

const Announcement = () => {
  return (
    <header className="absolute inset-x-0 h-auto lg:h-12 w-full z-[5000] bg-[#fee9ce] flex items-center content-center">
      <div className="container mx-auto px-4">
        <p className="font-sans font-medium text-xs lg:text-sm text-center flex flex-col lg:flex-row items-center justify-center">
          <span className="font-bold inline-flex items-center gap-2 my-2 lg:my-0 lg:gap-1">
            {" "}
            <span>
              {" "}
              <BiSolidLock />
            </span>
            Security Confirmation{"  "}
          </span>
          - Confirm you are at bridge.ocada.ai by typing the address into your
          browser and confirming the validity of the SSL certificate.
        </p>
      </div>
    </header>
  );
};

export default Announcement;
