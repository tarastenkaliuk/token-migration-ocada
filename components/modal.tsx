"use client";

import React, { MouseEventHandler } from "react";
import { XIcon } from "@/components/ui/icon";
import { useConnect } from "wagmi";

interface ModalProps {
  modalStatus: boolean;
  onClickCloseFunc: MouseEventHandler<HTMLButtonElement>;
}

const Modal: React.FC<ModalProps> = ({ modalStatus, onClickCloseFunc }) => {
  const { connectors, connect } = useConnect();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{ display: modalStatus ? "flex" : "none" }}
    >
      <div className="bg-[#fff2e1] rounded-lg min-w-[440px] p-6 text-black relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-semibold flex  w-full justify-center mt-4">
            Connect a wallet on Ethereum to continue
          </h2>
          <button
            className="text-white absolute top-3 right-3 text-xs"
            style={{ width: "initial" }}
            onClick={onClickCloseFunc}
          >
            <XIcon className="w-2 h-2" />
          </button>
        </div>
        <div className="space-y-4">
          {connectors.map(
            (connector: any) =>
              (connector.id == "io.metamask" ||
                connector.id == "walletConnect") && (
                <button
                  key={connector.uid}
                  className="flex items-center justify-between w-full px-4 py-2 bg-[#212121] rounded-md border"
                  style={{ border: "1px solid #000" }}
                  onClick={() => connect({ connector })}
                >
                  <span className="flex items-center">{connector.name}</span>
                </button>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
