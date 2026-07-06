const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const MockUSD = await hre.ethers.getContractFactory("MockUSD");
  const mockUSD = await MockUSD.deploy();
  await mockUSD.waitForDeployment();
  const mockUSDAddress = await mockUSD.getAddress();
  console.log("MockUSD deployed to:", mockUSDAddress);

  // Mint yourself 10,000 mUSD to test with
  const mintTx = await mockUSD.mint(deployer.address, hre.ethers.parseEther("10000"));
  await mintTx.wait();
  console.log("Minted 10,000 mUSD to:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});