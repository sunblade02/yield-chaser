import { contractABI as accountContractABI } from "@/constants/contracts/account";
import { contractABI as ivaultv2ContractABI } from "@/constants/contracts/ivaultv2";
import { contractAddress as registryContractAddress, contractABI as registryContractABI } from "@/constants/contracts/registry";
import { contractAddress as yctContractAddress, contractABI as yctContractABI } from "@/constants/contracts/yct";
import { contractAddress as usdcContractAddress, contractABI as usdcContractABI } from "@/constants/contracts/usdc";
import { useBalance, useReadContract } from "wagmi";
import { AccountType } from "@/types/AccountType";

export const useGetAccount = (contractAddress: any) => {
    const {data: usdcYieldFeeRate, isLoading: usdcYieldFeeRateIsLoading, isSuccess: usdcYieldFeeRateIsSuccess} = useReadContract({
        address: registryContractAddress,
        abi: registryContractABI,
        functionName: "usdcYieldFeeRate",
        query: {
            enabled: !!contractAddress
        }
    });
    
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

    const {data: noReallocationPeriod, isLoading: noReallocationPeriodIsLoading, isSuccess: noReallocationPeriodIsSuccess} = useReadContract({
        address: contractAddress,
        abi: accountContractABI,
        functionName: "noReallocationPeriod",
        query: {
            enabled: !!contractAddress
        }
    });

    const {data: shares, isLoading: sharesIsLoading, isSuccess: sharesIsSuccess, error} = useReadContract({
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
            enabled: sharesIsSuccess
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

    const {data: capital, isLoading: capitalIsLoading, isSuccess: capitalIsSuccess} = useReadContract({
        address: contractAddress,
        abi: accountContractABI,
        functionName: "capital",
        query: {
            enabled: !!contractAddress
        }
    });

    const {data: depositAmount, isLoading: depositAmountIsLoading, isSuccess: depositAmountIsSuccess} = useReadContract({
        address: contractAddress,
        abi: accountContractABI,
        functionName: "depositAmount",
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

    const capitalUsdc = (usdcBalance ? Number(usdcBalance) : 0) + (capital ? Number(capital) : 0);
    const usdcFee = ((assets ? Number(assets) : 0) - (depositAmount ? Number(depositAmount) : 0)) * (usdcYieldFeeRate ? Number(usdcYieldFeeRate) : 0) / 10**5;
    const earnedUsdc = (assets ? Number(assets) : 0) - (capital ? Number(capital) : 0) - usdcFee;
    
    let account: AccountType = {
        address: contractAddress,
        capitalUsdc: capitalUsdc,
        earnedUsdc: earnedUsdc,
        yct: yctBalance ? Number(yctBalance) : 0,
        eth: eth?.value ? Number(eth?.value) : 0,
        noReallocationPeriod: noReallocationPeriod ? Number(noReallocationPeriod) : 0,
        currentVault: currentVaultAddress ? currentVaultAddress as `0x${string}` : null,
        strategy: strategyAddress ? strategyAddress as `0x${string}` : null,
    };

    return {
        data: account,
        isLoading: currentVaultAddressIsLoading || strategyAddressIsLoading || sharesIsLoading || assetsIsLoading || usdcBalanceIsLoading 
            || yctBalanceIsLoading || ethIsLoading || noReallocationPeriodIsLoading || capitalIsLoading || depositAmountIsLoading
            || usdcYieldFeeRateIsLoading,
        isSuccess: currentVaultAddressIsSuccess && strategyAddressIsSuccess && sharesIsSuccess && assetsIsSuccess && usdcBalanceIsSuccess
            && yctBalanceIsSuccess && ethIsSuccess && noReallocationPeriodIsSuccess && capitalIsSuccess && depositAmountIsSuccess
            && usdcYieldFeeRateIsSuccess
    };
};