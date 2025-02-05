import { ethers } from "hardhat";

async function main() {
    const MiroToken = await ethers.getContractFactory("MiroToken");
    const miroToken = await MiroToken.deploy(1000000); // 初始供应量为100万个代币
    await miroToken.deployed();
    console.log("MiroToken deployed to:", miroToken.address);
  }

  main()
   .then(() => process.exit(0))
   .catch(error => {
      console.error(error);
      process.exit(1);
    });
