import { contractABI } from "@/constants/contracts/account";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useSetNoReallocationPeriod = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const setNoReallocationPeriod = (accountAddress: `0x${string}` | undefined, noReallocationPeriod: number) => {
        if (accountAddress) {
            writeContract({
                address: accountAddress,
                abi: contractABI,
                functionName: "setNoReallocationPeriod",
                args: [noReallocationPeriod],
            });
        }
    };

    return { error, isLoading: isLoading || isPending, isSuccess, setNoReallocationPeriod };
};