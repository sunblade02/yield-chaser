import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, TrendingUp, Zap } from "lucide-react";

export default function HomePage() {
    return (
        <>
            <div className="max-w-[780px] mb-[80px]">
                <h1 className="mb-6">Earn yields. Stay in control.</h1>
                <p className="mb-8 leading-relaxed text-muted-foreground ">
                    Automated yield strategies powered by real-time analytics. Track, optimize, and grow your portfolio with institutional-grade tools.
                </p>
                <Button>
                    Get Started <ArrowRight />
                </Button>
            </div>
            <div className="md:flex justify-between md:gap-6">
                <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                    <CardHeader className="p-0">
                        <CardTitle>
                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-6">
                                <Shield className="text-accent" />
                            </div>
                            <h2>Full control of your funds</h2>
                        </CardTitle>
                        <CardDescription>
                            Your assets always remain in your wallet — zero custodial risk.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                    <CardHeader className="p-0">
                        <CardTitle>
                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-6">
                                <Zap className="text-accent" />
                            </div>
                            <h2>Smart exposure</h2>
                        </CardTitle>
                        <CardDescription>
                            Diversify across blue-chip protocols with intelligent allocation.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card className="w-full rounded-lg p-8">
                    <CardHeader className="p-0">
                        <CardTitle>
                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-6">
                                <TrendingUp className="text-accent" />
                            </div>
                            <h2>Active yield optimization</h2>
                        </CardTitle>
                        <CardDescription>
                            Automatically reallocate and compound to secure top yields.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </>      
    );
}
