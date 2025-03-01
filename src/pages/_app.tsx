require('@solana/wallet-adapter-react-ui/styles.css')
require('../styles/globals.css')
// import { createConfig, WagmiProvider, http } from 'wagmi'
// import { sepolia } from 'viem/chains'

// const config = createConfig({
//   chains: [sepolia],
//   transports: {
//     [sepolia.id]: http('/api/rpc-proxy'),
//   },
// })

export default function App({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || (page => page)

  return getLayout(
    // <WagmiProvider config={config}>
      <Component {...pageProps} />
    // </WagmiProvider>
  )
}
