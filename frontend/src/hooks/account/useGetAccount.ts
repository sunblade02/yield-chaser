import { contractABI as accountContractABI } from "@/constants/contracts/account";
import { contractABI as ivaultv2ContractABI } from "@/constants/contracts/ivaultv2";
import { contractAddress as yctContractAddress, contractABI as yctContractABI } from "@/constants/contracts/yct";
import { contractAddress as usdcContractAddress, contractABI as usdcContractABI } from "@/constants/contracts/usdc";
import { useBalance, useReadContract } from "wagmi";
import { AccountType } from "@/types/AccountType";

export const useGetAccount = (contractAddress: any) => {
    const {data: currentVaultAddress, isLoading: currentVaultAddressIsLoading, isSuccess: currentVaultAddressIsSuccess} = useReadContract({
        address: contractAddress,
        abi: accountContractABI,
        functionName: "currentVault",
        query: {
            enabled: !!contractAddress
        }
    });

    const {data: strategyAddress, isLoading: strategyAddressIsLoading, isSuccess: strategyAddressIsSuccess} = useReadContract({
        address: contractAddress,
        abi: accountContractABI,
        functionName: "strategy",
        query: {
            enabled: !!contractAddress
        }
    });

    const {data: shares, isLoading: sharesIsLoading, isSuccess: sharesIsSuccess} = useReadContract({
        address: currentVaultAddress as `0x${string}`,
        abi: ivaultv2ContractABI,
        functionName: "balanceOf",
        args: [contractAddress],
        query: {
            enabled: !!currentVaultAddress
        }
    });

    const {data: assets, isLoading: assetsIsLoading, isSuccess: assetsIsSuccess} = useReadContract({
        address: currentVaultAddress as `0x${string}`,
        abi: ivaultv2ContractABI,
        functionName: "previewRedeem",
        args: [shares],
        query: {
            enabled: !!currentVaultAddress && !!shares
        }
    });

    const {data: usdcBalance, isLoading: usdcBalanceIsLoading, isSuccess: usdcBalanceIsSuccess} = useReadContract({
        address: usdcContractAddress,
        abi: usdcContractABI,
        functionName: "balanceOf",
        args: [contractAddress],
        query: {
            enabled: !!contractAddress
        }
    });

    const {data: yctBalance, isLoading: yctBalanceIsLoading, isSuccess: yctBalanceIsSuccess} = useReadContract({
        address: yctContractAddress,
        abi: yctContractABI,
        functionName: "balanceOf",
        args: [contractAddress],
        query: {
            enabled: !!contractAddress
        }
    });

    const { data: eth, isLoading: ethIsLoading, isSuccess: ethIsSuccess } = useBalance({
        address: contractAddress,
        query: {
            enabled: !!contractAddress
        }
    });

    const totalUsdc = (usdcBalance ? Number(usdcBalance) : 0) + (assets ? Number(assets) : 0);

    let account: AccountType = {
        usdc: totalUsdc,
        yct: yctBalance ? Number(yctBalance) : 0,
        eth: eth?.value ? Number(eth?.value) : 0,
        currentVault: currentVaultAddress ? currentVaultAddress as `0x${string}` : null,
        strategy: strategyAddress ? strategyAddress as `0x${string}` : null,
    };

    return {
        data: account,
        isLoading: currentVaultAddressIsLoading || strategyAddressIsLoading || sharesIsLoading || assetsIsLoading || usdcBalanceIsLoading 
            || yctBalanceIsLoading || ethIsLoading,
        isSuccess: currentVaultAddressIsSuccess && strategyAddressIsSuccess && sharesIsSuccess && assetsIsSuccess && usdcBalanceIsSuccess
            && yctBalanceIsSuccess && ethIsSuccess
    };
};