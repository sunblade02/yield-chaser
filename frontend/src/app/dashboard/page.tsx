"use client"

import Activity from "@/components/shared/dashboard/activity";
import Loading from "@/components/shared/loading";
import Vault from "@/components/shared/strategy/vault";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { explorerAddressURI } from "@/constants";
import { useGetStrategy } from "@/hooks/strategy/use-get-strategy";
import { useYcAccount } from "@/provider/yc-account-provider";
import { formatAddress, readableNumber } from "@/utils";
import { TokenETH, TokenUSDC } from "@web3icons/react";
import { CopyCheck, CopyIcon, ExternalLink, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, } from "react";
import { useAccount } from "wagmi";

const DashboardPage = () => {
    const router = useRouter();
    const { isConnected } = useAccount();
    const { account, hasAccount, isLoading } = useYcAccount();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (hasAccount === false) {
            router.push("/create-account");
        }
    }, [hasAccount]);


    const [ copyDone, setCopyDone ] = useState(false);

    const { data: strategy, isLoading: strategyIsLoading } = useGetStrategy(account?.strategy ?? undefined);

    let currentVaultIndex = null;
    if (account !== undefined && strategy !== undefined) {
        for(let i = 0; i < strategy.vaults.length; i++) {
            if (strategy.vaults[i].address === account.currentVault) {
                currentVaultIndex = i;
                break;
            }
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(account?.address ?? "");
            setCopyDone(true);
            setTimeout(() => {
                setCopyDone(false);
            }, 500)
        } catch (err) {
        }
    };

    const totalUsdc = (account?.capitalUsdc ?? 0) + (account?.earnedUsdc ?? 0);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            {(isLoading || strategyIsLoading) && isConnected ?
                <Loading title="Loading data..." />
            :
                <div className="flex flex-cols justify-center">
                    <div className="w-full">

                        {hasAccount &&
                            <div className="flex gap-4 mb-6">
                                <ButtonGroup>
                                    <ButtonGroupText><Wallet />{formatAddress(account?.address ?? "")}</ButtonGroupText>
                                    <Button variant="outline" asChild>
                                        <a href={explorerAddressURI + account?.address} target="_blank"><ExternalLink /></a>
                                    </Button>
                                    <Button variant="outline" onClick={copyToClipboard}>{copyDone ? <CopyCheck /> : <CopyIcon />}</Button>
                                </ButtonGroup>
                                    <Button>
                                        <Link href="/deposit">Deposit</Link>
                                    </Button>
                                    <Button>
                                        <Link href="/withdraw">Withdraw</Link>
                                    </Button>
                            </div>
                        }

                        {hasAccount === false && isConnected &&
                            <Button asChild className="mb-6">
                                <Link href="/create-account">Create an account</Link>
                            </Button>
                        }

                        <div className="md:flex justify-between md:gap-6 mb-6">
                            <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                                <CardHeader className="p-0">
                                    <CardDescription>
                                        Capital
                                    </CardDescription>
                                    <div className="mt-2 text-3xl font-medium text-right">
                                        <span title={readableNumber(account?.capitalUsdc, 6)}>{readableNumber(account?.capitalUsdc, 6, 2)}</span> <TokenUSDC variant="mono" size={40} className="inline -mt-1" />
                                    </div>
                                </CardHeader>
                            </Card>
                            <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                                <CardHeader className="p-0">
                                    <CardDescription>
                                        ETH
                                    </CardDescription>
                                    <div className="mt-2 text-3xl font-medium text-right">
                                        <span title={readableNumber(account?.eth, 18)}>{readableNumber(account?.eth, 18, 9)}</span> <TokenETH variant="mono" size={40} className="inline -mt-1" />
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                        <div className="md:flex justify-between md:gap-6 mb-16">
                            <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                                <CardHeader className="p-0">
                                    <CardDescription>
                                        Net earnings
                                    </CardDescription>
                                    <div className="mt-2 text-3xl font-medium text-right">
                                        <span title={readableNumber(account?.earnedUsdc, 6)}>+ {readableNumber(account?.earnedUsdc, 6, 2)}</span> <TokenUSDC variant="mono" size={40} className="inline -mt-1" />
                                    </div>
                                </CardHeader>
                            </Card>
                            <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                                <CardHeader className="p-0">
                                    <CardDescription>
                                        Total
                                    </CardDescription>
                                    <div className="mt-2 text-3xl font-medium text-right">
                                        <span title={readableNumber(totalUsdc, 6)}>{readableNumber(totalUsdc, 6, 2)}</span> <TokenUSDC variant="mono" size={40} className="inline -mt-1" />
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                        
                        {hasAccount &&
                            <Card className="w-full rounded-lg p-8 mb-16">
                                <CardHeader className="p-0">
                                    <CardTitle>
                                        <h2>Current strategy: {strategy.name}</h2>
                                    </CardTitle>
                                    <CardDescription className="flex gap-8 text-muted-foreground text-xs">
                                        <div>
                                            Net APY<br />
                                            <span className="text-lg font-medium text-foreground">{typeof currentVaultIndex === "number" ? readableNumber(strategy.vaults[currentVaultIndex]?.netAPY, 4) : 0}%</span>
                                        </div>
                                        <div>
                                            TVL<br />
                                            <span className="text-lg font-medium text-foreground">${typeof currentVaultIndex === "number" ? readableNumber(strategy.vaults[currentVaultIndex]?.tvl, 6) : 0}</span>
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
                        
                        <Activity />
                    </div>
                </div>
            }
        </>
    )
}

export default DashboardPage