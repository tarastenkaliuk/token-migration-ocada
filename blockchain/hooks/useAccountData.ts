import { useCallback, useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import { useChainId } from "wagmi";

import { useEthersSigner } from '@/lib/ethers'
import book from '../addressBook';
import useNetwork from './useNetwork';
import useContracts from './useContracts';
import { updateIntervalTime } from '../config';

interface AccountData {
  allowance: string
  balance: string
}

const useAccountData = () => {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const network = useNetwork();
  const signer = useEthersSigner();
  const { birdToken } = useContracts();
  const chainId = useChainId();

  let mainNetworkId = 1, sepoliaNetworkId = 11155111;
  
  const fetchAccountData = useCallback(async () => {
    if(chainId == mainNetworkId || chainId == sepoliaNetworkId) {
      try {
        if (signer && birdToken) {
          const allowance = await birdToken.allowance(signer.address, book[network].tokenMigration);
  
          const balance = await birdToken.balanceOf(signer.address);
          const formatted = ethers.formatEther(balance).toString();
  
          setAccountData({
            allowance, 
            balance: formatted
          })
        }
      } catch (error) {
        console.error('Error while fetching account details:', error);
      }
    }
  }, [birdToken, chainId, network, signer])

  useEffect(() => {
    fetchAccountData();
    let updateInterval = setInterval(fetchAccountData, updateIntervalTime);
    return () => clearInterval(updateInterval);
  }, [fetchAccountData]);

  return accountData;
}

export default useAccountData;