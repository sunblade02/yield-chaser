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
import { MonitorCog, Moon, Settings as SettingIcon, Sun } from "lucide-react"
import { useTheme } from "next-themes";

const Settings = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Dialog>
            <form>
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
                        <h3 className="pb-3">Theme</h3>
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
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className="w-full" variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default Settings