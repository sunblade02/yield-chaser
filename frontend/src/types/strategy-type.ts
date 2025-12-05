import { VaultType } from "./vault-type";

export interface StrategyType {
    address: `0x${string}`|null,
    name: string|null,
    vaults: VaultType[],
    bestVaultIndex: number|null,
}