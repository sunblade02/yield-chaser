export interface EventType {
    eventName: string,
    transactionHash: string,
    blockNumber: bigint,
    order: number,
    args: {}
}