"use client"

import { useGetAccount } from "@/hooks/account/use-get-account";
import { AccountType } from "@/types/account-type";
import { EventType } from "@/types/event-type";
import { publicClient } from "@/utils/client";
import { createContext, useContext, useState } from "react";
import { parseAbiItem, zeroAddress } from "viem";
import { contractAddress as registryContractAddress } from "@/constants/contracts/registry";
import { useAccount } from "wagmi";
import { contractAddress as usdcAddress } from "@/constants/contracts/usdc";

interface YcAccountContextType {
    account: AccountType | undefined;
    hasAccount: boolean | undefined;
    isLoading: boolean, 
    isSuccess: boolean, 
    isFetched: boolean, 
    isError: boolean, 
    errors: any[],
    events: EventType[],
    fetchEvents: () => void,
    refetch: () => void,
    getAccountRefetch: () => void,
}

const YcAccountContext = createContext<YcAccountContextType | undefined>(undefined);

const DEPLOYMENT_BLOCK = process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK || "0";
const deploymentBlock = BigInt(DEPLOYMENT_BLOCK);

export const YcAccountProvider = ({ 
    children 
} : { 
    children: React.ReactNode 
}) => {
    const { address: userAddress } = useAccount();

    const [ events, setEvents ] = useState<EventType[]>([]);

    const { account, isLoading, isSuccess, isFetched, isError, errors, refetch, getAccountRefetch } = useGetAccount();

    const hasAccount = account?.address && account.address !== zeroAddress;

    const fetchEvents = async () => {
        if (account?.address) {
            let events: EventType[] = [];

            const registryLogs = await publicClient.getLogs({
                address: registryContractAddress,
                event: parseAbiItem("event AccountCreated(address indexed owner, address strategy, uint usdcAmount, uint ethAmount)"),
                fromBlock: deploymentBlock,
                toBlock: 'latest',
                args: {
                    owner: userAddress
                },
            });
            events = events.concat(registryLogs.map(log => ({
                eventName: log.eventName,
                transactionHash: log.transactionHash,
                blockNumber: log.blockNumber,
                order: 0,
                args: log.args ?? {}
            })));

            const usdcToLogs = await publicClient.getLogs({
                address: usdcAddress,
                event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)"),
                fromBlock: deploymentBlock,
                toBlock: 'latest',
                args: {
                    from: userAddress,
                    to: account.address
                },
            });
            events = events.concat(usdcToLogs.map(log => ({
                eventName: "USDCReceived",
                transactionHash: log.transactionHash,
                blockNumber: log.blockNumber,
                order: 1,
                args: log.args ?? {}
            })));

            const usdcFromLogs = await publicClient.getLogs({
                address: usdcAddress,
                event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)"),
                fromBlock: deploymentBlock,
                toBlock: 'latest',
                args: {
                    from: account.address,
                    to: userAddress
                },
            });
            events = events.concat(usdcFromLogs.map(log => ({
                eventName: "USDCWithdrawn",
                transactionHash: log.transactionHash,
                blockNumber: log.blockNumber,
                order: 1,
                args: log.args ?? {}
            })));

            const accountLogs = await publicClient.getLogs({
                address: account.address,
                events: [
                    parseAbiItem("event ETHReceived(address sender, uint amount)"),
                    parseAbiItem("event USDCDisallocated(uint amount, address vault)"),
                    parseAbiItem("event USDCAllocated(uint amount, address vault)"),
                    parseAbiItem("event ReallocationEnabled()"),
                    parseAbiItem("event ReallocationDisabled()"),
                    parseAbiItem("event ETHWithdrawn(uint amount)"),
                ],
                fromBlock: deploymentBlock,
                toBlock: 'latest'
            });
            events = events.concat(accountLogs.map(log => ({
                eventName: log.eventName,
                transactionHash: log.transactionHash,
                blockNumber: log.blockNumber,
                order: 1,
                args: log.args ?? {}
            })));

            events = events.sort((a, b) => {
                if (a.blockNumber !== b.blockNumber) {
                    return Number(b.blockNumber) - Number(a.blockNumber);
                }
                return b.order - a.order;
            });

            setEvents(events);
        }
    };

    return (
        <YcAccountContext.Provider value={{
                account,
                hasAccount,
                isLoading, 
                isSuccess, 
                isFetched, 
                isError, 
                errors,
                events,
                fetchEvents,
                refetch,
                getAccountRefetch
            }}>
            {children}
        </YcAccountContext.Provider>
    );
}

export const useYcAccount = () => {
    const context = useContext(YcAccountContext)
    if (!context) {
        throw new Error("useYcAccount must be used within an YcAccountContext")
    }
    return context;
}