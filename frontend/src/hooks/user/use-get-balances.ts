import { contractAddress } from "@/constants/contracts/usdc";
import { useAccount, useBalance } from "wagmi";

export const useGetBalances = () => {
    const { isConnected, address } = useAccount();

    const { data: usdc, isSuccess: usdcBalanceIsSuccess, isLoading: usdcBalanceIsLoading } = useBalance({
        address,
        token: contractAddress,
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

    const usdcBalance = usdc?.value ? Number(usdc.value) : undefined;
    const ethBalance = eth?.value ? Number(eth.value) : undefined;

    return {
        isConnected,
        address,
        usdcBalance,
        ethBalance,
        isSuccess: usdcBalanceIsSuccess && ethIsSuccess,
        isLoading: usdcBalanceIsLoading || ethIsLoading
    };
}