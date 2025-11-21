"use client"

import CustomConnectButton from "@/components/shared/RainbowKit/CustomConnectButton"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccount } from "wagmi"

const DashboardPage = () => {
    const { isConnected } = useAccount();

    return (
        <div className="flex flex-cols justify-center">
            <div className="w-full md:w-3/4">
                <div className="md:flex justify-between md:gap-6 mb-16">
                    <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                        <CardHeader className="p-0">
                            <CardDescription>
                                Total balance
                            </CardDescription>
                            <div className="mt-2 text-3xl font-medium">
                                0 USDC
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                        <CardHeader className="p-0">
                            <CardDescription>
                                Net APY
                            </CardDescription>
                            <div className="mt-2 text-3xl font-medium">
                                0 %
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="w-full rounded-lg p-8">
                        <CardHeader className="p-0">
                            <CardDescription>
                                Earnings (30d)
                            </CardDescription>
                            <div className="mt-2 text-3xl font-medium">
                                0 USDC
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                <h2 className="mb-6">Agent Activity</h2>
                
                <Card className="w-full rounded-lg p-8">
                    <CardHeader className="p-0">
                        <CardDescription className="text-center">
                            { isConnected ?
                                <>
                                    No activity yet. Deposit USDC to start receiving simulations and yield events.
                                </>
                            :
                                <>
                                    <div className="mb-6">
                                        No activity yet. Connect your wallet to view your simulations, reallocations, and yield events.
                                    </div>
                                    <CustomConnectButton variant="outline" />
                                </>
                            }
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage