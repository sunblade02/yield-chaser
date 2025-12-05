import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '../ui/input-group'
import { Button } from '../ui/button'
import { readableNumber } from '@/utils'
import { TokenETH, TokenUSDC } from '@web3icons/react'
import { Info } from 'lucide-react'

const BalancesForm = ({
    usdcBalance,
    ethBalance,
    gasCosts,
    disabled,
    usdcAmount,
    setUsdcAmount,
    ethAmount,
    setEthAmount,
} : {
    usdcBalance: number,
    ethBalance: number,
    gasCosts: number,
    disabled: boolean,
    usdcAmount: number,
    setUsdcAmount: (usdcAmount: number) => void,
    ethAmount: number,
    setEthAmount: (ethAmount: number) => void,
}) => {
    const setMaxUsdc = () => {
        setUsdcAmount(usdcBalance);
    };

    const setUsdc = (usdc: string) => {
        let amount = Number(usdc) * 10**6;
        if (amount < 0) {
            amount = 0;
        } else if (amount > usdcBalance) {
            amount = usdcBalance;
        }

        setUsdcAmount(amount);
    };

    const maxEth = ethBalance - gasCosts;

    const setMaxEth = () => {
        setEthAmount(maxEth);
    };

    const setEth = (eth: string) => {
        let amount = Number(eth) * 10**18;
        if (amount < 0) {
            amount = 0;
        } else if (amount > maxEth) {
            amount = maxEth;
        }

        setEthAmount(amount);
    };

    return (
        <>
            <div className="mb-4 text-muted-foreground">Balance USDC: {readableNumber(usdcBalance, 6)} <TokenUSDC size={24} variant="mono" className="inline -mt-1" /></div>
            <div className="flex gap-2 mb-6">
                <InputGroup>
                    <InputGroupInput placeholder="0.0" type="number" min="0" max={usdcBalance / 10**6} className="text-end" onChange={e => setUsdc(e.target.value)} value={usdcAmount || usdcAmount === 0 ? usdcAmount / 10**6 : ""} />
                    <InputGroupAddon align="inline-end">
                        <InputGroupText className="w-[40px]">USDC</InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
                <Button variant="outline" disabled={disabled} onClick={setMaxUsdc}>Max</Button>
            </div>
            <div className="mb-4 text-muted-foreground">Balance ETH: {readableNumber(ethBalance, 18)} <TokenETH size={24} variant="mono" className="inline -mt-1" /></div>
            <div className="flex gap-2 mb-1">
                <InputGroup>
                    <InputGroupInput placeholder="0.0" type="number" min="0" max={ethBalance / 10**18} className="text-end" onChange={e => setEth(e.target.value)} value={ethAmount || ethAmount === 0 ? ethAmount  / 10**18 : ""} />
                    <InputGroupAddon align="inline-end" >
                        <InputGroupText className="w-[40px]">ETH</InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
                <Button variant="outline" disabled={disabled} onClick={setMaxEth}>Max</Button>
            </div>
            <div className="text-muted-foreground flex text-sm mb-8">
                <Info size={18} className="mt-[2px] mr-1" /> The agent requires a recurring ETH deposit to operate.
            </div>
        </>
    )
}

export default BalancesForm