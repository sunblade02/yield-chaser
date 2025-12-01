import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { useReadContract } from "wagmi";

export const useAccounts = (address: any) => {
    return useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "accounts",
        args: [ address ],
        query: {
            enabled: !!address
        }
    });
};