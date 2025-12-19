import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export const WalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} variant="hero" size="sm">
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive" size="sm">
                    Wrong Network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    {chain.hasIcon && (
                      <div
                        className="w-4 h-4 rounded-full overflow-hidden mr-1"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-4 h-4"
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>

                  <Button onClick={openAccountModal} variant="glass" size="sm">
                    <div className="w-2 h-2 rounded-full bg-accent mr-2" />
                    {account.displayName}
                    {account.displayBalance && (
                      <span className="ml-2 text-muted-foreground hidden sm:inline">
                        ({account.displayBalance})
                      </span>
                    )}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
