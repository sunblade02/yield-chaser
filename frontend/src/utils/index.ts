export function formatAddress(address: string): string {
    const start = address.slice(0, 4);
    const end = address.slice(-4);
    return `${start}...${end}`;
}

export function readableNumber(balance: any, decimals: number, maximumFractionDigits?: number) {
    balance = balance ? Number(balance) : 0;
    return (balance / 10**decimals).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maximumFractionDigits ?? decimals })
}

export function readableTimestamp(timestamp: number, singular?: boolean) {
    let units = timestamp / 86400;
    let timeUnit = "day";

    if (units % 7 === 0) {
        units /= 7;
        timeUnit = "week";
    }

    if (!singular || units > 1) {
        timeUnit += "s";
    }

    return {
        units,
        timeUnit,
    };
}