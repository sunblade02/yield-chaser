import { contractABI, contractAddress } from "@/constants/contracts/usdc";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useApprove = (spender: `0x${string}`, amount: number) => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess  } = useWaitForTransactionReceipt({ hash });

    const approve = () => {
        writeContract({
            address: contractAddress,
            abi: contractABI,
            functionName: "approve",
            args: [spender, amount],
        });
    };

    return { error, isLoading: isLoading || isPending, isSuccess, approve };
};