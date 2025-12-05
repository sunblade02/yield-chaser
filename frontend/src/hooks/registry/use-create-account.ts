import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useCreateAccount = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const createAccount = (strategyAddress: `0x${string}` | undefined, usdcAmount: number, ethAmount: number) => {
        if (strategyAddress) {
            writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "createAccount",
                args: [strategyAddress, usdcAmount, 86400],
                value: BigInt(ethAmount),
            });
        }
    };

    return { error, isLoading: isLoading || isPending, isSuccess, createAccount };
};