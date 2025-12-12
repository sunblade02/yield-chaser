
import { contractABI } from "@/constants/contracts/account";
import { useReadContract } from "wagmi";

export const useNoReallocationPeriod = (accountAddress: `0x${string}` | undefined) => {
    return useReadContract({
        address: accountAddress,
        abi: contractABI,
        functionName: "noReallocationPeriod",
        query: {
            enabled: !!accountAddress
        }
    });
};