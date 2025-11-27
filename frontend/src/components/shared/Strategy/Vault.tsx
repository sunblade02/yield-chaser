import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { VaultType } from "@/types/VaultType";

const Vault = ({
    vault,
    selected
} : {
    vault: VaultType,
    selected: boolean
}) => {
    const readableNetAPY = (Number(vault.netAPY) / 10**4).toLocaleString('en-US');
    const readableTVL = (Number(vault.tvl) / 10**6).toLocaleString('en-US');
        
    return (
        <Card className="rounded-lg p-4 bg-foreground/2">
            <CardHeader className="p-0">
                <CardTitle className="flex gap-2">
                    <Image width="45" height="0" src="/morpho.png" alt="Morpho" className="rounded-[99]" />
                    <div className="flex justify-between w-full">
                        <div>
                            <h3>{vault.name}</h3>
                            <div className="flex gap-4 text-sm text-muted-foreground font-normal">
                                <div>APY: {readableNetAPY}%</div>
                                <div>TVL: ${readableTVL}</div>
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