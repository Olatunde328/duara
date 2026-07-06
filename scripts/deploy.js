const hre = require("hardhat");

// Celo mainnet cUSD address. For Alfajores testnet cUSD, swap this out
// (0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1).
const CUSD_MAINNET = "0x765de816845861e75a25fca122bb6898b8b1282a";
const CUSD_SEPOLIA = "0x3378952da04fFCa7eb8A8aa3d631803d274f0bA7";

async function main() {
  const network = hre.network.name;
  const cusdAddress = network === "celo" ? CUSD_MAINNET : CUSD_SEPOLIA;

  console.log(`Deploying to ${network} using cUSD at ${cusdAddress}`);

  const CircleSavings = await hre.ethers.getContractFactory("CircleSavings");
  const circleSavings = await CircleSavings.deploy(cusdAddress);
  await circleSavings.waitForDeployment();
  console.log("CircleSavings deployed to:", await circleSavings.getAddress());

  const ReputationBadge = await hre.ethers.getContractFactory("ReputationBadge");
  const badge = await ReputationBadge.deploy();
  await badge.waitForDeployment();
  console.log("ReputationBadge deployed to:", await badge.getAddress());

  const tx = await badge.setMinter(await circleSavings.getAddress());
  await tx.wait();
  console.log("Minter set. Deployment complete.");

  console.log("\nSave these addresses into your frontend .env:");
  console.log("NEXT_PUBLIC_CIRCLE_SAVINGS_ADDRESS=", await circleSavings.getAddress());
  console.log("NEXT_PUBLIC_BADGE_ADDRESS=", await badge.getAddress());
  console.log("NEXT_PUBLIC_CUSD_ADDRESS=", cusdAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});