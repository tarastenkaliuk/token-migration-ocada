import { Network } from '../type';

const useNetwork = () => {
  const network = (process.env.NEXT_PUBLIC_CHAIN || 'mainnet') as Network;
  return network;
}

export default useNetwork;