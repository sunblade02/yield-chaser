"use client"

import CreateAccount from "@/components/shared/CreateAccount";
import Dashboard from "@/components/shared/Dashboard"
import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi"

const DashboardPage = () => {
    const { isConnected, address } = useAccount();

    const { data: accountAddress, refetch: accountRefetch } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "accounts",
        args: [ address ],
        query: {
            enabled: !!address
        }
    });

    const hasAccount = typeof accountAddress === "string" && accountAddress !== zeroAddress;

    return (hasAccount ?
        <Dashboard accountAddress={accountAddress} />
    :
        (!isConnected ?
            <Dashboard />
        :
            <CreateAccount accountRefetch={accountRefetch} />
        )
    );
}

export default DashboardPage