"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { usePathname } from "next/navigation";
import CustomConnectButton from "./rainbow-kit/custom-connect-button";
import Settings from "./settings";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Header = () => {
    const pathname = usePathname();
    const [ theme, setTheme ] = useState("light");
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (resolvedTheme) {
            setTheme(resolvedTheme);
        }
    }, [ resolvedTheme ]);
    
    return (
        <header className="fixed w-full border-b">
            <nav className="flex items-center justify-between h-[60px] px-20 xl:px-80">
                {pathname === "/" ?
                    <>
                        <Link href="/" className="flex gap-2">
                            <Image src={`/${theme}/logo.png`} alt="Yield Chaser logo" width="25" height="25" />
                            <span className="hidden sm:inline">Yield Chaser</span>
                        </Link>
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
                            <Link href="/" className="flex gap-2">
                                <Image src={`/${theme}/logo.png`} alt="Yield Chaser logo" width="25" height="25" />
                                <span className="hidden md:inline">Yield Chaser</span>
                            </Link>
                            <div className="hidden lg:flex gap-6">
                                <Link href="/dashboard">Dashboard</Link>
                                <a className="text-muted-foreground hover:text-foreground  transition-colors" href="#">Governance</a>
                            </div>
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