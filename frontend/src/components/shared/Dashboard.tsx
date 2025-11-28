"use client"

import CustomConnectButton from "@/components/shared/RainbowKit/CustomConnectButton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAddress, readableNumber } from "@/utils"
import { useAccount } from "wagmi"
import { CopyCheck, CopyIcon, Wallet } from "lucide-react"
import { ButtonGroup, ButtonGroupText } from "../ui/button-group"
import { Button } from "../ui/button"
import { useState } from "react"
import { TokenETH, TokenUSDC } from "@web3icons/react"
import { useGetAccount } from "@/hooks/account/useGetAccount"
import Loading from "./Loading"
import { useGetStrategy } from "@/hooks/strategy/useGetStrategy"
import Vault from "./Strategy/Vault"

const Dashboard = ({
    accountAddress
} : {
    accountAddress?: string
}) => {
    const { isConnected } = useAccount();
    const [ copyDone, setCopyDone ] = useState(false);

    const { data: account, isLoading: accountIsLoading, isSuccess: accountIsSuccess } = useGetAccount(accountAddress);
    const { data: strategy, isLoading: strategyIsLoading, isSuccess: strategyIsSuccess } = useGetStrategy(account.strategy);

    let currentVaultIndex = null;
    if (accountIsSuccess && strategyIsSuccess) {
        for(let i = 0; strategy.vaults.length; i++) {
            if (strategy.vaults[i].address === account.currentVault) {
                currentVaultIndex = i;
                break;
            }
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(accountAddress as string);
            setCopyDone(true);
            setTimeout(() => {
                setCopyDone(false);
            }, 500)
        } catch (err) {
        }
    };

    return (
        <>
            {accountIsLoading && strategyIsLoading && isConnected ?
                <Loading title="Loading data..." />
            :
                <div className="flex flex-cols justify-center">
                    <div className="w-full">

                        {accountAddress && 
                            <ButtonGroup className="mb-6">
                                <ButtonGroupText><Wallet />{formatAddress(accountAddress)}</ButtonGroupText>
                                <Button onClick={copyToClipboard}>{copyDone ? <CopyCheck /> : <CopyIcon />}</Button>
                            </ButtonGroup>
                        }

                        <div className="md:flex justify-between md:gap-6 mb-16">
                            <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                                <CardHeader className="p-0">
                                    <CardDescription>
                                        USDC
                                    </CardDescription>
                                    <div className="mt-2 text-3xl font-medium text-right">
                                        {readableNumber(account.usdc, 6)} <TokenUSDC variant="mono" size={40} className="inline -mt-1" />
                                    </div>
                                </CardHeader>
                            </Card>
                            <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                                <CardHeader className="p-0">
                                    <CardDescription>
                                        ETH
                                    </CardDescription>
                                    <div className="mt-2 text-3xl font-medium text-right">
                                        {readableNumber(account.eth, 18)} <TokenETH variant="mono" size={40} className="inline -mt-1" />
                                    </div>
                                </CardHeader>
                            </Card>
                            <Card className="w-full rounded-lg p-8">
                                <CardHeader className="p-0">
                                    <CardDescription>
                                        YCT
                                    </CardDescription>
                                    <div className="mt-2 text-3xl font-medium text-right">
                                        {readableNumber(account.yct, 18)}
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                        
                        { isConnected &&
                            <Card className="w-full rounded-lg p-8 mb-16">
                                <CardHeader className="p-0">
                                    <CardTitle>
                                        <h2>Current strategy: {strategy.name}</h2>
                                    </CardTitle>
                                    <CardDescription className="flex gap-8 text-muted-foreground text-xs">
                                        <div>
                                            Net APY<br />
                                            <span className="text-lg font-medium text-foreground">{currentVaultIndex ? readableNumber(strategy.vaults[currentVaultIndex]?.netAPY, 4) : 0}%</span>
                                        </div>
                                        <div>
                                            TVL<br />
                                            <span className="text-lg font-medium text-foreground">${currentVaultIndex ? readableNumber(strategy.vaults[currentVaultIndex]?.tvl, 6) : 0}</span>
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="px-0 text-muted-foreground text-xs">
                                    <h2 className="mb-3 text-foreground">Morpho Vaults Used</h2>
                                    <div className="2xl:flex flex-wrap gap-2 gap-y-2">
                                        {strategy.vaults.map((vault, index) => <Vault className="mb-2 2xl:mb-0 basis-[calc(50%-0.5rem)]" key={vault.address} vault={vault} selected={currentVaultIndex === index} />)}
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t text-muted-foreground px-0 text-sm">
                                    Low-risk, stable yield strategy using Morpho Blue vaults.
                                </CardFooter>
                            </Card>
                        }
                        
                        <Card className="w-full rounded-lg p-8">
                            <CardHeader className="p-0">
                                <CardTitle>
                                    <h2>Agent Activity</h2>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                { isConnected ?
                                    <>
                                        No activity yet. Deposit USDC to start receiving simulations and yield events.
                                    </>
                                :
                                    <>
                                        <div className="text-center text-muted-foreground">
                                            <div className="mb-6">
                                                No activity yet. Connect your wallet to view your simulations, reallocations, and yield events.
                                            </div>
                                            <CustomConnectButton variant="outline" />
                                        </div>
                                    </>
                                }
                            </CardContent>
                        </Card>
                    </div>
                </div>
            }
        </>
    )
}

export default Dashboard