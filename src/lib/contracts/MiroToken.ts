import Web3 from 'web3'
import MiroTokenABI from '../abis/MiroToken.json'

const miroTokenAddress = '0x3E80c2C8F4493F4c5f3593B5c2aAc1d625C5b648'

export const getMiroTokenContract = (web3: Web3) => {
  return new web3.eth.Contract(MiroTokenABI, miroTokenAddress)
}
