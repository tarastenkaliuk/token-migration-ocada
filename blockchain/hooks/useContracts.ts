import { useEffect, useState } from 'react';
import { Contract, ethers } from 'ethers';
import { useEthersSigner } from '@/lib/ethers'
import useNetwork from './useNetwork';
import book from '../addressBook';

import BirdToken from '../abis/BirdToken.json';
import BirdMigration from '../abis/BirdMigration.json';

interface ContractList {
  birdToken: Contract | undefined
  tokenMigration: Contract | undefined
}

const useContracts = () => {
  const [contracts, setContracts] = useState<ContractList>({
    birdToken: undefined,
    tokenMigration: undefined
  });
  const network = useNetwork();
  const signer = useEthersSigner();

  useEffect(() => {
    if (signer && book[network].birdToken) {
      const birdToken = new ethers.Contract(book[network].birdToken, BirdToken, signer);
      const tokenMigration = new ethers.Contract(book[network].tokenMigration, BirdMigration, signer);
      setContracts({
        birdToken,
        tokenMigration
      });
    }
  }, [network, signer])

  return contracts;
}

export default useContracts;