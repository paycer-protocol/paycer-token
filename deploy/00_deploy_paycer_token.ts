import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts();

  const decimals = 18;
  const totalSupply = ethers.utils.parseUnits('750000000', decimals);

  await deploy('PaycerToken', {
    from: deployer,
    args: [totalSupply],
    log: true,
  })
}

export default func
func.tags = ['PaycerToken']
