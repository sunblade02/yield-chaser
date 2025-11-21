"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { usePathname } from "next/navigation";
import CustomConnectButton from "./RainbowKit/CustomConnectButton";
import Settings from "./Settings";

const Header = () => {
    const pathname = usePathname();
    
    return (
        <header className="fixed w-full">
            <nav className="flex items-center justify-between h-[60px] px-20 border-b">
                {pathname === "/" ?
                    <>
                        <Link href="/">Yield Chaser</Link>
                        <div className="hidden md:flex gap-6">
                            <a className="text-muted-foreground hover:text-foreground  transition-colors" href="#">Product</a>
                            <a className="text-muted-foreground hover:text-foreground transition-colors" href="#">Pricing</a>
                            <a className="text-muted-foreground hover:text-foreground transition-colors" href="#">Docs</a>
                            <a className="text-muted-foreground hover:text-foreground transition-colors" href="#">Contact</a>
                        </div>
                        <div className="flex gap-3">
                            <Button asChild>
                                <Link href="/dashboard">Open App</Link>
                            </Button>
                            <Settings />
                        </div>
                    </>
                :
                    <>
                        <div className="flex gap-6">
                            <Link href="/">Yield Chaser</Link>
                            <Link href="/dashboard">Dashboard</Link>
                            <a className="text-muted-foreground hover:text-foreground  transition-colors" href="#">Governance</a>
                        </div>
                        <div className="flex gap-3">
                            <CustomConnectButton variant="default" />
                            <Settings />
                        </div>
                    </>
                }
            </nav>
        </header>
    )
}

export default Header