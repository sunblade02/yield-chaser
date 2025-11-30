import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useIncAssets } from "@/hooks/mocks/mockMorphoVault/useIncAssets"
import { StrategyType } from "@/types/StrategyType"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { type BaseError } from "wagmi"

const IncAssets = ({
    strategy
} : {
    strategy: StrategyType  
}) => {
    const [ amounts, setAmounts ] = useState<number[]>([]);
    const [ showSuccess, setShowSuccess ] = useState(false);

    const resetAmounts = () => {
        const amounts: number[] = [];

        strategy.vaults.map((_, index) => {
            amounts[index] = 0;
        });
        
        setAmounts(amounts);
    };

    useEffect(() => {
        resetAmounts();
    }, [strategy]);

    const setAmount = (index: number, amount: string) => {
        const updatedAmounts = [...amounts];
        updatedAmounts[index] = Number(amount) * 10**6;
        setAmounts(updatedAmounts);
    }

    const {isLoading, isSuccess, error, incAssets} = useIncAssets();

    useEffect(() => {
        if (isSuccess) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 1000);
        }

        resetAmounts();
    }, [isSuccess]);

    const doIncAssets = (index: number) => {
        incAssets(strategy.vaults[index].address as `0x${string}`, amounts[index]);
    }

    return (
        <Card className="w-1/2 rounded-lg p-8 mb-16">
            <CardHeader className="p-0">
                <CardTitle>
                    <h2>Increase the vault's total USDC</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2 px-0">
                {error &&
                    <Alert className="border-red-500" variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {(error as BaseError).shortMessage || error.message}
                        </AlertDescription>
                    </Alert>
                }
                {showSuccess &&
                    <Alert className="text-lime-500 border-lime-500">
                        <CheckCircle2Icon />
                        <AlertTitle>Success</AlertTitle>
                    </Alert>
                }
                {strategy.vaults.map((vault, index) => 
                    <ButtonGroup key={vault.address} className="w-full">
                        <ButtonGroupText>
                            {vault.name}
                        </ButtonGroupText>
                        <Input type="number" min="0" className="text-right" onChange={e => setAmount(index, e.target.value)} value={amounts[index] ? Number(amounts[index]) / 10**6 : "0"} />
                        <Button disabled={isLoading} onClick={() => doIncAssets(index)}>{isLoading ? <Spinner /> : "Add"}</Button>
                    </ButtonGroup>
                )}
            </CardContent>
        </Card>
    )
}

export default IncAssets