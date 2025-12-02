"use client"

import Dashboard from "@/components/shared/Dashboard"
import { useAccounts } from "@/hooks/registry/useAccounts";
import { useRouter } from "next/navigation";
import { useEffect, } from "react";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi"

const DashboardPage = () => {
    const { isConnected, address } = useAccount();
    const router = useRouter();
    const { data: accountAddress, isLoading, isFetched } = useAccounts(address);

    const hasAccount = accountAddress && accountAddress !== zeroAddress;

    useEffect(() => {
        if (isConnected && isFetched && !hasAccount) {
            router.push("/create-account");
        }
    }, [isConnected, accountAddress, isFetched]);

    return (hasAccount ?
        <Dashboard isLoading={isLoading} accountAddress={accountAddress as string} />
    :
        <Dashboard isLoading={isLoading} />
    );
}

export default DashboardPage