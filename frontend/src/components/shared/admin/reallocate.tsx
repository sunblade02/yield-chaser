import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useReallocate } from "@/hooks/account/use-reallocate"
import { useYcAccount } from "@/provider/yc-account-provider"
import { AccountType } from "@/types/account-type"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { type BaseError } from "wagmi"

const Reallocate = () => {
    const { account } = useYcAccount();
    const [ showSuccess, setShowSuccess ] = useState(false);

    const {isLoading, isSuccess, error, reallocate} = useReallocate();
    
    useEffect(() => {
        if (isSuccess) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 1000);
        }
    }, [isSuccess]);

    const doReallocate = () => {
        reallocate(account?.address ?? undefined);
    }

    return (
        <Card className="w-1/2 rounded-lg p-8 mb-16">
            <CardHeader className="p-0">
                <CardTitle>
                    <h2>Reallocate funds</h2>
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
                <Button disabled={isLoading} onClick={doReallocate}>{isLoading ? <Spinner /> : "Reallocate"}</Button>
            </CardContent>
        </Card>
    )
}

export default Reallocate