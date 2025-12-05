import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import { TokenETH, TokenUSDC } from "@web3icons/react";
import { type BaseError, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import TransactionResult from "../transaction-result";
import React, { useEffect, useState } from "react";
import Loading from "../loading";
import { readableNumber } from "@/utils";
import { useTransfer } from "@/hooks/usdc/use-transfer";
import { useAllocate } from "@/hooks/account/use-allocate";
import { useYcAccount } from "@/provider/yc-account-provider";

const Step2 = ({
    setStep,
    usdcAmount,
    ethAmount
} : {
    setStep: (step: number) => void,
    usdcAmount: number,
    ethAmount: number,
}) => {
    const [ transactionResult, setTransactionResult ] = useState<React.ReactNode|null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ transferStep, setTransferStep ] = useState(true);

    const { account, refetch } = useYcAccount();

    const { error: transferError, isLoading: transferIsLoading, isSuccess: transferIsSuccess, transfer } = useTransfer();

    const doTransfer = () => {
        transfer(account?.address ? account?.address : undefined, usdcAmount);
    };

    const { error: allocateError, isLoading: allocateIsLoading, isSuccess: allocateIsSuccess, allocate } = useAllocate();

    const doAllocate = () => {
        allocate(account?.address ? account?.address : undefined, ethAmount);
    };

    const { error: sendTransactionError, data, isPending, sendTransaction } = useSendTransaction();
    const { isLoading, isSuccess: sendTransactionIsSuccess } = useWaitForTransactionReceipt({ hash: data });
    const sendTransactionIsLoading = isLoading || isPending;

    const doSendTransaction = () => {
        if (account?.address) {
            sendTransaction({ 
                to: account.address, 
                value: BigInt(ethAmount) 
            });
        }
    }

    const hideTransactionResult = () => {
        setTransactionResult(null);
    };

    useEffect(() => {
        if (transferIsLoading || allocateIsLoading || sendTransactionIsLoading) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [transferIsLoading, allocateIsLoading, sendTransactionIsLoading]);

    useEffect(() => {
        if (transferIsSuccess) {
            refetch();
            setTransactionResult(<TransactionResult type="success" title="USDC transfer successful" onClick={hideTransactionResult} />);
            setTransferStep(false);
        }
    }, [transferIsSuccess]);

    useEffect(() => {
        if (transferError) {
            setTransactionResult(<TransactionResult type="error" title="USDC transfer failed" description={(transferError as BaseError).shortMessage || transferError.message} onClick={hideTransactionResult} />);
        }
    }, [transferError]);

    useEffect(() => {
        if (allocateIsSuccess) {
            refetch();
            setTransactionResult(<TransactionResult type="success" title="USDC allocation successful" buttonText="Go to dashboard" href="/dashboard"  />);
        }
    }, [allocateIsSuccess]);

    useEffect(() => {
        if (allocateError) {
            setTransactionResult(<TransactionResult type="error" title="USDC allocation failed" description={(allocateError as BaseError).shortMessage || allocateError.message} onClick={hideTransactionResult} />);
        }
    }, [allocateError]);

    useEffect(() => {
        if (sendTransactionIsSuccess) {
            refetch();
            setTransactionResult(<TransactionResult type="success" title="ETH send successful" buttonText="Go to dashboard" href="/dashboard" />);
        }
    }, [sendTransactionIsSuccess]);

    useEffect(() => {
        if (sendTransactionError) {
            setTransactionResult(<TransactionResult type="error" title="ETH send failed" description={(sendTransactionError as BaseError).shortMessage || sendTransactionError.message} onClick={hideTransactionResult} />);
        }
    }, [sendTransactionError]);

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
                            </Card>

                            <div className="text-muted-foreground mb-8">
                                Yield Chaser only acts when net benefit is positive.
                            </div>

                            {usdcAmount > 0 && <Button className="w-full mb-2" onClick={doTransfer} disabled={!transferStep}>Transfer{transferStep ? ` ${readableNumber(usdcAmount, 6)} USDC to your account` : ""}</Button>}
                            {usdcAmount > 0 && <Button disabled={transferStep} className="w-full mb-2" onClick={doAllocate}>Allocate USDC{ ethAmount > 0 && " and send " + readableNumber(ethAmount, 18) + " ETH" }</Button>}
                            {usdcAmount === 0 && <Button className="w-full mb-2" onClick={doSendTransaction}>Send {readableNumber(ethAmount, 18)} ETH</Button>}
                            <Button className="w-full" variant="outline" onClick={() => setStep(1)}>Cancel</Button>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default Step2