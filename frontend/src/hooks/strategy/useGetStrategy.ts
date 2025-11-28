
import { contractABI as ivaultv2ContractABI } from "@/constants/contracts/ivaultv2";
import { contractABI as strategyContractABI } from "@/constants/contracts/strategy";
import { StrategyType } from "@/types/StrategyType";
import { VaultType } from "@/types/VaultType";
import { useReadContracts } from "wagmi";

export function useGetStrategy(contractAddress: any) {
    const { data: strategyData, isSuccess: strategyDataIsSuccess, isLoading: strategyDataIsLoading } = useReadContracts({
        contracts: [
            {
                address: contractAddress,
                abi: strategyContractABI,
                functionName: "getVaults",
            },
            {
                address: contractAddress,
                abi: strategyContractABI,
                functionName: "getBestVault",
            },
            {
                address: contractAddress,
                abi: strategyContractABI,
                functionName: "name",
            }
        ]
    });
    
    let strategy: StrategyType = {
        address: contractAddress as `0x${string}`,
        name: null,
        vaults: [],
        bestVaultIndex: null
    };

    let nameContracts: any[] = [];
    let tvlContracts: any[] = [];
    let netAPYContracts: any[] = [];
    let vaultAdresses = [];

    if (strategyDataIsSuccess) {
        vaultAdresses = strategyData[0].result as `0x${string}`[];

        nameContracts = vaultAdresses.map(vaultAddress => {
            let vault: VaultType = {
                address: vaultAddress
            };

            strategy.vaults.push(vault);

            return {
                address: vaultAddress,
                abi: ivaultv2ContractABI,
                functionName: "name"
            };
        });
        
        tvlContracts = vaultAdresses.map(vaultAddress => ({
            address: vaultAddress,
            abi: ivaultv2ContractABI,
            functionName: "_totalAssets",
        }));
        
        netAPYContracts = vaultAdresses.map(vaultAddress => ({
            address: contractAddress,
            abi: strategyContractABI,
            functionName: "vaults",
            args: [ vaultAddress ]
        }));

        for (let i = 0; i < strategy.vaults.length; i++) {
            if (strategy.vaults[i].address === (strategyData[1].result as `0x${string}`)) {
                strategy.bestVaultIndex = i;
                break;
            }
        }

        strategy.name = strategyData[2].result as string;
    }

    const { data: vaultNamesData, isSuccess: vaultNamesIsSuccess, isLoading: vaultNamesIsLoading } = useReadContracts({contracts: nameContracts});
    const { data: tvlData, isSuccess: tvlIsSuccess, isLoading: tvlIsLoading } = useReadContracts({contracts: tvlContracts});
    const { data: netAPYData, isSuccess: netAPYIsSuccess, isLoading: netAPYIsLoading } = useReadContracts({contracts: netAPYContracts});

    if (vaultNamesIsSuccess) {
        for (let i = 0; i < strategy.vaults.length; i++) {
            strategy.vaults[i].name = vaultNamesData?.[i]?.result as string;
        }
    }

    if (tvlIsSuccess) {
        for (let i = 0; i < strategy.vaults.length; i++) {
            strategy.vaults[i].tvl = tvlData?.[i]?.result as number;
        }
    }

    if (netAPYIsSuccess) {
        for (let i = 0; i < strategy.vaults.length; i++) {
            strategy.vaults[i].netAPY = netAPYData?.[i]?.result as number;
        }
    }

    return {
        data: strategy,
        isSuccess: strategyDataIsSuccess && vaultNamesIsSuccess && tvlIsSuccess && netAPYIsSuccess,
        isLoading: strategyDataIsLoading || vaultNamesIsLoading || tvlIsLoading || netAPYIsLoading
    };
}