const hre = require('hardhat')

async function main() {
  try {
    console.log('开始部署 MiroToken 合约...')
    const MiroToken = await hre.ethers.getContractFactory('MiroToken')
    const miro = await MiroToken.deploy()
    console.log('正在等待合约部署完成...')
    await miro.waitForDeployment()
    console.log('MiroToken 合约部署完成！')
    console.log('合约地址:', await miro.getAddress())
  } catch (error) {
    console.error('合约部署过程中出现错误:', error)
    throw error
  }
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
