"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEnableReallocation } from "@/hooks/account/use-enable-reallocation";
import { useIsReallocationEnabled } from "@/hooks/account/use-is-reallocation-enabled";
import { MonitorCog, Moon, Settings as SettingIcon, Sun } from "lucide-react"
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";
import { useDisableReallocation } from "@/hooks/account/use-disable-reallocation";
import { zeroAddress } from "viem";
import { useYcAccount } from "@/provider/yc-account-provider";

const Settings = () => {
    const { theme, setTheme } = useTheme();
    const { account, hasAccount, fetchEvents } = useYcAccount();

    const { data: isReallocationEnabled, isFetched, refetch } = useIsReallocationEnabled(account?.address);

    const { isLoading: enableReallocationIsLoading, isSuccess: enableReallocationIsSuccess, enableReallocation } = useEnableReallocation();

    const doEnableReallocation = () => {
        enableReallocation(account?.address);
    }

    const { isLoading: disableReallocationIsLoading, isSuccess: disableReallocationIsSuccess, disableReallocation } = useDisableReallocation();

    const doDisableReallocation = () => {
        disableReallocation(account?.address);
    }

    useEffect(() => {
        if (enableReallocationIsSuccess || disableReallocationIsSuccess) {
            refetch();
            fetchEvents();
        }
    }, [enableReallocationIsSuccess, disableReallocationIsSuccess]);

    const isLoading = enableReallocationIsLoading || disableReallocationIsLoading;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><SettingIcon /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-xl font-medium">Configuration</DialogTitle>
                    <DialogDescription>
                        Configure your agent settings.
                    </DialogDescription>
                </DialogHeader>
                <div className="pb-6">
                    <h3 className="pb-3 text-sm">Theme</h3>
                    <div className="flex justify-center gap-2">
                        <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
                            <Sun /> Light
                        </Button>
                        <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
                            <Moon /> Dark
                        </Button>
                        <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")}>
                            <MonitorCog /> System
                        </Button>
                    </div>
                </div>
                {hasAccount === true &&
                    <div className="pb-6">
                        <h3 className="pb-3 text-sm">Suspend agent activity</h3>
                        <div className="text-sm text-muted-foreground pb-3">
                            Temporarily pause automated strategy management.
                        </div>
                        <div className="flex justify-center gap-2">
                            {isFetched && isReallocationEnabled == true &&
                                <Button disabled={isLoading} variant="destructive" onClick={doDisableReallocation}>
                                    {isLoading ? <Spinner /> : "Suspend"}
                                </Button>
                            }
                            {isFetched && isReallocationEnabled == false &&
                                <Button disabled={isLoading} className="bg-main text-white hover:bg-main" onClick={doEnableReallocation}>
                                    {isLoading ? <Spinner /> : "Resume"}
                                </Button>
                            }
                        </div>
                    </div>
                }
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="w-full" variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Settings