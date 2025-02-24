import React, {
  useState,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import { State, useAccount, useChains, useChainId } from "wagmi";
import { ethers } from "ethers";
import useAccountData from "@/blockchain/hooks/useAccountData";
import useBscAccountData from "@/blockchain/hooks/useBscAccountData";
import useContracts from "@/blockchain/hooks/useContracts";
import useBscContracts from "@/blockchain/hooks/useBscContracts";
import useNetwork from "@/blockchain/hooks/useNetwork";
import useBscNetwork from "@/blockchain/hooks/useBscNetwork";
import book from "@/blockchain/addressBook";
import bscBook from "@/blockchain/bscAddressBook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Audio } from "react-loader-spinner";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/loader.module.scss";

interface SwapBoxProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const SwapBox: React.FC<SwapBoxProps> = ({ isLoading, setIsLoading }) => {
  const accountData = useAccountData();
  const bscAccountData = useBscAccountData();
  const network = useNetwork();
  const bscNetwork = useBscNetwork();
  const { isConnected, address } = useAccount();
  const [amount, setAmount] = useState(0);
  const [ethAddr, setEthAddr] = useState("");
  const [solanaAddr, setSolanaAddr] = useState("");
  const { birdToken, tokenMigration } = useContracts();
  const { bscBirdToken, bscTokenMigration } = useBscContracts();
  const [workingProcess, setWorkingProcess] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [networkName, setNetworkName] = useState("eth");
  const wallet = useWallet();
  const chainId = useChainId();

  useEffect(()=>{
    if(chainId == 1 || chainId == 11155111 ) {
      setNetworkName('eth');
    } else {
      setNetworkName('bsc');
    }
  }, [chainId])

  useEffect(() => {
    if (wallet.connected && !solanaAddr && wallet.publicKey) {
      let address = wallet.publicKey.toBase58();
      setSolanaAddr(address);
    } else if (!wallet.connected) {
      setSolanaAddr("");
    }
  }, [solanaAddr, wallet, wallet.publicKey]);

  const handleApprove = useCallback(async () => {
    setIsLoading(true);
    try {
      if (network && birdToken) {
        const maxApproval = ethers.MaxUint256;
        const tx = await birdToken.approve(
          book[network].tokenMigration,
          maxApproval
        );
        await tx.wait();
        setIsLoading(false);
        setWorkingProcess("");
      }
    } catch (error) {
      setIsLoading(false);
      setWorkingProcess("");
      console.error("Error while approving", error);
    }
  }, [birdToken, network, setIsLoading]);

  const handleBscApprove = useCallback(async () => {
    setIsLoading(true);
    try {
      if (bscNetwork && bscBirdToken) {
        const maxApproval = ethers.MaxUint256;
        const tx = await bscBirdToken.approve(
          bscBook[bscNetwork].tokenMigration,
          maxApproval
        );
        await tx.wait();
        setIsLoading(false);
        setWorkingProcess("");
      }
    } catch (error) {
      setIsLoading(false);
      setWorkingProcess("");
      console.error("Error while approving", error);
    }
  }, [bscBirdToken, bscNetwork, setIsLoading]);

  const handleSwap = useCallback(async () => {
    setIsLoading(true);
    try {
      if (network && tokenMigration) {
        setWorkingProcess("Sending bird tokens to team wallet.....");
        const tx = await tokenMigration.migrate(
          ethers.parseEther(amount.toString()),
          solanaAddr
        );
        const txRex = await tx.wait();
        setWorkingProcess(
          "Sending new ocada tokens to your phantom wallet....."
        );
        const data = JSON.stringify({ hash: txRex.hash, type: 'eth' });
        const res = await fetch("/api/swap", {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const finalData = await res.json();
        setTransactionHash(finalData.message);
        console.log(`TX MESSAGE: ${finalData.message}`)
        setIsLoading(false);
        setWorkingProcess("");

        if (res.status == 200) {
          toast.success(`Tokens successfully bridged`);
        } else {
          toast.error(finalData.message);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setWorkingProcess("");
      console.error("Error sending tokens:", error);
    }
  }, [setIsLoading, network, tokenMigration, amount, solanaAddr]);

  const handleBscSwap = useCallback(async () => {
    setIsLoading(true);
    try {
      if (bscNetwork && bscTokenMigration) {
        setWorkingProcess("Sending bird tokens to team wallet.....");
        const tx = await bscTokenMigration.migrate(
          ethers.parseEther(amount.toString()),
          solanaAddr
        );
        const txRex = await tx.wait();
        console.log(`HASH IS HERE: ${txRex.hash}`)
        // setTransactionHash(txRex.hash);
        setWorkingProcess(
          "Sending new ocada tokens to your phantom wallet....."
        );
        const data = JSON.stringify({ hash: txRex.hash, type: 'bsc' });
        const res = await fetch("/api/swap", {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const finalData = await res.json();
        console.log(`Final data: ${finalData}`)

        setTransactionHash(finalData.message);
        console.log(`TX MESSAGE: ${finalData.message}`)
        setIsLoading(false);
        setWorkingProcess("");

        if (res.status == 200) {
          toast.success(`Tokens successfully bridged`);
        } else {
          toast.error(finalData.message);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setWorkingProcess("");
      console.error("Error sending tokens:", error);
    }
  }, [setIsLoading, bscNetwork, bscTokenMigration, amount, solanaAddr]);

  const handleAmountChange = (e: any) => {
    let inputValue = e.target.value;
    const parsedValue = parseFloat(inputValue);
    if (isNaN(parsedValue)) {
        setAmount(0);
        return;
    }

    const formattedValue = parsedValue.toFixed(3);
    setAmount(Number(formattedValue));

  };

  return networkName && networkName == 'eth' && accountData
          ? 
          (
            <div>
              {accountData.balance && (
                <div className="mb-2">
                  <label
                    className="text-sm font-medium font-sans flex"
                    htmlFor="amount"
                  >
                    Bird Balance: {accountData.balance}
                  </label>
                </div>
              )}
              <div className="mb-2">
                <Input
                  className="border-[1px] border-[#eaeaee] rounded-md p-2 mr-2 mb-8 m-auto w-full"
                  placeholder="input amount"
                  id="amount"
                  value={amount}
                  type="number"
                  pattern="^\d*(\.\d{0,2})?$"
                  onChange={handleAmountChange}
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-center">
                {isLoading ? (
                  <Button className="bg-purple-600 text-white px-6 py-3 rounded-md">
                    Loading ...
                  </Button>
                ) : BigInt(accountData.allowance) == ethers.MaxUint256 ? (
                  <Button
                    className="bg-purple-600 text-white px-6 py-3 rounded-md"
                    onClick={handleSwap}
                    disabled={!solanaAddr || !address}
                  >
                    Swap
                  </Button>
                ) : (
                  <Button
                    className="text-white px-6 py-3 rounded-md"
                    style={{ background: "#000 !important" }}
                    onClick={handleApprove}
                  >
                    Approve
                  </Button>
                )}
              </div>
              {transactionHash && (
                <div className="text-center">
                  <h2>
                    Transaction Successfully Confirmed! 🎉 View on explorer:{" "}
                    <a
                      href={`https://solscan.io/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                    >
                      Solan Explorer
                    </a>
                  </h2>
                </div>
              )}
              <div className="text-center">
                {isLoading && workingProcess}
                {/* <p>transaction hash will appear here after the bridging has been succesful: </p> */}
              </div>
            </div>
          ) 
          :
          networkName == 'bsc' && bscAccountData ?
            (
              <div>
                {bscAccountData.balance && (
                  <div className="mb-2">
                    <label
                      className="text-sm font-medium font-sans flex"
                      htmlFor="amount"
                    >
                      Bird Balance: {bscAccountData.balance}
                    </label>
                  </div>
                )}
                <div className="mb-2">
                  <Input
                    className="border-[1px] border-[#eaeaee] rounded-md p-2 mr-2 mb-8 m-auto w-full"
                    placeholder="input amount"
                    id="amount"
                    value={amount}
                    type="number"
                    onChange={handleAmountChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-center">
                  {isLoading ? (
                    <Button className="bg-purple-600 text-white px-6 py-3 rounded-md">
                      Loading ...
                    </Button>
                  ) : BigInt(bscAccountData.allowance) == ethers.MaxUint256 ? (
                    <Button
                      className="bg-purple-600 text-white px-6 py-3 rounded-md"
                      onClick={handleBscSwap}
                      disabled={!solanaAddr || !address}
                    >
                      Swap
                    </Button>
                  ) : (
                    <Button
                      className="text-white px-6 py-3 rounded-md"
                      style={{ background: "#000 !important" }}
                      onClick={handleBscApprove}
                    >
                      Approve
                    </Button>
                  )}
                </div>
                {transactionHash && (
                  <div className="text-center">
                    <h2>
                      Transaction Successfully Confirmed! 🎉 View on explorer:{" "}
                      <a
                        href={`https://solscan.io/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      >
                        Solan Explorer
                      </a>
                    </h2>
                  </div>
                )}
                <div className="text-center">
                  {isLoading && workingProcess}
                  {/* <p>transaction hash will appear here after the bridging has been succesful: </p> */}
                </div>
              </div>
            )
            :
            (
              <div className="mb-6 flex justify-center">
                <span className={`${styles["c_loader"]}`}></span>
              </div>
            );
};

export default SwapBox;
