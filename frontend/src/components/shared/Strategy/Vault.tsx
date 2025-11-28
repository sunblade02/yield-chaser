import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { VaultType } from "@/types/VaultType";
import clsx from "clsx";
import { readableNumber } from "@/utils";

const Vault = ({
    className,
    vault,
    selected
} : {
    className?: string,
    vault: VaultType,
    selected: boolean
}) => {
    return (
        <Card className={clsx("rounded-lg p-4 bg-foreground/2", className)}>
            <CardHeader className="p-0">
                <CardTitle className="flex gap-2">
                    <Image width="45" height="0" src="/morpho.png" alt="Morpho" className="rounded-[99]" />
                    <div className="flex justify-between w-full">
                        <div>
                            <h3>{vault.name}</h3>
                            <div className="flex gap-4 text-sm text-muted-foreground font-normal">
                                <div>APY: {readableNumber(vault.netAPY, 4)}%</div>
                                <div>TVL: ${readableNumber(vault.tvl, 6)}</div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <Badge variant="secondary" className={`rounded-md text-xs${selected ? " text-main bg-main" : ""}`}>{selected ? "Currently selected" : "Monitored"}</Badge>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
        </Card>
    )
}

export default Vault