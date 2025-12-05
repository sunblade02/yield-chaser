"use client"

import Step1 from "@/components/shared/withdraw/step1";
import Step2 from "@/components/shared/withdraw/step2";
import { useState } from "react";

const WithdrawPage = () => {
    const [ step, setStep ] = useState(1);
    const [ usdcAmount, setUsdcAmount ] = useState(0);
    const [ ethAmount, setEthAmount ] = useState(0);

    return (
        <>
            {step === 1 && <Step1 setStep={setStep} 
                usdcAmount={usdcAmount} 
                setUsdcAmount={setUsdcAmount} 
                ethAmount={ethAmount} 
                setEthAmount={setEthAmount} />}
            {step === 2 && <Step2 setStep={setStep} 
                usdcAmount={usdcAmount}
                ethAmount={ethAmount} />}
        </>
    );
}

export default WithdrawPage