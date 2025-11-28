export function formatAddress(address: string): string {
    const start = address.slice(0, 4);
    const end = address.slice(-4);
    return `${start}...${end}`;
}

export function readableNumber(balance: any, decimals: number) {
    balance = balance ? Number(balance) : 0;
    return (balance / 10**decimals).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals })
}