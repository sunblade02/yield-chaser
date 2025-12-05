import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useUpdateStrategyVaultsNetAPY = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const updateStrategyVaultsNetAPY = (strategyAddress: `0x${string}` | undefined, vaults: string[], netAPYs: number[]) => {
        if (strategyAddress) {
            writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "updateStrategyVaultsNetAPY",
                args: [strategyAddress, vaults, netAPYs],
            });
        }
    };

    return { error, isLoading: isLoading || isPending, isSuccess, updateStrategyVaultsNetAPY };
};