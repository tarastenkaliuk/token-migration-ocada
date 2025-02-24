import { http, createConfig } from 'wagmi'
import { base, mainnet, sepolia, optimism, bscTestnet, bsc } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

const projectId = '3fcc6bba6f1de962d911bb5b5c3dba68'

export const config = createConfig({
  chains: [
    sepolia, 
    mainnet,
    bscTestnet,
    bsc,
    base
  ],
  ssr: true, 
  connectors: [
    // walletConnect({ projectId }),
    metaMask(),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
    [base.id]: http(),
  },
})