import { contractABI } from "@/constants/contracts/account";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useClose = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const close = (accountAddress: `0x${string}` | undefined) => {
        if (accountAddress) {
            writeContract({
                address: accountAddress,
                abi: contractABI,
                functionName: "close",
            });
        }
    };

    return { error, isLoading: isLoading || isPending, isSuccess, close };
};