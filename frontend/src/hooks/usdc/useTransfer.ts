import { contractABI, contractAddress } from "@/constants/contracts/usdc";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useTransfer = () => {
    const { data: hash, isPending, error, writeContract } = useWriteContract({});
    const { isLoading, isSuccess  } = useWaitForTransactionReceipt({ hash });

    const transfer = (to: `0x${string}`, value: number) => {
        writeContract({
            address: contractAddress,
            abi: contractABI,
            functionName: "transfer",
            args: [to, value],
        });
    };

    return { error, isLoading: isLoading || isPending, isSuccess, transfer };
};