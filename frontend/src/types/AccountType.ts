import { StrategyType } from "./StrategyType";
import { VaultType } from "./VaultType";

export interface AccountType {
    usdc: number,
    eth: number,
    yct: number,
    currentVault: `0x${string}`|null
    strategy: `0x${string}`|null
}