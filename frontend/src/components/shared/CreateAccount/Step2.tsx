import { Button } from "@/components/ui/button";
import { approvalGasCost, createAccountGasCost } from "@/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StrategyType } from "@/types/StrategyType";
import Vault from "../Strategy/Vault";
import { readableNumber } from "@/utils";
import { useGetBalances } from "@/hooks/user/useGetBalances";
import { useGasPrice } from "wagmi";
import DepositForm from "../DepositForm";

const Step2 = ({
    setStep,
    strategy,
    usdcAmount,
    setUsdcAmount,
    ethAmount,
    setEthAmount
} : {
    setStep: (step: number) => void,
    strategy: StrategyType,
    usdcAmount: number,
    setUsdcAmount: (usdcAmount: number) => void,
    ethAmount: number,
    setEthAmount: (ethAmount: number) => void
}) => {
    const { usdcBalance, eth, isSuccess: getBalancesIsSuccess } = useGetBalances();

    const { data: gasPrice, isSuccess: gasPriceIsSuccess } = useGasPrice();

    let gasCosts = 0;
    if (gasPriceIsSuccess) {
        gasCosts = (approvalGasCost + createAccountGasCost) * Number(gasPrice);
    }

    return (
        <div className="max-w-[600px] mx-auto">
            <DepositForm usdcBalance={Number(usdcBalance ?? 0)}
                ethBalance={Number(eth?.value ?? 0)}
                gasCosts={gasCosts}
                disabled={!getBalancesIsSuccess}
                usdcAmount={usdcAmount}
                setUsdcAmount={setUsdcAmount}
                ethAmount={ethAmount}
                setEthAmount={setEthAmount} />
            <Button className="w-full mb-2" disabled={usdcAmount === null || ethAmount === null} onClick={() => setStep(3)}>Preview deposit</Button>
            <Button className="w-full mb-8" variant="outline" onClick={() => setStep(1)}>Cancel</Button>

            <Card className="rounded-lg p-8">
                <CardHeader className="p-0">
                    <CardTitle>
                        <h2>{strategy.name}</h2>
                    </CardTitle>
                    <CardDescription className="flex gap-4">
                        <div>
                            Net APY<br />
                            <span className="text-3xl font-weight-medium text-foreground">{typeof strategy.bestVaultIndex === "number" ? readableNumber(strategy.vaults[strategy.bestVaultIndex].netAPY, 4) : 0}%</span>
                        </div>
                        <div>
                            TVL<br />
                            <span className="text-3xl font-weight-medium text-foreground">${typeof strategy.bestVaultIndex === "number" ? readableNumber(strategy.vaults[strategy.bestVaultIndex].tvl, 6) : 0}</span>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="border-t px-0 flex-col pt-6">
                    <div className="text-muted-foreground text-sm mb-8">
                        Yield Chaser optimizes yield by monitoring two Morpho USDC vaults. The Agent continuously evaluates net APY (APY - gas - slippage) and only reallocates funds when the net benefit is positive.
                    </div>
                    <h2 className="mb-3">Morpho Vaults Used</h2>
                    <div className="flex flex-col gap-y-2">
                        {strategy.vaults.map((vault, index) => <Vault key={vault.address} vault={vault} selected={strategy.bestVaultIndex === index} />)}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Step2