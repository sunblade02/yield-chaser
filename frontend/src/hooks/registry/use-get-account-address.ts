import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { useAccount, useReadContract } from "wagmi";

export const useGetAccountAddress = () => {
    const { address: userAddress } = useAccount();

    return useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "accounts",
        args: [ userAddress ],
        query: {
            enabled: !!userAddress
        }
    });
};