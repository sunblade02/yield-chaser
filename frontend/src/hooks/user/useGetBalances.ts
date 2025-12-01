import { contractABI, contractAddress } from "@/constants/contracts/usdc";
import { useAccount, useBalance, useReadContract } from "wagmi";

export const useGetBalances = () => {
    const { isConnected, address } = useAccount();

    const { data: usdcBalance, isSuccess: usdcBalanceIsSuccess, isLoading: usdcBalanceIsLoading } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "balanceOf",
        args: [ address ],
        query: {
            enabled: isConnected
        }
    });

    const { data: eth, isSuccess: ethIsSuccess, isLoading: ethIsLoading } = useBalance({
        address,
        query: {
            enabled: isConnected
        }
    });

    return {
        isConnected,
        address,
        usdcBalance,
        eth,
        isSuccess: usdcBalanceIsSuccess && ethIsSuccess,
        isLoading: usdcBalanceIsLoading || ethIsLoading
    };
}