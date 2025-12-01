import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StrategyType } from "@/types/StrategyType"
import { readableNumber } from "@/utils"
import { CircleCheck } from "lucide-react"

const Step1 = ({
    setStep,
    strategy
} : {
    setStep: (step: number) => void,
    strategy: StrategyType
}) => {
    return (
        <>
            <div className="max-w-[780px] mb-[80px]">
                <h2 className="mb-6">Start earning optimized yield</h2>
                <p className="mb-8 leading-relaxed text-muted-foreground ">
                    Deposit USDC into your vault to begin earning net-optimized yield. Your funds always remain in your wallet — you keep full custody.
                </p>
            </div>

            <h3 className="mb-8">Choose your strategy</h3>
            
            <div className="md:flex justify-between md:gap-6 mb-8">
                <Card className="w-full mb-6 md:mb-0 rounded-lg p-8 selected">
                    <CardHeader className="p-0">
                        <CardTitle>
                            <div className="flex justify-between mb-2">
                                <h2>Safe Yield</h2>
                                <CircleCheck color="var(--main)" />
                            </div>
                            <Badge variant="secondary" className="rounded-md text-xs">Recommended</Badge>
                        </CardTitle>
                        <CardDescription>
                            Low-risk, stable yield strategy using Morpho Blue vaults.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4 px-0 text-muted-foreground text-xs">
                        <div>
                            Net APY<br />
                            <span className="text-3xl font-weight-medium text-main">{strategy.bestVaultIndex ? readableNumber(strategy.vaults[strategy.bestVaultIndex].netAPY, 4) : 0}%</span>
                        </div>
                        <div>
                            TVL<br />
                            <span className="text-lg font-weight-medium text-foreground">${strategy.bestVaultIndex ? readableNumber(strategy.vaults[strategy.bestVaultIndex].tvl, 6) : 0}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t text-xs px-0 flex-col items-start space-y-2 text-muted-foreground">
                        <div>
                            Protocols: <span className="text-foreground font-weight-medium">Morpho</span>
                        </div>
                        <div>
                            Vaults: <span className="text-foreground font-weight-medium">2 monitored</span>
                        </div>
                    </CardFooter>
                </Card>
                <Card className="w-full mb-6 md:mb-0 rounded-lg p-8 opacity-60">
                    <CardHeader className="p-0">
                        <CardTitle className="flex justify-between">
                            <h2>Balanced Yield</h2>
                            <div>
                                <Badge variant="secondary" className="rounded-md text-xs">Coming soon</Badge>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Moderate-risk strategy across multiple protocols.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4 px-0 text-muted-foreground text-xs">
                        <div>
                            Net APY<br />
                            <span className="text-3xl font-weight-medium text-main">-%</span>
                        </div>
                        <div>
                            TVL<br />
                            <span className="text-lg font-weight-medium text-foreground">$-</span>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t text-xs px-0 flex-col items-start space-y-2 text-muted-foreground">
                        <div>
                            Protocols: <span className="text-foreground font-weight-medium">Aave, Compound</span>
                        </div>
                        <div>
                            Vaults: <span className="text-foreground font-weight-medium">2 monitored</span>
                        </div>
                    </CardFooter>
                </Card>
                <Card className="w-full rounded-lg p-8 opacity-60">
                    <CardHeader className="p-0">
                        <CardTitle className="flex justify-between">
                            <h2>Growth Yield</h2>
                            <div>
                                <Badge variant="secondary" className="rounded-md text-xs">Coming soon</Badge>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            High-risk, high-yield strategy across multiple protocols.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4 px-0 text-muted-foreground text-xs">
                        <div>
                            Net APY<br />
                            <span className="text-3xl font-weight-medium text-main">-%</span>
                        </div>
                        <div>
                            TVL<br />
                            <span className="text-lg font-weight-medium text-foreground">$-</span>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t text-xs px-0 flex-col items-start space-y-2 text-muted-foreground">
                        <div>
                            Protocols: <span className="text-foreground font-weight-medium">Aave, Compound, Euler</span>
                        </div>
                        <div>
                            Vaults: <span className="text-foreground font-weight-medium">6 monitored</span>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <div className="text-center">
                <Button onClick={() => setStep(2)}>Deposit</Button>
            </div>
        </>
    )
}

export default Step1