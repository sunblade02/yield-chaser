
import { contractABI } from "@/constants/contracts/account";
import { useReadContract } from "wagmi";

export const useIsReallocationEnabled = (accountAddress: `0x${string}` | undefined) => {
    return useReadContract({
        address: accountAddress,
        abi: contractABI,
        functionName: "isReallocationEnabled",
        query: {
            enabled: !!accountAddress
        }
    });
};