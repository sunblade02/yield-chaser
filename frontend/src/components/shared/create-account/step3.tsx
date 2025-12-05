import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { contractAddress as registryContractAddress } from "@/constants/contracts/registry";
import { contractAddress as usdcContractAddress } from "@/constants/contracts/usdc";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { approvalGasCost, createAccountGasCost } from "@/constants";
import { StrategyType } from "@/types/strategy-type";
import { TokenETH, TokenUSDC } from "@web3icons/react";
import { type BaseError, useAccount, useGasPrice, useReadContract } from "wagmi";
import { useApprove } from "@/hooks/usdc/use-approve";
import TransactionResult from "../transaction-result";
import React, { useEffect, useState } from "react";
import { useCreateAccount } from "@/hooks/registry/use-create-account";
import Loading from "../loading";
import { readableNumber } from "@/utils";
import { contractABI as ierc20ContractABI } from "@/constants/contracts/ierc20";
import { useYcAccount } from "@/provider/yc-account-provider";

const Step3 = ({
    setStep,
    strategy,
    usdcAmount,
    ethAmount
} : {
    setStep: (step: number) => void,
    strategy: StrategyType,
    usdcAmount: number,
    ethAmount: number
}) => {
    const { address: userAddress } = useAccount();
    const { getAccountRefetch } = useYcAccount();
    const [ transactionResult, setTransactionResult ] = useState<React.ReactNode|null>(null);
    const [ loading, setLoading ] = useState(false);

    const {data: allowanceData, isSuccess: allowanceIsSuccess, refetch: allowanceRefetch} = useReadContract({
        address: usdcContractAddress,
        abi: ierc20ContractABI,
        functionName: "allowance",
        args: [ userAddress, registryContractAddress ],
        query: {
            enabled: !!userAddress
        }
    });

    const { data: gasPrice, isSuccess: gasPriceIsSuccess } = useGasPrice();

    let estimatedTransactionsCost = "";
    let appovalStep = true;
    if (gasPriceIsSuccess && allowanceIsSuccess) {
        let totalGasCost = createAccountGasCost;
        if (Number(allowanceData) < usdcAmount) {
            totalGasCost += approvalGasCost;
        } else {
            appovalStep = false;
        }
        estimatedTransactionsCost = readableNumber(totalGasCost * Number(gasPrice), 18);
    }

    const { error: approveError, isLoading: approveIsLoading, isSuccess: approveIsSuccess, approve } = useApprove();

    const doApprove = () => {
        approve(registryContractAddress, usdcAmount);
    };

    const { error: createAccountError, isLoading: createAccountIsLoading, isSuccess: createAccountIsSuccess, createAccount } = useCreateAccount();

    const doCreateAccount = () => {
        createAccount(strategy?.address ? strategy.address : undefined, usdcAmount, ethAmount);
    };

    let readableNetBenefit = "";
    let bestVaultName = "";
    if (strategy.bestVaultIndex) {
        bestVaultName = strategy.vaults[strategy.bestVaultIndex].name as string;
        const netBenefit = (usdcAmount / 10**6) * Number(strategy.vaults[strategy.bestVaultIndex].netAPY) / 10**4 * 0.01;
        readableNetBenefit = readableNumber(netBenefit, 2);
    }

    const hideTransactionResult = () => {
        setTransactionResult(null);
    };

    useEffect(() => {
        if (approveIsLoading || createAccountIsLoading) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [approveIsLoading, createAccountIsLoading]);

    useEffect(() => {
        if (approveIsSuccess) {
            setTransactionResult(<TransactionResult type="success" title="USDC approval successful" onClick={hideTransactionResult} />);
            allowanceRefetch();
        }
    }, [approveIsSuccess]);

    useEffect(() => {
        if (approveError) {
            setTransactionResult(<TransactionResult type="error" title="USDC approval failed" description={(approveError as BaseError).shortMessage || approveError.message} onClick={hideTransactionResult} />);
        }
    }, [approveError]);

    useEffect(() => {
        if (createAccountIsSuccess) {
            getAccountRefetch();
            setTransactionResult(<TransactionResult type="success" title="Account creation successful" buttonText="Go to dashboard" href="/dashboard" />);
        }
    }, [createAccountIsSuccess]);

    useEffect(() => {
        if (createAccountError) {
            setTransactionResult(<TransactionResult type="error" title="Account creation failed" description={(createAccountError as BaseError).shortMessage || createAccountError.message} onClick={hideTransactionResult} />);
        }
    }, [createAccountError]);

    return (
        <>
            {loading ?
                <Loading title="Processing your transaction..." description="Waiting for confirmation" />
            :
                <>
                    {transactionResult ?
                        transactionResult
                    :
                        <div className="max-w-[600px] mx-auto">
                            <h2 className="mb-6">Review deposit</h2>

                            <Card className="rounded-lg p-8 mb-6">
                                <CardHeader className="p-0">
                                    <CardDescription>
                                        Deposit amounts
                                    </CardDescription>
                                    <div className="mt-2 text-3xl font-medium">
                                        <TokenUSDC size={35} variant="mono" className="inline -mt-1" /> {readableNumber(usdcAmount, 6)} USDC
                                    </div>
                                    <div className="mt-2 text-3xl font-medium">
                                        <TokenETH size={35} variant="mono" className="inline -mt-1" /> {readableNumber(ethAmount, 18)} ETH
                                    </div>
                                </CardHeader>
                                <CardContent className="border-t px-0 flex flex-col pt-6 gap-y-4">
                                    <div className="flex justify-between">
                                        <div className="text-muted-foreground">
                                            Strategy
                                        </div>
                                        <div>
                                            {strategy.name}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-muted-foreground">
                                            Current selected vault
                                        </div>
                                        <div>
                                            {bestVaultName}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-muted-foreground">
                                            Net APY
                                        </div>
                                        <div>
                                            <Badge variant="secondary" className="rounded-md text-xs text-main bg-main-foreground">{strategy.bestVaultIndex ? readableNumber(strategy.vaults[strategy.bestVaultIndex].netAPY, 4) : 0}%</Badge>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-muted-foreground">
                                            Estimated gas cost
                                        </div>
                                        <div className="text-muted-foreground">
                                            {estimatedTransactionsCost} ETH
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-muted-foreground">
                                            Net benefit estimation
                                        </div>
                                        <div className="text-muted-foreground">
                                            +{readableNetBenefit} USDC
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="text-muted-foreground mb-8">
                                Yield Chaser only acts when net benefit is positive.
                            </div>

                            {usdcAmount !== null && usdcAmount > 0 && <Button className="w-full mb-2" onClick={doApprove} disabled={!appovalStep}>Approve{appovalStep ? ` ${readableNumber(usdcAmount, 6)} USDC for transfer` : ""}</Button>}
                            <Button disabled={appovalStep} className="w-full mb-2" onClick={doCreateAccount}>Create account</Button>
                            <Button className="w-full" variant="outline" onClick={() => setStep(2)}>Cancel</Button>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default Step3