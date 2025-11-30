import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CustomConnectButton from "../RainbowKit/CustomConnectButton"
import { useAccount } from "wagmi";
import { publicClient } from "@/utils/client";
import { contractAddress as registryContractAddress } from "@/constants/contracts/registry";
import { parseAbiItem } from "viem";
import { deploymentBlock } from "@/constants";
import { useEffect, useState } from "react";
import Event from "../Event";
import { EventType } from "@/types/EventType";

const Activity = ({
    accountAddress
} : {
    accountAddress: string
}) => {
    const { isConnected, address } = useAccount();
    const [ events, setEvents ] = useState<EventType[]>([]);

    const getEvents = async() => {
        const configs = [
            {
                address: registryContractAddress,
                event: parseAbiItem("event AccountCreated(address indexed owner, address strategy, uint usdcAmount, uint ethAmount)"),
                args: {
                    owner: address
                },
            },
            {
                address: accountAddress,
                event: parseAbiItem("event ETHReceived(address sender, uint amount)"),
            },
            {
                address: accountAddress,
                event: parseAbiItem("event USDCDisallocated(uint amount, address vault)"),
            },
            {
                address: accountAddress,
                event: parseAbiItem("event USDCAllocated(uint amount, address vault)"),
            },
        ];

        let events: EventType[] = [];

        for (let i = 0; i < configs.length; i++) {
            const logs = await publicClient.getLogs({
                address: configs[i].address as `0x${string}`,
                event: configs[i].event,
                fromBlock: deploymentBlock,
                toBlock: 'latest',
                args: configs[i].args ?? {},
            });
            events = events.concat(logs.map(log => ({
                eventName: log.eventName,
                transactionHash: log.transactionHash,
                blockNumber: log.blockNumber,
                order: i,
                args: log.args
            })));
        }

        events = events.sort((a, b) => {
            if (a.blockNumber !== b.blockNumber) {
                return Number(b.blockNumber) - Number(a.blockNumber);
            }
            return b.order - a.order;
        });

        setEvents(events);
    };

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <Card className="w-full rounded-lg p-8">
            <CardHeader className="p-0">
                <CardTitle>
                    <h2>Activity</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                { isConnected ?
                    <div className="space-y-6">
                        {events.map(event => <Event key={crypto.randomUUID()} event={event} />)}
                    </div>
                :
                    <>
                        <div className="text-center text-muted-foreground">
                            <div className="mb-6">
                                No activity yet. Connect your wallet to view your simulations, reallocations, and yield events.
                            </div>
                            <CustomConnectButton variant="outline" />
                        </div>
                    </>
                }
            </CardContent>
        </Card>
    )
}

export default Activity