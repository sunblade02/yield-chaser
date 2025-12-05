
import { contractABI } from "@/constants/contracts/mocks/mockMorphoVault";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const useIncAssets = () => {
    const {data: hash, isPending, error, writeContract} = useWriteContract({});
    const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

    const incAssets = async (vaultAddress: `0x${string}` | undefined, amount: number) => {
        if (vaultAddress) {
            writeContract({
                address: vaultAddress,
                abi: contractABI,
                functionName: "incAssets",
                args: [amount],
            });
        }
    };

    return { error, isLoading: isLoading || isPending, isSuccess, incAssets };
};