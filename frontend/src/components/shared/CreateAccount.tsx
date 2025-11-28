import { useState } from "react"
import Step1 from "./CreateAccount/Step1";
import Step2 from "./CreateAccount/Step2";
import Step3 from "./CreateAccount/Step3";
import Loading from "./Loading";
import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { useReadContract } from "wagmi";
import { useGetStrategy } from "@/hooks/strategy/useGetStrategy";

const CreateAccount = ({
    accountRefetch
} : {
    accountRefetch: () => void
}) => {
    const [ step, setStep ] = useState(1);
    const [ usdcAmount, setUsdcAmount ] = useState<number|null>(null);
    const [ ethAmount, setEthAmount ] = useState<number|null>(null);

    const { data: strategyAddress, isLoading: strategiesIsLoading } = useReadContract({
            address: contractAddress,
            abi: contractABI,
            functionName: "strategies",
            args: [ 0 ]
    });

    const { data: strategy, isLoading: strategyIsLoading } = useGetStrategy(strategyAddress);

    return (
        <>
            {strategiesIsLoading || strategyIsLoading ?
                <Loading title="Loading data..." />
            :
                <>
                    {step === 1 && <Step1 setStep={setStep} strategy={strategy} />}
                    {step === 2 && <Step2 setStep={setStep} strategy={strategy} usdcAmount={usdcAmount} setUsdcAmount={setUsdcAmount} ethAmount={ethAmount} setEthAmount={setEthAmount} />}
                    {step === 3 && <Step3 setStep={setStep} strategy={strategy} usdcAmount={usdcAmount} ethAmount={ethAmount} accountRefetch={accountRefetch} />}
                </>
            }
        </>
    )
}

export default CreateAccount