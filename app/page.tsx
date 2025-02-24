"use client";

import React, { useEffect, useState, useMemo } from "react";
import { BookIcon, NetworkIcon, FileWarningIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useAccount, useChainId } from "wagmi";
import { Button, buttonVariants } from "@/components/ui/button";
import { Account } from "@/components/account";
import { useEthersSigner } from "@/lib/ethers";
import { cn } from "@/lib/utils";
import Modal from "@/components/modal";
import SwapBox from "@/components/swapbox";
import { BirdLogo } from "@/components/ui/icon";
import { OcadaLogo, OcadaLogoSmall } from "@/components/ui/icon";
import { TbArrowsExchange2 } from "react-icons/tb";
import { RiExchangeFundsLine } from "react-icons/ri";
import { SiSolana } from "react-icons/si";
import { SiEthereum, SiBinance } from "react-icons/si";
import { TbPlugConnected } from "react-icons/tb";
import { BookIllustration } from "@/components/ui/icon";
import styles from "@/styles/main.module.scss";
import Switch from "react-switch";

export default function Page() {
  const signer = useEthersSigner();
  const { isConnected, address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEther, setIsEther] = useState(true);
  const [networkName, setNetworkName] = useState("");
  const chainId = useChainId();
  
  useEffect(()=>{
    if(chainId == 1 || chainId == 11155111 ) {
      setNetworkName('eth');
      setIsEther(true)
    } else {
      setNetworkName('bsc');
      setIsEther(false)
    }
  }, [chainId])

  const handleSwitch = () => {
    // setIsEther(!isEther);
  };

  const WalletMultiButtonDynamic = useMemo(() => {
    return dynamic(
      async () => {
        const { WalletMultiButton } = await import("@solana/wallet-adapter-react-ui");
        return WalletMultiButton;
      },
      { ssr: false }
    );
  }, []);

  useEffect(() => {
    if (isConnected) {
      setIsModalOpen(false);
    }
  }, [signer, address, isConnected]);

  const onClickModalClose = () => setIsModalOpen(false);

  return (
    <section
      className={`${styles["c-header"]} relative w-full h-full flex items-center lg:before:flex lg:before:inset-y-0 lg:before:end-0 lg:before:absolute lg:before:w-[calc(50%-20px)] lg:before:z-[0] lg:before:bg-[radial-gradient(#946a0070_1px,#fffbf1_1px)] lg:before:bg-[length:20px_20px] overflow-y-scroll`}
    >
      <img
        src="/images/background.jpg"
        alt="banner illustration"
        className="hidden lg:flex absolute inset-0 mix-blend-color-multiply z-[-1] object-cover h-full w-full opacity-90"
      />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 lg:grid-cols-16 place-items-center place-content-center gap-8">
          <div className="hidden lg:flex lg:col-start-1 lg:col-end-9 flex-col">
            <h1 className="text-[72px] leading-[1.08] font-semibold mb-4 font-rethink_sans">
              Bridge your
              <span className="inline-flex bg-white size-[48px] items-center justify-center rounded-full mx-2">
                <BirdLogo />
              </span>
              bird tokens to
              <span className="inline-flex bg-white size-[48px] items-center justify-center rounded-full mx-2">
                <OcadaLogo />
              </span>
              ocada on solana.
            </h1>
            <p className="text-[19px] mb-6 font-sans leading-normal max-w-[560px]">
              <span>Connect your ethereum and solana wallets</span> and select
              how much bird tokens you would like to transfer to the Solana
              network. For every 1 Bird token you bridge, you will receive 1000
              Ocada tokens on solana.
            </p>
          </div>
          <div className="col-start-1 col-end-[-1] lg:col-start-10 lg:col-end-[-1] flex relative">
            <div className="bg-white rounded-[28px] px-6 py-5 relative z-[500] mt-10 lg:mt-0 shadow-[0_12.6px_25.3px_-5.0px_#a8872912]">
              <h6 className="font-bold pb-2 bg-clip-text text-transparent bg-[linear-gradient(348deg,#c4432d_63%,#ff8e37)]">
                Ocada Bridge
              </h6>
              <div className="bg-[#fee9ce4f] p-4 rounded-xl mb-8">
                <div className="flex items-start">
                  {/* <BookIllustration /> */}
                  <p className="text-sm font-sans ml-2">
                    <span className="inline-flex mb-1 font-semibold font-sans">
                      {" "}
                      User Guide
                    </span>
                    <br />
                    We highly recommend reviewing the FAQ and bridge Guide
                    before continuing. View the guide at ocada.com.
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-xl mb-8 flex justify-center items-center space-x-2">
                <h2 className={`p-2 text-bg ${isEther ? styles['animate-twinkle'] : 'opacity-[.50]'}`}>
                  Ethereum
                </h2>
                <Switch 
                  onChange={handleSwitch} 
                  checked={!isEther} 
                  onColor="#fff8e4" 
                  offColor="#fff8e4" 
                  checkedIcon = {false} 
                  uncheckedIcon = {false} 
                  onHandleColor="#fff8e4"
                  offHandleColor="#fff8e4"
                  checkedHandleIcon={<OcadaLogoSmall />}
                  uncheckedHandleIcon={<OcadaLogoSmall />}
                />
                <h2 className={`p-2 text-bg ${!isEther ? styles['animate-twinkle'] : 'opacity-[.50]'}`}>
                  BSC
                </h2>
              </div>
              <div className="isolate">
                <div className="mb-3 flex relative flex-col p-4 border border-[#eaeaee] rounded-xl">
                  <h2 className="text-sm font-medium mb-2 font-sans flex items-center">
                    <span className="flex size-7 justify-center items-center rounded-full border border-[#eaeaee] mr-1">
                      {
                        chainId == 1 || chainId == 11155111 ? <SiEthereum /> : <SiBinance />
                      }
                    </span>
                    {
                      chainId == 1 || chainId == 11155111 ? 'Ethereum Network' : 'BSC Network'
                    }
                  </h2>
                  {isConnected ? (
                    <Account isLoading={isLoading} />
                  ) : (
                    <div className="bg-transparent w-full border border-[#eaeaee] rounded-[8px]">
                      <Button
                        className="font-medium text-black h-12 px-4 py-2 rounded-md w-full"
                        onClick={() => setIsModalOpen(true)}
                      >
                        {/* <TbPlugConnected /> */}
                        Connect Ethereum Wallet
                      </Button>
                    </div>
                  )}
                  <div className="absolute left-[43%] bottom-[-24px] bg-white size-[52px] flex items-center justify-center rounded-full border border-[#eaeaee] z-[500]">
                    <RiExchangeFundsLine className="text-xl" />
                  </div>
                </div>
                <div className="mb-6 flex relative flex-col p-4 border border-[#eaeaee] rounded-xl">
                  <h2 className="text-sm font-medium mb-4 font-sans flex items-center">
                    <span className="flex size-7 justify-center items-center rounded-full border border-[#eaeaee] mr-1">
                      <SiSolana className="text-[10px]" />
                    </span>
                    Solana Network
                  </h2>
                  <div
                    style={{
                      backgroundColor: "transparent !important",
                      border: "1px solid #eaeaee",
                      display: "flex",
                      margin: "auto",
                      width: "100%",
                      borderRadius: "8px",
                    }}
                  >
                    <WalletMultiButtonDynamic
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "bg-type-alt-500 text-black hover:bg-type-alt-700 hover:text-black py-2 rounded-md w-full bg-transparent border-none"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {isConnected && (
                  <SwapBox isLoading={isLoading} setIsLoading={setIsLoading} />
                )}
              </div>
              <Modal
                modalStatus={isModalOpen}
                onClickCloseFunc={onClickModalClose}
              />
            </div>
            <div className="hidden lg:w-[94%] lg:absolute lg:flex lg:bottom-[-20px] lg:rounded-[24px] lg:bg-white lg:h-40 shadow-[0_12.6px_25.3px_-5.0px_#a8872914] lg:z-[8] lg:left-4" />
            <div className="hidden lg:w-[86%] lg:absolute lg:flex lg:bottom-[-40px] lg:rounded-[24px] lg:bg-white lg:h-40 lg:shadow-[0_12.6px_25.3px_-5.0px_#fff4d357] lg:z-[1] lg:left-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
