require('@solana/wallet-adapter-react-ui/styles.css')
require('../styles/globals.css')
import { createConfig, WagmiProvider } from 'wagmi'
import { sepolia } from 'viem/chains'
import { createClient, http } from 'viem'

// const config = createConfig({
//   chains: [sepolia],
//   transports: {
//     [sepolia.id]: http('https://sepolia.infura.io/v3/f86cbf12c3a34d849824e541f18ee773'),
//   },
// })

export default function App({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || (page => page)

  // return <WagmiProvider config={config}>{getLayout(<Component {...pageProps} />)}</WagmiProvider>
  return getLayout(<Component {...pageProps} />)
}
