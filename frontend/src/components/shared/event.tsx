import { explorerAddressURI, explorerName, explorerTxURI } from "@/constants";
import { EventType } from "@/types/event-type"
import { formatAddress, readableNumber, readableTimestamp } from "@/utils";
import { ExternalLink } from "lucide-react";

const Event = ({
    event
} : {
    event: EventType
}) => {
    
    let title = event.eventName;
    let description = null;
    switch (event.eventName) {
        case "AccountCreated":
            title = "Account creation";
            description = (
                <>
                    Account has been created with the strategy <a className="text-main" href={explorerAddressURI + (event.args as any).strategy} target="_blank">{formatAddress((event.args as any).strategy)} <ExternalLink size={14} className="inline -mt-1" /></a>
                </>
            );
            break;
        case "USDCAllocated":
            title = "Allocation";
            description = readableNumber((event.args as any).amount, 6) + " USDC allocated to vault " + formatAddress((event.args as any).vault);
            description = (
                <>
                    {readableNumber((event.args as any).amount, 6)} USDC has been allocated to vault <a className="text-main" href={explorerAddressURI + (event.args as any).vault} target="_blank">{formatAddress((event.args as any).vault)} <ExternalLink size={14} className="inline -mt-1" /></a>
                </>
            );
            break;
        case "USDCDisallocated":
            title = "Disallocation";
            description = readableNumber((event.args as any).amount, 6) + " USDC disallocated form vault " + formatAddress((event.args as any).vault);
            description = (
                <>
                    {readableNumber((event.args as any).amount, 6)} USDC has been allocated to vault <a className="text-main" href={explorerAddressURI + (event.args as any).vault} target="_blank">{formatAddress((event.args as any).vault)} <ExternalLink size={14} className="inline -mt-1" /></a>
                </>
            );
            break;
        case "USDCReceived":
            title = "Receiving USDC";
            description = (
                <>
                    {readableNumber((event.args as any).value, 6)} USDC has been received 
                </>
            );
            break;
        case "USDCWithdrawn":
            title = "Withdrawing  USDC";
            description = (
                <>
                    {readableNumber((event.args as any).value, 6)} USDC has been withdrawn
                </>
            );
            break;
        case "ETHReceived":
            title = "Receiving ETH";
            description = (
                <>
                    {readableNumber((event.args as any).amount, 18)} ETH has been received from <a className="text-main" href={explorerAddressURI + (event.args as any).sender} target="_blank">{formatAddress((event.args as any).sender)} <ExternalLink size={14} className="inline -mt-1" /></a>
                </>
            );
            break;
        case "ETHWithdrawn":
            title = "Withdrawing  ETH";
            description = (
                <>
                    {readableNumber((event.args as any).amount, 18)} ETH has been withdrawn
                </>
            );
            break;
        case "ReallocationEnabled":
            title = "Enabling agent activity";
            description = (
                <>
                    Agent activity enabled
                </>
            );
            break;
        case "ReallocationDisabled":
            title = "Disabling agent activity";
            description = (
                <>
                    Agent activity disabled
                </>
            );
            break;
        case "NoReallocationPeriodUpdated":
            title = "Updating no reallocation period";

            const { units: oldUnits, timeUnit: oldTimeUnit } = readableTimestamp(Number((event.args as any).oldNoReallocationPeriod), true);
            const { units: newUnits, timeUnit: newTimeUnit } = readableTimestamp(Number((event.args as any).newNoReallocationPeriod), true);

            description = (
                <>
                    The no reallocation period has been updated from {oldUnits} {oldTimeUnit} to {newUnits} {newTimeUnit}
                </>
            );
            break;
    }

    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full mt-2 bg-main"></div>
                <div className="w-px flex-1 mt-2 border"></div>
            </div>
            <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                    <span>{title}</span>
                    <span className="text-sm text-muted-foreground">Block #{event.blockNumber}</span>
                </div>
                {description && 
                    <div className="text-sm text-muted-foreground">
                        {description}
                    </div>
                }
                <div className="mt-2 text-sm">
                    <a className="text-main" href={explorerTxURI + event.transactionHash} target="_blank">View on {explorerName} <ExternalLink size={14} className="inline -mt-1" /></a>
                </div>
            </div>
        </div>
    )
}

export default Event