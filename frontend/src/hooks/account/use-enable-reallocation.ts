import { contractABI } from "@/constants/contracts/account";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useEnableReallocation = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const enableReallocation = (accountAddress: `0x${string}` | undefined) => {
        if (accountAddress) {
            writeContract({
                address: accountAddress,
                abi: contractABI,
                functionName: "enableReallocation",
            });
        }
    };

    return { error, isLoading: isLoading || isPending, isSuccess, enableReallocation };
};