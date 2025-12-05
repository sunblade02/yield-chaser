import { contractABI } from "@/constants/contracts/account";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useDisableReallocation = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const disableReallocation = (accountAddress: `0x${string}` | undefined) => {
        if (accountAddress) {
            writeContract({
                address: accountAddress,
                abi: contractABI,
                functionName: "disableReallocation",
            });
        }
    };

    return { error, isLoading: isLoading || isPending, isSuccess, disableReallocation };
};