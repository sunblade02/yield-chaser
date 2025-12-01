import { contractABI } from "@/constants/contracts/account";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useAllocate = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const allocate = (accountAddress: `0x${string}`, ethAmount: number) => {
        writeContract({
            address: accountAddress,
            abi: contractABI,
            functionName: "allocate",
            value: BigInt(ethAmount)
        });
    };

    return { error, isLoading: isLoading || isPending, isSuccess, allocate };
};