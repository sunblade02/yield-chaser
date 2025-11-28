import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { useUpdateStrategyVaultsNetAPY } from "@/hooks/registry/useUpdateStrategyVaultsNetAPY"
import { StrategyType } from "@/types/StrategyType"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { type BaseError } from "wagmi"

const UpdateStrategyVaultsNetAPY = ({
    strategy
} : {
    strategy: StrategyType  
}) => {
    const [ netAPYs, setNetAPYs ] = useState<any[]>([]);
    const [ showSuccess, setShowSuccess ] = useState(false);

    useEffect(() => {
        const netAPYs: any[] = [];

        strategy.vaults.map((vault, index) => {
            netAPYs[index] = vault.netAPY;
        });
        
        setNetAPYs(netAPYs);
    }, [strategy]);

    const setNetAPY = (index: number, value: string) => {
        const updatedNetAPYs = [...netAPYs];
        updatedNetAPYs[index] = Number(value) * 10**4;
        setNetAPYs(updatedNetAPYs);
    }

    const {isLoading, isSuccess, error, updateStrategyVaultsNetAPY} = useUpdateStrategyVaultsNetAPY();

    useEffect(() => {
        if (isSuccess) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 1000);
        }
    }, [isSuccess]);

    const doUpdateStrategyVaultsNetAPY = () => {
        let vaultAddresses: any[] = [];
        strategy.vaults.map((vault, index) => {
            vaultAddresses[index] = vault.address;
        });

        updateStrategyVaultsNetAPY(strategy.address as `0x${string}`, vaultAddresses, netAPYs);
    }

    useEffect(() => {
        const netAPYs: any[] = [];

        strategy.vaults.map((vault, index) => {
            netAPYs[index] = vault.netAPY;
        });
        
        setNetAPYs(netAPYs);
    }, [strategy]);

    return (
        <Card className="w-1/2 rounded-lg p-8 mb-16">
            <CardHeader className="p-0">
                <CardTitle>
                    <h2>Update vaults net APYs for the strategy {strategy.name}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2">
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
                    <InputGroup key={vault.address}>
                        <InputGroupInput type="number" min="0" className="text-right" onChange={e => setNetAPY(index, e.target.value)} value={netAPYs[index] ? Number(netAPYs[index]) / 10**4 : "0"} />
                        <InputGroupAddon>
                            <InputGroupText>{vault.name}</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">%</InputGroupAddon>
                    </InputGroup>
                )}
                <div className="text-right">
                    <Button disabled={isLoading} onClick={doUpdateStrategyVaultsNetAPY}>{isLoading ? <Spinner /> : "Update"}</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default UpdateStrategyVaultsNetAPY