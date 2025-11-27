import { useState } from "react"
import Step1 from "./CreateAccount/Step1";
import Step2 from "./CreateAccount/Step2";
import Step3 from "./CreateAccount/Step3";
import { useGetStrategy } from "@/hooks/registry/useGetStrategy";
import Loading from "./Loading";

const CreateAccount = ({
    accountRefetch
} : {
    accountRefetch: () => void
}) => {
    const [ step, setStep ] = useState(1);
    const [ usdcAmount, setUsdcAmount ] = useState<number|null>(null);
    const [ ethAmount, setEthAmount ] = useState<number|null>(null);

    const { data: strategy, isLoading } = useGetStrategy(0);

    return (
        <>
            {isLoading ?
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