import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '../../ui/button';
import { useAccount, useBalance } from 'wagmi';
import { contractAddress } from '@/constants/contracts/yct';
import { Badge } from '@/components/ui/badge';
import { readableNumber } from '@/utils';

const CustomConnectButton = ({
    variant
} : {
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
}) => {
    const { address } = useAccount();

    const { data: yct } = useBalance({
        address,
        token: contractAddress,
    })

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');
                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button variant={variant} onClick={openConnectModal}>
                                        Connect wallet
                                    </Button>
                                );
                            }
                            if (chain.unsupported) {
                                return (
                                    <Button variant="destructive" onClick={openChainModal}>
                                        Wrong network
                                    </Button>
                                );
                            }
                            return (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <Button variant="outline"
                                        onClick={openChainModal}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        style={{ width: 12, height: 12 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </Button>
                                    <Button variant="outline" onClick={openAccountModal}>
                                        {account.displayName}
                                        <Badge>{yct ? readableNumber(yct.value, yct.decimals) : 0} YCT</Badge>
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

export default CustomConnectButton;