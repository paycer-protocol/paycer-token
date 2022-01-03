import { ethers, deployments } from 'hardhat'
import { solidity } from "ethereum-waffle";
import chai from 'chai'

chai.use(solidity);
import { expect } from 'chai'

describe('PaycerToken', function () {
  before(async function () {
    this.signers = await ethers.getSigners()
    this.owner = this.signers[0]
    this.address1 = this.signers[1]
    this.address2 = this.signers[2]
    this.initialSupply = ethers.utils.parseUnits('1000000', 18)
    this.totalSupply = ethers.utils.parseUnits('750000000', 18)
  })

  beforeEach(async function () {
    await deployments.fixture(['PaycerToken'])
    const tokenFixture = await deployments.get('PaycerToken')

    this.paycer = await ethers.getContractAt(
      tokenFixture.abi, 
      tokenFixture.address
    )

    await this.paycer.mint(this.owner.address, this.initialSupply)
  })

  it('should have correct name, symbol, decimal and total supply', async function () {
    expect(await this.paycer.name()).to.equal('Paycer')
    expect(await this.paycer.symbol()).to.equal('PCR')
    expect(await this.paycer.decimals()).to.equal(18)
    expect(await this.paycer.totalSupply()).to.equal(this.initialSupply)
    expect(await this.paycer.cap()).to.equal(this.totalSupply)
  })

  it('should allow owner to mint token', async function () {
    const amountToMint = ethers.utils.parseUnits('1000', 18)

    await this.paycer.mint(this.owner.address, amountToMint)
    await this.paycer.mint(this.address1.address, amountToMint)

    const address1 = await this.paycer.connect(this.address1);
    await expect(address1.mint(this.address2.address, amountToMint)).to.be.revertedWith('Ownable: caller is not the owner')

    const totalSupply = await this.paycer.totalSupply()
    const balanceOfOwner = await this.paycer.balanceOf(this.owner.address)
    const balanceOfAddress1 = await this.paycer.balanceOf(this.address1.address)
    const balanceOfAddress2 = await this.paycer.balanceOf(this.address2.address)

    expect(totalSupply).to.equal(ethers.utils.parseUnits('1002000', 18))
    expect(balanceOfOwner).to.equal(ethers.utils.parseUnits('1001000', 18))
    expect(balanceOfAddress1).to.equal(ethers.utils.parseUnits('1000', 18))
    expect(balanceOfAddress2).to.equal(ethers.utils.parseUnits('0', 18))
  })

  it('should not allow others to mint token', async function () {
    const address1 = await this.paycer.connect(this.address1)
    const address2 = await this.paycer.connect(this.address2)

    await expect(address1.mint(this.address1.address, 1000)).to.be.revertedWith('Ownable: caller is not the owner')
    await expect(address2.mint(this.address2.address, 1000)).to.be.revertedWith('Ownable: caller is not the owner')
    await expect(address1.mint(this.address2.address, 1000)).to.be.revertedWith('Ownable: caller is not the owner')
    await expect(address2.mint(this.address1.address, 1000)).to.be.revertedWith('Ownable: caller is not the owner')
  })
  
  it('should not allow owner to mint more tokens if supply is exceeded', async function () {
    const owner = await this.paycer.connect(this.owner)
    await expect(owner.mint(owner.address, ethers.utils.parseUnits('800000000', 18))).to.be.revertedWith('ERC20Capped: cap exceeded')
  })

  it('Should transfer tokens between accounts', async function () {
    const owner = await this.paycer.connect(this.owner)

    await owner.transfer(this.address1.address, 100)
    const balanceOfAddress1 = await this.paycer.balanceOf(this.address1.address)
    expect((balanceOfAddress1).toNumber()).to.equal(100)

    await owner.transfer(this.address2.address, 100)
    const balanceOfAddress2 = await this.paycer.balanceOf(this.address2.address)
    expect((balanceOfAddress2).toNumber()).to.equal(100)
  })

  it('should not send tokens if the balance has not enougth tokens', async function () {
    const owner = await this.paycer.connect(this.owner)
    const address2 = await this.paycer.connect(this.address2)

    await expect(owner.transfer(this.address1.address, ethers.utils.parseUnits('10000000', 18))).to.be.revertedWith('ERC20: transfer amount exceeds balance')
    await expect(address2.transfer(this.owner.address, 1)).to.be.revertedWith('ERC20: transfer amount exceeds balance')
  })
})