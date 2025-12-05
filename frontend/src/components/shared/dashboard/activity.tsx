import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CustomConnectButton from "../rainbow-kit/custom-connect-button"
import { useAccount } from "wagmi";
import { useEffect } from "react";
import Event from "../event";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useYcAccount } from "@/provider/yc-account-provider";

const Activity = () => {
    const { isConnected } = useAccount();
    const { hasAccount, events, fetchEvents } = useYcAccount();
    
    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <Card className="w-full rounded-lg p-8">
            <CardHeader className="p-0">
                <CardTitle>
                    <h2>Activity</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {hasAccount ?
                    <div className="space-y-6">
                        {events.map(event => <Event key={crypto.randomUUID()} event={event} />)}
                    </div>
                :
                    <>
                        <div className="text-center text-muted-foreground">
                            {isConnected ?
                                <>
                                    <div className="mb-6">
                                        No activity yet.
                                    </div>
                                    <Button asChild variant="outline">
                                        <Link href="/create-account">Create an account</Link>
                                    </Button>
                                </>
                            :
                                <>
                                    <div className="mb-6">
                                        No activity yet. Connect your wallet to view your simulations, reallocations, and yield events.
                                    </div>
                                    <CustomConnectButton variant="outline" />
                                </>
                            }
                        </div>
                    </>
                }
            </CardContent>
        </Card>
    )
}

export default Activity