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
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { useDisableReallocation } from "@/hooks/account/use-disable-reallocation";
import { useYcAccount } from "@/provider/yc-account-provider";
import { useClose } from "@/hooks/account/use-close";
import { ButtonGroup } from "../ui/button-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Input } from "../ui/input";
import { useSetNoReallocationPeriod } from "@/hooks/account/use-set-no-reallocation-period";
import { useNoReallocationPeriod } from "@/hooks/account/use-no-reallocation-period";
import { readableTimestamp } from "@/utils";

const Settings = () => {
    const { theme, setTheme } = useTheme();
    const { account, hasAccount, getAccountRefetch, fetchEvents } = useYcAccount();
    
    const [ noReallocationPeriodValue, setNoReallocationPeriodValue ] = useState("");
    const [ timeUnit, setTimeUnit ] = useState("days");

    const { data: isReallocationEnabled, isFetched: isReallocationPeriodIsFetched, refetch: isReallocationPeriodRefetch } = useIsReallocationEnabled(account?.address);

    const { data: noReallocationPeriod, refetch: noReallocationPeriodRefetch } = useNoReallocationPeriod(account?.address);

    useEffect(() => {
        if (noReallocationPeriod) {
            const { units, timeUnit } = readableTimestamp(Number(noReallocationPeriod));

            setNoReallocationPeriodValue(units.toString());
            setTimeUnit(timeUnit);
        }
    }, [noReallocationPeriod]);

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
            isReallocationPeriodRefetch();
            fetchEvents();
        }
    }, [enableReallocationIsSuccess, disableReallocationIsSuccess]);

    const setReallocationIsLoading = enableReallocationIsLoading || disableReallocationIsLoading;

    const { isLoading: closeIsLoading, isSuccess: closeIsSuccess, close } = useClose();

    const doClose = () => {
        close(account?.address);
    }

    useEffect(() => {
        if (closeIsSuccess) {
            getAccountRefetch();
        }
    }, [closeIsSuccess]);

    const { isLoading: setNoReallocationPeriodIsLoading, isSuccess: setNoReallocationPeriodIsSuccess, setNoReallocationPeriod } = useSetNoReallocationPeriod();

    const doSetNoReallocationPeriod = () => {
        let mul = 86400;
        if (timeUnit === "weeks") {
            mul *= 7;
        }
        
        const noReallocationPeriod = mul * Number(noReallocationPeriodValue);
        setNoReallocationPeriod(account?.address, noReallocationPeriod);
    }

    useEffect(() => {
        if (setNoReallocationPeriodIsSuccess) {
            noReallocationPeriodRefetch();
            fetchEvents();
        }
    }, [setNoReallocationPeriodIsSuccess]);

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
                <div className="pb-3">
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
                    <>
                        <div className="pb-3">
                            <h3 className="pb-3 text-sm">Suspend agent activity</h3>
                            <div className="text-sm text-muted-foreground pb-3">
                                Temporarily pause automated strategy management.
                            </div>
                            <div className="flex justify-center">
                                {isReallocationPeriodIsFetched && isReallocationEnabled == true &&
                                    <Button disabled={setReallocationIsLoading} variant="destructive" onClick={doDisableReallocation}>
                                        {setReallocationIsLoading ? <Spinner /> : "Suspend"}
                                    </Button>
                                }
                                {isReallocationPeriodIsFetched && isReallocationEnabled == false &&
                                    <Button disabled={setReallocationIsLoading} className="bg-main text-white hover:bg-main" onClick={doEnableReallocation}>
                                        {setReallocationIsLoading ? <Spinner /> : "Resume"}
                                    </Button>
                                }
                            </div>
                        </div>
                        <div className="pb-3">
                            <h3 className="pb-3 text-sm">No reallocation period</h3>
                            <div className="text-sm text-muted-foreground pb-3">
                                Define a minimum period during which your fund stays in the vault.
                            </div>
                            <div className="flex justify-center">
                                <ButtonGroup>
                                    <Input className="w-[100px] text-right" type="number" pattern="[1-9]*" onChange={e => setNoReallocationPeriodValue(e.target.value)} value={noReallocationPeriodValue} />
                                    <Select value={timeUnit} onValueChange={setTimeUnit}>
                                        <SelectTrigger className="font-mono">{timeUnit}</SelectTrigger>
                                        <SelectContent className="min-w-24">
                                            <SelectItem value="days">
                                                days
                                            </SelectItem>
                                            <SelectItem value="weeks">
                                                weeks
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button disabled={setNoReallocationPeriodIsLoading || !noReallocationPeriodValue || Number(noReallocationPeriodValue) < 0} onClick={doSetNoReallocationPeriod}>
                                        {setNoReallocationPeriodIsLoading ? <Spinner /> : "Set"}
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                        <div className="pb-3">
                            <h3 className="pb-3 text-sm">Close account</h3>
                            <div className="text-sm text-muted-foreground pb-3">
                                Withdraw all funds and close the position.
                            </div>
                            <div className="flex justify-center">
                                <Button disabled={closeIsLoading} variant="destructive" onClick={doClose}>
                                    {closeIsLoading ? <Spinner /> : "Close your account"}
                                </Button>
                            </div>
                        </div>
                    </>
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