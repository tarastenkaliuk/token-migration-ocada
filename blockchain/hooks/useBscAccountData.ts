import { useCallback, useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import { useChainId } from "wagmi";

import { useEthersSigner } from '@/lib/ethers'
import bscBook from '../bscAddressBook';
import useBscNetwork from './useBscNetwork';
import useBscContracts from './useBscContracts';
import { updateIntervalTime } from '../config';

interface BscAccountData {
  allowance: string
  balance: string
}

const useBscAccountData = () => {
  const [bscAccountData, setBscAccountData] = useState<BscAccountData | null>(null);
  const bscNetwork = useBscNetwork();
  const signer = useEthersSigner({ chainId: 56 });
  const { bscBirdToken } = useBscContracts();
  const chainId = useChainId();

  let bscNetworkId = 56, bscTestNetworkId = 97;

  const fetchAccountData = useCallback(async () => {
    if(chainId == bscNetworkId || chainId == bscTestNetworkId) {
      try {
        if (signer && bscBirdToken) {
          const allowance = await bscBirdToken.allowance(signer.address, bscBook[bscNetwork].tokenMigration);
          const balance = await bscBirdToken.balanceOf(signer.address);
          const formatted = ethers.formatEther(balance).toString();
          setBscAccountData({
            allowance,
            balance: formatted
          })
        }
      } catch (error) {
        console.error('Error while fetching account details:', error);
      }
    }
  }, [bscBirdToken, bscNetwork, chainId, signer])

  useEffect(() => {
    fetchAccountData();
    let updateInterval = setInterval(fetchAccountData, updateIntervalTime);
    return () => clearInterval(updateInterval);
  }, [fetchAccountData]);

  return bscAccountData;
}

export default useBscAccountData;