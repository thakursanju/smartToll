import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'SmartToll',
  projectId: 'smarttoll-demo', // For demo purposes - in production, get from WalletConnect Cloud
  chains: [sepolia],
  ssr: false,
});
