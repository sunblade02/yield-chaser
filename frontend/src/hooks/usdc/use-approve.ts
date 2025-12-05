import { contractAddress } from "@/constants/contracts/usdc";
import { contractABI } from "@/constants/contracts/ierc20";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useApprove = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess  } = useWaitForTransactionReceipt({ hash });

    const approve = (spender: `0x${string}` | undefined, amount: number) => {
        if (spender) {
            writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: "approve",
                args: [spender, amount],
            });
        }
    };

    return { error, isLoading: isLoading || isPending, isSuccess, approve };
};