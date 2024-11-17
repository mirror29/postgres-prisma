import { HardhatUserConfig, task, vars } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and store it as the "INFURA_API_KEY"
// configuration variable
const INFURA_API_KEY = vars.get('INFURA_API_KEY')

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Store the private key as the "SEPOLIA_PRIVATE_KEY" configuration
// variable.
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = vars.get('SEPOLIA_PRIVATE_KEY')

const ETHERSCAN_API_KEY = vars.get('ETHERSCAN_API_KEY')

// task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners()

//   for (const account of accounts) {
//     console.log(account.address)
//   }
// })

const config: HardhatUserConfig = {
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  solidity: {
    version: '0.8.27',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 40000,
  },
}

export default config
