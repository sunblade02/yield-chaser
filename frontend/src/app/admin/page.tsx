"use client"

import Admin from "@/components/shared/Admin";
import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { zeroHash } from "viem";
import { useAccount, useReadContract } from "wagmi"

const DashboardPage = () => {
    const { address } = useAccount();
    const adminRole = zeroHash;

    const {data: isAdmin} = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "hasRole",
        args: [ adminRole, address ],
        query: {
            enabled: !!address
        }
    });

    return (
        <>
            {isAdmin &&
                <Admin />
            }
        </>
    );
}

export default DashboardPage