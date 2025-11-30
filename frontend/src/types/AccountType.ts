import { StrategyType } from "./StrategyType";
import { VaultType } from "./VaultType";

export interface AccountType {
    address: `0x${string}`|null,
    capitalUsdc: number,
    earnedUsdc: number,
    eth: number,
    yct: number,
    noReallocationPeriod: number,
    currentVault: `0x${string}`|null
    strategy: `0x${string}`|null
}