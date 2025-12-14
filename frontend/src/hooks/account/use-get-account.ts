import { contractABI as accountContractABI } from "@/constants/contracts/account";
import { contractAddress as registryContractAddress, contractABI as registryContractABI } from "@/constants/contracts/registry";
import { useBalance, useReadContract, useReadContracts } from "wagmi";
import { AccountType } from "@/types/account-type";
import { useGetAccount as registryUseGetAccount } from "../registry/use-get-account";
import { zeroAddress } from "viem";

export const useGetAccount = () => {
    let isLoading = false;
    let isFetched = true;
    let isSuccess = true;
    let isError = true;
    const errors = [];

    let readContractData = registryUseGetAccount();
    const getAccountRefetch = readContractData.refetch;
    const enabled = (readContractData.data as any)?.[1];
    let accountAddress = (readContractData.data as any)?.[0] ? (readContractData.data as any)?.[0] : undefined;
    if (enabled === false) {
        accountAddress = zeroAddress;
    }
    isLoading = isLoading || readContractData.isLoading;
    isFetched = isFetched && readContractData.isFetched;
    isSuccess = isSuccess && readContractData.isSuccess;
    isError = isError && readContractData.isError;
    if (readContractData.isError) {
        errors.push(readContractData.error);
    }

    readContractData = useReadContract({
        address: registryContractAddress,
        abi: registryContractABI,
        functionName: "usdcYieldFeeRate",
    });
    const usdcYieldFeeRate = readContractData.data;
    isLoading = isLoading || readContractData.isLoading;
    isFetched = isFetched && readContractData.isFetched;
    isSuccess = isSuccess && readContractData.isSuccess;
    isError = isError && readContractData.isError;
    if (readContractData.isError) {
        errors.push(readContractData.error);
    }
    const readContractsData = useReadContracts({
        contracts: [{
            address: accountAddress ? accountAddress as `0x${string}` : undefined,
            abi: accountContractABI,
            functionName: "currentVault",
        }, {
            address: accountAddress ? accountAddress as `0x${string}` : undefined,
            abi: accountContractABI,
            functionName: "strategy",
        }, {
            address: accountAddress ? accountAddress as `0x${string}` : undefined,
            abi: accountContractABI,
            functionName: "capital",
        }, {
            address: accountAddress ? accountAddress as `0x${string}` : undefined,
            abi: accountContractABI,
            functionName: "depositAmount",
        }, {
            address: accountAddress ? accountAddress as `0x${string}` : undefined,
            abi: accountContractABI,
            functionName: "getUsdcBalance",
        }],
        query: {
            enabled: !!accountAddress,
        }
    })
    const accountRefetch = readContractsData.refetch;
    const currentVaultAddress = readContractsData.data?.[0].result ? readContractsData.data?.[0].result : undefined;
    const strategyAddress = readContractsData.data?.[1].result ? readContractsData.data?.[1].result : undefined;
    const capital = readContractsData.data?.[2].result ? readContractsData.data?.[2].result : undefined;
    const depositAmount = readContractsData.data?.[3].result ? readContractsData.data?.[3].result : undefined;
    const result = readContractsData.data?.[4].result as any[] | undefined;
    const [ usdcBalance, assets ] = result ?? [ undefined, undefined ];
    isLoading = isLoading || readContractsData.isLoading;
    isFetched = isFetched && readContractsData.isFetched;
    isSuccess = isSuccess && readContractsData.isSuccess;
    isError = isError && readContractsData.isError;
    if (readContractsData.isError) {
        errors.push(readContractsData.error);
    }

    let dataBalance = useBalance({
        address: accountAddress ? accountAddress as `0x${string}` : undefined,
        query: {
            enabled: !!accountAddress
        }
    });
    const ethBalanceRefetch = dataBalance.refetch;
    const ethBalance = dataBalance.data?.value;
    isLoading = isLoading || dataBalance.isLoading;
    isFetched = isFetched && dataBalance.isFetched;
    isSuccess = isSuccess && dataBalance.isSuccess;
    isError = isError && dataBalance.isError;
    if (dataBalance.isError) {
        errors.push(dataBalance.error);
    }

    const capitalUsdc = (usdcBalance ? Number(usdcBalance) : 0) + (capital ? Number(capital) : 0);
    const usdcFee = ((assets ? Number(assets) : 0) - (depositAmount ? Number(depositAmount) : 0)) * (usdcYieldFeeRate ? Number(usdcYieldFeeRate) : 0) / 10**5;
    const earnedUsdc = (assets ? Number(assets) : 0) - (capital ? Number(capital) : 0) - usdcFee;
    const totalUsdc = (usdcBalance ? Number(usdcBalance) : 0) + (assets ? Number(assets) : 0);
    
    const account: AccountType = {
        address: accountAddress ? accountAddress as `0x${string}` : undefined,
        capitalUsdc: capitalUsdc,
        earnedUsdc: earnedUsdc,
        totalUsdc: totalUsdc,
        eth: ethBalance ? Number(ethBalance) : 0,
        currentVault: currentVaultAddress ? currentVaultAddress as `0x${string}` : null,
        strategy: strategyAddress ? strategyAddress as `0x${string}` : null,
    };

    const refetch = () => {
        accountRefetch();
        ethBalanceRefetch();
    }

    return {
        account,
        isLoading,
        isSuccess,
        isFetched,
        isError,
        errors,
        refetch,
        getAccountRefetch
    };
};