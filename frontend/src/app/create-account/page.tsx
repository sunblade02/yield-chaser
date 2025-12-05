"use client"

import { useState } from "react"
import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { useReadContract } from "wagmi";
import { useGetStrategy } from "@/hooks/strategy/use-get-strategy";
import Loading from "@/components/shared/loading";
import Step1 from "@/components/shared/create-account/step1";
import Step2 from "@/components/shared/create-account/step2";
import Step3 from "@/components/shared/create-account/step3";

const CreateAccountPage = () => {
    const [ step, setStep ] = useState(1);
    const [ usdcAmount, setUsdcAmount ] = useState(0);
    const [ ethAmount, setEthAmount ] = useState(0);

    const { data: strategyAddress, isLoading: strategiesIsLoading } = useReadContract({
            address: contractAddress,
            abi: contractABI,
            functionName: "strategies",
            args: [ 0 ]
    });

    const { data: strategy, isLoading: strategyIsLoading } = useGetStrategy(strategyAddress ? strategyAddress as `0x${string}` : undefined);

    return (
        <>
            {strategiesIsLoading || strategyIsLoading ?
                <Loading title="Loading data..." />
            :
                <>
                    {step === 1 && <Step1 setStep={setStep} strategy={strategy} />}
                    {step === 2 && <Step2 setStep={setStep} strategy={strategy} 
                        usdcAmount={usdcAmount} 
                        setUsdcAmount={setUsdcAmount} 
                        ethAmount={ethAmount} 
                        setEthAmount={setEthAmount} />}
                    {step === 3 && <Step3 setStep={setStep} strategy={strategy} 
                        usdcAmount={usdcAmount} 
                        ethAmount={ethAmount} />}
                </>
            }
        </>
    );
}

export default CreateAccountPage