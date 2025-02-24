import { BscNetwork } from '../bscType';

const useBscNetwork = () => {
  const bscNetwork = (process.env.NEXT_BSC_PUBLIC_CHAIN || 'bsc') as BscNetwork;
  return bscNetwork;
}

export default useBscNetwork;