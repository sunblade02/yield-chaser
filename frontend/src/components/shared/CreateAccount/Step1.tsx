import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StrategyType } from "@/types/StrategyType"
import { CircleCheck } from "lucide-react"

const Step1 = ({
    setStep,
    strategy
} : {
    setStep: (step: number) => void,
    strategy: StrategyType
}) => {
    let readableBestNetAPY = null;
    let readableBestTVL = null;
    if (strategy.bestVaultIndex) {
        readableBestNetAPY = (Number(strategy.vaults[strategy.bestVaultIndex].netAPY) / 10**4).toLocaleString('en-US');
        readableBestTVL = (Number(strategy.vaults[strategy.bestVaultIndex].tvl) / 10**6).toLocaleString('en-US');
    }

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
                            <div className="mb-6">
                                Low-risk, stable yield strategy using Morpho Blue vaults.
                            </div>
                            <div className="flex gap-4 mb-6">
                                <div>
                                    Net APY<br />
                                    <span className="text-3xl font-weight-medium text-main">{readableBestNetAPY}%</span>
                                </div>
                                <div>
                                    TVL<br />
                                    <span className="text-lg font-weight-medium text-foreground">${readableBestTVL}</span>
                                </div>
                            </div>
                        </CardDescription>
                        <CardFooter className="border-t text-xs px-0 flex-col items-start space-y-2 text-muted-foreground">
                            <div>
                                Protocols: <span className="text-foreground font-weight-medium">Morpho</span>
                            </div>
                            <div>
                                Vaults: <span className="text-foreground font-weight-medium">2 monitored</span>
                            </div>
                        </CardFooter>
                    </CardHeader>
                </Card>
                <Card className="w-full mb-6 md:mb-0 rounded-lg p-8 opacity-60">
                    <CardHeader className="p-0">
                        <CardTitle className="flex justify-between">
                            <h2>Balanced Yield</h2>
                            <Badge variant="secondary" className="rounded-md text-xs">Coming soon</Badge>
                        </CardTitle>
                        <CardDescription>
                            <div className="mb-6">
                                Moderate-risk strategy across multiple protocols.
                            </div>
                            <div className="flex gap-4 mb-6">
                                <div>
                                    Net APY<br />
                                    <span className="text-3xl font-weight-medium text-main">X%</span>
                                </div>
                                <div>
                                    TVL<br />
                                    <span className="text-lg font-weight-medium text-foreground">$X</span>
                                </div>
                            </div>
                        </CardDescription>
                        <CardFooter className="border-t text-xs px-0 flex-col items-start space-y-2 text-muted-foreground">
                            <div>
                                Protocols: <span className="text-foreground font-weight-medium">Aave, Compound</span>
                            </div>
                            <div>
                                Vaults: <span className="text-foreground font-weight-medium">2 monitored</span>
                            </div>
                        </CardFooter>
                    </CardHeader>
                </Card>
                <Card className="w-full rounded-lg p-8 opacity-60">
                    <CardHeader className="p-0">
                        <CardTitle className="flex justify-between">
                            <h2>Growth Yield</h2>
                            <Badge variant="secondary" className="rounded-md text-xs">Coming soon</Badge>
                        </CardTitle>
                        <CardDescription>
                            <div className="mb-6">
                                High-risk, high-yield strategy across multiple protocols.
                            </div>
                            <div className="flex gap-4 mb-6">
                                <div>
                                    Net APY<br />
                                    <span className="text-3xl font-weight-medium text-main">X%</span>
                                </div>
                                <div>
                                    TVL<br />
                                    <span className="text-lg font-weight-medium text-foreground">$X</span>
                                </div>
                            </div>
                        </CardDescription>
                        <CardFooter className="border-t text-xs px-0 flex-col items-start space-y-2 text-muted-foreground">
                            <div>
                                Protocols: <span className="text-foreground font-weight-medium">Aave, Compound, Euler</span>
                            </div>
                            <div>
                                Vaults: <span className="text-foreground font-weight-medium">6 monitored</span>
                            </div>
                        </CardFooter>
                    </CardHeader>
                </Card>
            </div>

            <div className="text-center">
                <Button onClick={() => setStep(2)}>Deposit</Button>
            </div>
        </>
    )
}

export default Step1