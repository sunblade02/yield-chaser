import { contractABI } from "@/constants/contracts/account";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useWithdraw = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const withdraw = (accountAddress: `0x${string}` | undefined, usdcAmount: number, ethAmount: number) => {
        if (accountAddress) {
            writeContract({
                address: accountAddress,
                abi: contractABI,
                functionName: "withdraw",
                args: [ usdcAmount, ethAmount ]
            });
        }
    };

    return { error, isLoading: isLoading || isPending, isSuccess, withdraw };
};