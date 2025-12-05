import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import { TokenETH, TokenUSDC } from "@web3icons/react";
import { type BaseError } from "wagmi";
import TransactionResult from "../transaction-result";
import React, { useEffect, useState } from "react";
import Loading from "../loading";
import { readableNumber } from "@/utils";
import { useYcAccount } from "@/provider/yc-account-provider";
import { useWithdraw } from "@/hooks/account/use-withdraw";

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

    const { account, refetch } = useYcAccount();

    const { error: withdrawError, isLoading: withdrawIsLoading, isSuccess: withdrawIsSuccess, withdraw } = useWithdraw();

    const doWithdraw = () => {
        withdraw(account?.address ? account?.address : undefined, usdcAmount, ethAmount);
    };

    const hideTransactionResult = () => {
        setTransactionResult(null);
    };

    useEffect(() => {
        if (withdrawIsLoading) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [withdrawIsLoading]);

    useEffect(() => {
        if (withdrawIsSuccess) {
            refetch();
            setTransactionResult(<TransactionResult type="success" title="Withdrawal successful" buttonText="Go to dashboard" href="/dashboard" />);
        }
    }, [withdrawIsSuccess]);

    useEffect(() => {
        if (withdrawError) {
            setTransactionResult(<TransactionResult type="error" title="Withdrawal failed" description={(withdrawError as BaseError).shortMessage || withdrawError.message} onClick={hideTransactionResult} />);
        }
    }, [withdrawError]);

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
                            <h2 className="mb-6">Review withdrawal</h2>

                            <Card className="rounded-lg p-8 mb-6">
                                <CardHeader className="p-0">
                                    <CardDescription>
                                        Withdrawal amounts
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
                                Withdrawals from a vault are subject to a performance fee. As a result, the funds received may be slightly less than the amount shown.
                            </div>

                            <Button className="w-full mb-2" onClick={doWithdraw}>Withdraw</Button>
                            <Button className="w-full" variant="outline" onClick={() => setStep(1)}>Cancel</Button>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default Step2