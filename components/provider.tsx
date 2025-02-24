'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { useMemo } from 'react'
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../config'

export function Providers({ children, ...props }: ThemeProviderProps) {
  const wallets = useMemo(() => [new PhantomWalletAdapter(),], []);
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const queryClient = new QueryClient()
  
  return (
      <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}> 
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                <NextThemesProvider {...props}>
                  {children}
                </NextThemesProvider>
              </WalletModalProvider>
            </WalletProvider>
          </QueryClientProvider> 
        </WagmiProvider>
      </ConnectionProvider>
  );
}