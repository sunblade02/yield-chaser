import { Button } from "@/components/ui/button";
import { useGetBalances } from "@/hooks/user/use-get-balances";
import BalancesForm from "../balances-form";
import { useGasPrice } from "wagmi";
import { allocateGasCost, transferGasCost } from "@/constants";

const Step1 = ({
    setStep,
    usdcAmount,
    setUsdcAmount,
    ethAmount,
    setEthAmount
} : {
    setStep: (step: number) => void,
    usdcAmount: number,
    setUsdcAmount: (usdcAmount: number) => void,
    ethAmount: number,
    setEthAmount: (ethAmount: number) => void
}) => {
    const { usdcBalance, ethBalance, isSuccess } = useGetBalances();

    const { data: gasPrice, isSuccess: gasPriceIsSuccess } = useGasPrice();
    
    let gasCosts = 0;
    if (gasPriceIsSuccess) {
        gasCosts = (transferGasCost + allocateGasCost) * Number(gasPrice);
    }

    return (
        <div className="max-w-[600px] mx-auto">
            <h2 className="mb-6">Deposit</h2>

            <BalancesForm usdcBalance={usdcBalance ?? 0}
                ethBalance={ethBalance ?? 0}
                gasCosts={gasCosts}
                disabled={!isSuccess}
                usdcAmount={usdcAmount}
                setUsdcAmount={setUsdcAmount}
                ethAmount={ethAmount}
                setEthAmount={setEthAmount} />
            <Button className="w-full mb-2" disabled={usdcAmount === 0 && ethAmount === 0} onClick={() => setStep(2)}>Preview deposit</Button>
        </div>
    )
}

export default Step1