// import { HardhatRuntimeEnvironment } from 'hardhat/types'
// import { DeployFunction } from 'hardhat-deploy/types'
// import { ethers } from 'hardhat'
// import { Erc20 } from "../typechain"

// const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const { deployments, getNamedAccounts } = hre
//   const { deployer } = await getNamedAccounts();
//   const tokenDeployment = await deployments.get('PaycerToken')

//   const burnAmount = 416666;

//   const tokenContract = <Erc20>await ethers.getContractAt(
//     tokenDeployment.abi,
//     tokenDeployment.address
//   )

//   const mintTx = await tokenContract.mint(deployer, burnAmount)
//   console.log(mintTx, deployer, burnAmount)

//   const burnFromTx = await tokenContract.burnFrom(deployer, burnAmount)
//   console.log(burnFromTx, deployer, burnAmount)
// }

// export default func
// func.tags = ['BurnTokens']