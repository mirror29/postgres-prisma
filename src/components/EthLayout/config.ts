import { http, createConfig } from "wagmi";
import { mainnet, sepolia, base, zora, linea } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { type Chain } from "viem";

// Choose which chains you'd like to show
const chains = [sepolia, mainnet, linea, base, zora] as readonly [
  Chain,
  ...Chain[]
];

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains,
    transports: {
      // RPC URL for each chain
      [sepolia.id]: http(sepolia.rpcUrls.default.http[0]),
      [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
      [linea.id]: http(linea.rpcUrls.default.http[0]),
      [base.id]: http(base.rpcUrls.default.http[0]),
      [zora.id]: http(zora.rpcUrls.default.http[0]),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
      "3a8170812b534d0ff9d794f19a901d64",

    // Required App Info
    appName: "Your App Name",

    // Optional App Info
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);
