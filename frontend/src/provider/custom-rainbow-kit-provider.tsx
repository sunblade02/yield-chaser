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
    hardhat
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from 'react';
import CustomAvatar from '@/components/shared/rainbow-kit/custom-avatar';
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
    const { resolvedTheme } = useTheme();
    const [ theme, setTheme ] = useState("system");

    useEffect(() => {
        if (resolvedTheme) {
            setTheme(resolvedTheme);
        }
    }, [resolvedTheme]);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider 
                    locale="en"
                    avatar={CustomAvatar}
                    modalSize="compact"
                    theme={theme === 'dark' ? darkTheme({
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