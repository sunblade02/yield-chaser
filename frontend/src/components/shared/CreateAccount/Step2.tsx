import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { contractABI as usdcContractABI, contractAddress as usdcContractAddress } from "@/constants/contracts/usdc";
import { useAccount, useBalance, useGasPrice, useReadContract } from "wagmi"
import {
    TokenUSDC,
    TokenETH,
} from '@web3icons/react'
import { Info } from "lucide-react";
import { approvalGasCost, createAccountGasCost } from "@/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StrategyType } from "@/types/StrategyType";
import Vault from "../Strategy/Vault";
import { readableNumber } from "@/utils";

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
    usdcAmount: number|null,
    setUsdcAmount: (usdcAmount: number|null) => void,
    ethAmount: number|null,
    setEthAmount: (ethAmount: number|null) => void
}) => {
    const { address } = useAccount();

    const { data: gasPrice, isSuccess: gasPriceIsSuccess } = useGasPrice();

    const { data: usdcBalance, isSuccess: usdcBalanceIsSuccess } = useReadContract({
        address: usdcContractAddress,
        abi: usdcContractABI,
        functionName: "balanceOf",
        args: [ address ]
    });

    const { data: eth, isSuccess: ethIsSuccess } = useBalance({
        address,
    });

    const setMaxUsdc = () => {
        if (usdcBalanceIsSuccess) {
            setUsdcAmount(Number(usdcBalance));
        }
    };

    const setUsdc = (usdc: string) => {
        let amount = Number(usdc) * 10**6;
        if (amount < 0) {
            amount = 0;
        } else if (amount > Number(usdcBalance) ) {
            amount = Number(usdcBalance);
        }

        setUsdcAmount(amount);
    };

    let maxEth = 0;
    if (ethIsSuccess) {
        maxEth = eth.value ? Number(eth.value) : 0;
        if (gasPriceIsSuccess) {
            maxEth -= (approvalGasCost + createAccountGasCost) * Number(gasPrice);
        }
    }

    const setMaxEth = () => {
        if (ethIsSuccess) {
            setEthAmount(maxEth);
        }
    };

    const setEth = (eth: string) => {
        let amount = Number(eth) * 10**18;
        if (amount < 0) {
            amount = 0;
        } else if (ethIsSuccess && amount > maxEth) {
            amount = maxEth;
        }

        setEthAmount(amount);
    };

    return (
        <div className="max-w-[600px] mx-auto">
            <h2 className="mb-6">Deposit</h2>

            <div className="mb-4 text-muted-foreground">Balance USDC: {readableNumber(usdcBalance, 6)} <TokenUSDC size={24} variant="mono" className="inline -mt-1" /></div>
            <div className="flex gap-2 mb-6">
                <InputGroup>
                    <InputGroupInput placeholder="0.0" type="number" min="0" max={usdcBalanceIsSuccess ? Number(usdcBalance) / 10**6 : 0} className="text-end" onChange={e => setUsdc(e.target.value)} value={usdcAmount || usdcAmount === 0 ? usdcAmount / 10**6 : ""} />
                    <InputGroupAddon align="inline-end">
                        <InputGroupText className="w-[40px]">USDC</InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
                <Button variant="outline" disabled={!usdcBalanceIsSuccess} onClick={setMaxUsdc}>Max</Button>
            </div>
            <div className="mb-4 text-muted-foreground">Balance ETH: {readableNumber(eth?.value, 18)} <TokenETH size={24} variant="mono" className="inline -mt-1" /></div>
            <div className="flex gap-2 mb-1">
                <InputGroup>
                    <InputGroupInput placeholder="0.0" type="number" min="0" max={ethIsSuccess ? Number(eth.value) / 10**18 : 0} className="text-end" onChange={e => setEth(e.target.value)} value={ethAmount || ethAmount === 0 ? ethAmount  / 10**18 : ""} />
                    <InputGroupAddon align="inline-end" >
                        <InputGroupText className="w-[40px]">ETH</InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
                <Button variant="outline" disabled={!ethIsSuccess} onClick={setMaxEth}>Max</Button>
            </div>
            <div className="text-muted-foreground flex text-sm mb-8">
                <Info size={18} className="mt-[2px] mr-1" /> The agent requires a recurring ETH deposit to operate.
            </div>
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