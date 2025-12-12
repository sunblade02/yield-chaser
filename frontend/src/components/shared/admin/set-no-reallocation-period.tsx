import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { useNoReallocationPeriod } from "@/hooks/account/use-no-reallocation-period"
import { useSetNoReallocationPeriod } from "@/hooks/account/use-set-no-reallocation-period"
import { useYcAccount } from "@/provider/yc-account-provider"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { type BaseError } from "wagmi"

const SetNoReallocationPeriod = () => {
    const { account } = useYcAccount();

    const [ period, setPeriod ] = useState(0);
    const [ showSuccess, setShowSuccess ] = useState(false);

    const { data: noReallocationPeriod } = useNoReallocationPeriod(account?.address);

    useEffect(() => {
        if (noReallocationPeriod) {
            setPeriod(Number(noReallocationPeriod));
        }
    }, [noReallocationPeriod]);

    const {isLoading, isSuccess, error, setNoReallocationPeriod} = useSetNoReallocationPeriod();

    useEffect(() => {
        if (isSuccess) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 1000);
        }
    }, [isSuccess]);

    const doSetNoReallocationPeriod = () => {
        setNoReallocationPeriod(account?.address ?? undefined, period);
    }

    return (
        <Card className="w-1/2 rounded-lg p-8 mb-16">
            <CardHeader className="p-0">
                <CardTitle>
                    <h2>Set the no reallocation period</h2>
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
                <ButtonGroup className="w-full">
                    <InputGroup>
                        <InputGroupInput type="number" min="0" className="text-right" onChange={e => setPeriod(Number(e.target.value))} value={period} />
                        <InputGroupAddon align="inline-end">seconds</InputGroupAddon>
                    </InputGroup>
                    <Button disabled={isLoading} onClick={doSetNoReallocationPeriod}>{isLoading ? <Spinner /> : "Set"}</Button>
                </ButtonGroup>
            </CardContent>
        </Card>
    )
}

export default SetNoReallocationPeriod