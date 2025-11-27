"use client"

import '@rainbow-me/rainbowkit/styles.css';
import {
    darkTheme,
    getDefaultConfig,
    lightTheme,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    hardhat, sepolia
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from 'react';
import CustomAvatar from '@/components/shared/RainbowKit/CustomAvatar';
import { useTheme } from 'next-themes';

const PROJECT_ID = process.env.NEXT_PUBLIC_WAGMI_PROVIDER_PROJECT_ID || "";
const config = getDefaultConfig({
    appName: 'Yield Chaser',
    projectId: PROJECT_ID,
    chains: [hardhat],
    ssr: false,
});

const queryClient = new QueryClient();
const CustomRainbowKitProvider = ({children}: {children: ReactNode}) => {
    const { theme, systemTheme } = useTheme();
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return null;
    }

    const effectiveTheme = theme === "system" ? systemTheme ?? "light" : theme;

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider 
                    locale="en"
                    avatar={CustomAvatar}
                    modalSize="compact"
                    theme={effectiveTheme === 'dark' ? darkTheme({
                        borderRadius: 'small',
                        fontStack: 'system',
                    }) : lightTheme({
                        borderRadius: 'small',
                        fontStack: 'system',
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default CustomRainbowKitProvider;