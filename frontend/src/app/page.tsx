import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
    return (
        <>
            <div className="max-w-[780px] mb-[80px]">
                <h1 className="mb-6">Earn yields. Stay in control.</h1>
                <p className="mb-8 leading-relaxed text-muted-foreground ">
                    Automated yield strategies powered by real-time analytics. Track, optimize, and grow your portfolio with institutional-grade tools.
                </p>
                <Button asChild>
                    <Link href="/dashboard">Get Started <ArrowRight /></Link>
                </Button>
            </div>
            <div className="md:flex justify-between md:gap-6">
                <Card className="w-full mb-6 md:mb-0 rounded-lg p-8">
                    <CardHeader className="p-0">
                        <CardTitle>
                            <div className="card-icon w-10 h-10 rounded-lg flex items-center justify-center mb-6 text-main bg-main">
                                <Shield />
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
                            <div className="card-icon w-10 h-10 rounded-lg flex items-center justify-center mb-6 text-main bg-main">
                                <Zap />
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
                            <div className="card-icon w-10 h-10 rounded-lg flex items-center justify-center mb-6 text-main bg-main">
                                <TrendingUp />
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
