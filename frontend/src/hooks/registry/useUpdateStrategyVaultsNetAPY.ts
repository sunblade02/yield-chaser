import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useUpdateStrategyVaultsNetAPY = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const updateStrategyVaultsNetAPY = (strategy: `0x${string}`, vaults: string[], netAPYs: number[]) => {
        writeContract({
            address: contractAddress,
            abi: contractABI,
            functionName: "updateStrategyVaultsNetAPY",
            args: [strategy, vaults, netAPYs],
        });
    };

    return { error, isLoading: isLoading || isPending, isSuccess, updateStrategyVaultsNetAPY };
};