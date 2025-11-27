import { contractABI, contractAddress } from "@/constants/contracts/registry";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useCreateAccount = (strategy: `0x${string}`, usdcAmount: number, ethAmount: number) => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const createAccount = async () => {
        writeContract({
            address: contractAddress,
            abi: contractABI,
            functionName: "createAccount",
            args: [strategy, usdcAmount],
            value: BigInt(ethAmount),
        });
    };

    return { error, isLoading: isLoading || isPending, isSuccess, createAccount };
};