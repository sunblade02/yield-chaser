
import { contractABI as ivaultv2ContractABI } from "@/constants/contracts/ivaultv2";
import { contractABI as registryContractABI, contractAddress as registryContractAddress } from "@/constants/contracts/registry";
import { contractABI as strategyContractABI } from "@/constants/contracts/strategy";
import { StrategyType } from "@/types/StrategyType";
import { VaultType } from "@/types/VaultType";
import { useReadContract, useReadContracts } from "wagmi";

export function useGetStrategy(index: number) {
    let strategy: StrategyType = {
        address: null,
        name: null,
        vaults: [],
        bestVaultIndex: null
    };

    const { data: strategyAddress, isSuccess: strategiesIsSuccess, isLoading: strategiesIsLoading } = useReadContract({
        address: registryContractAddress,
        abi: registryContractABI,
        functionName: "strategies",
        args: [ index ]
    });

    if (strategiesIsSuccess) {
        strategy.address = (strategyAddress as  `0x${string}`);
    }

    const { data: strategyData, isSuccess: strategyDataIsSuccess, isLoading: strategyDataIsLoading } = useReadContracts({
        contracts: [
            {
                address: (strategyAddress as  `0x${string}`),
                abi: strategyContractABI,
                functionName: "getVaults",
            },
            {
                address: (strategyAddress as  `0x${string}`),
                abi: strategyContractABI,
                functionName: "getBestVault",
            },
            {
                address: (strategyAddress as  `0x${string}`),
                abi: strategyContractABI,
                functionName: "name",
            }
        ]
    });

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

    const { data: vaultNamesData, isSuccess: vaultNamesIsSucess, isLoading: vaultNamesIsLoading } = useReadContracts({contracts: nameContracts});
    const { data: tvlData, isSuccess: tvlIsSucess, isLoading: tvlIsLoading } = useReadContracts({contracts: tvlContracts});
    const { data: netAPYData, isSuccess: netAPYIsSucess, isLoading: netAPYIsLoading } = useReadContracts({contracts: netAPYContracts});

    if (vaultNamesIsSucess) {
        for (let i = 0; i < strategy.vaults.length; i++) {
            strategy.vaults[i].name = vaultNamesData?.[i]?.result as string;
        }
    }

    if (tvlIsSucess) {
        for (let i = 0; i < strategy.vaults.length; i++) {
            strategy.vaults[i].tvl = tvlData?.[i]?.result as number;
        }
    }

    if (netAPYIsSucess) {
        for (let i = 0; i < strategy.vaults.length; i++) {
            strategy.vaults[i].netAPY = netAPYData?.[i]?.result as number;
        }
    }

    return {
        data: strategy,
        isSuccess: strategiesIsSuccess && strategyDataIsSuccess && vaultNamesIsSucess && tvlIsSucess && netAPYIsSucess,
        isLoading: strategiesIsLoading || strategyDataIsLoading || vaultNamesIsLoading || tvlIsLoading || netAPYIsLoading
    };
}