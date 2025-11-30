import { contractABI } from "@/constants/contracts/account";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useReallocate = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const reallocate = async (accountAddress: `0x${string}`) => {
        writeContract({
            address: accountAddress,
            abi: contractABI,
            functionName: "reallocate",
        });
    };

    return { error, isLoading: isLoading || isPending, isSuccess, reallocate };
};