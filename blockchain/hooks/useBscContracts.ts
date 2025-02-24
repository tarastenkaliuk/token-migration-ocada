import { useEffect, useState } from 'react';
import { Contract, ethers } from 'ethers';
import { useEthersSigner } from '@/lib/ethers'
import useBscNetwork from './useBscNetwork';
import bscBook from '../bscAddressBook';

import BscBirdToken from '../abis/BscBirdToken.json';
import BscBirdMigration from '../abis/BscBirdMigration.json';

interface ContractList {
  bscBirdToken: Contract | undefined
  bscTokenMigration: Contract | undefined
}

const useBscContracts = () => {
  const [contracts, setContracts] = useState<ContractList>({
    bscBirdToken: undefined,
    bscTokenMigration: undefined,
  });
  const bscNetwork = useBscNetwork();
  const signer = useEthersSigner();

  useEffect(() => {
    if (signer && bscBook[bscNetwork].birdToken) {
      const bscBirdToken = new ethers.Contract(bscBook[bscNetwork].birdToken, BscBirdToken, signer);
      const bscTokenMigration = new ethers.Contract(bscBook[bscNetwork].tokenMigration, BscBirdMigration, signer);
      setContracts({
        bscBirdToken,
        bscTokenMigration
      });
    }
  }, [bscNetwork, signer])

  return contracts;
}

export default useBscContracts;