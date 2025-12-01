"use client"

import Dashboard from "@/components/shared/Dashboard"
import { useAccounts } from "@/hooks/registry/useAccounts";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi"

const DashboardPage = () => {
    const { isConnected, address } = useAccount();

    const { data: accountAddress, isSuccess: accountsIsSuccess, isLoading } = useAccounts(address);

    const hasAccount = typeof accountAddress === "string" && accountAddress !== zeroAddress;

    return (hasAccount ?
        <Dashboard isLoading={isLoading} accountAddress={accountAddress} />
    :
        <Dashboard isLoading={isLoading} />
    );
}

export default DashboardPage