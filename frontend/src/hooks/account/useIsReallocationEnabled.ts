
import { contractABI } from "@/constants/contracts/account";
import { useReadContract } from "wagmi";

export const useIsReallocationEnabled = (address: any) => {
    return useReadContract({
        address: address,
        abi: contractABI,
        functionName: "isReallocationEnabled",
    });
};