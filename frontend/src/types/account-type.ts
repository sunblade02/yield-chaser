export interface AccountType {
    address: `0x${string}`|undefined,
    capitalUsdc: number,
    earnedUsdc: number,
    totalUsdc: number,
    eth: number,
    noReallocationPeriod: number,
    currentVault: `0x${string}`|null
    strategy: `0x${string}`|null
}