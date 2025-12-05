import { Button } from "@/components/ui/button";
import { useGetBalances } from "@/hooks/user/use-get-balances";
import BalancesForm from "../balances-form";
import { useGasPrice } from "wagmi";
import { allocateGasCost, transferGasCost } from "@/constants";
import { useYcAccount } from "@/provider/yc-account-provider";

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
    const { account, isSuccess } = useYcAccount();
    const usdcBalance = account?.totalUsdc ?? 0;
    const ethBalance = account?.eth ?? 0;

    return (
        <div className="max-w-[600px] mx-auto">
            <h2 className="mb-6">Withdraw</h2>

            <BalancesForm usdcBalance={usdcBalance ?? 0}
                ethBalance={ethBalance ?? 0}
                gasCosts={0}
                disabled={!isSuccess}
                usdcAmount={usdcAmount}
                setUsdcAmount={setUsdcAmount}
                ethAmount={ethAmount}
                setEthAmount={setEthAmount} />
            <Button className="w-full mb-2" disabled={usdcAmount === 0 && ethAmount === 0} onClick={() => setStep(2)}>Preview withdraw</Button>
        </div>
    )
}

export default Step1