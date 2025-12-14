
import { contractABI as ivaultv2ContractABI } from "@/constants/contracts/ivaultv2";
import { contractABI as strategyContractABI } from "@/constants/contracts/strategy";
import { StrategyType } from "@/types/strategy-type";
import { VaultType } from "@/types/vault-type";
import { useReadContracts } from "wagmi";

export function useGetStrategy(strategyAddress:  `0x${string}` | undefined) {
    console.log(strategyAddress);
    const { data: strategyData, isSuccess: strategyDataIsSuccess, isLoading: strategyDataIsLoading } = useReadContracts({
        contracts: [
            {
                address: strategyAddress,
                abi: strategyContractABI,
                functionName: "getVaults",
            },
            {
                address: strategyAddress,
                abi: strategyContractABI,
                functionName: "getBestVault",
            },
            {
                address: strategyAddress,
                abi: strategyContractABI,
                functionName: "name",
            }
        ],
        query: {
            enabled: !!strategyAddress
        }
    });
    
    let strategy: StrategyType = {
        address: strategyAddress as `0x${string}`,
        name: null,
        vaults: [],
        bestVaultIndex: null
    };

    let nameContracts: any[] = [];
    let tvlContracts: any[] = [];
    let netAPYContracts: any[] = [];
    let vaultAdresses = [];

    if (strategyData !== undefined) {
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
            address: strategyAddress,
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

    if (vaultNamesData !== undefined) {
        for (let i = 0; i < strategy.vaults.length; i++) {
            strategy.vaults[i].name = vaultNamesData[i].result as string;
        }
    }

    if (tvlData !== undefined) {
        for (let i = 0; i < strategy.vaults.length; i++) {
            strategy.vaults[i].tvl = tvlData[i].result as number;
        }
    }

    if (netAPYData) {
        for (let i = 0; i < strategy.vaults.length; i++) {
            strategy.vaults[i].netAPY = netAPYData[i].result as number;
        }
    }

    return {
        data: strategy,
        isSuccess: strategyDataIsSuccess && vaultNamesIsSuccess && tvlIsSuccess && netAPYIsSuccess,
        isLoading: strategyDataIsLoading || vaultNamesIsLoading || tvlIsLoading || netAPYIsLoading
    };
}