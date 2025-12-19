import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme({
              accentColor: 'hsl(25, 95%, 53%)',
              accentColorForeground: 'white',
              borderRadius: 'medium',
            }),
            darkMode: darkTheme({
              accentColor: 'hsl(25, 95%, 53%)',
              accentColorForeground: 'white',
              borderRadius: 'medium',
            }),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
