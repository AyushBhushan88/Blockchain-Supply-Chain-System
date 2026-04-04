import { ethers } from "hardhat";

async function main() {
  const [admin, manufacturer, distributor, retailer] = await ethers.getSigners();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const SupplyChain = await ethers.getContractAt("SupplyChain", contractAddress);

  const MANUFACTURER_ROLE = ethers.id("MANUFACTURER_ROLE");
  const DISTRIBUTOR_ROLE = ethers.id("DISTRIBUTOR_ROLE");
  const RETAILER_ROLE = ethers.id("RETAILER_ROLE");

  console.log("Granting roles...");
  await (await SupplyChain.grantRole(MANUFACTURER_ROLE, manufacturer.address)).wait();
  await (await SupplyChain.grantRole(DISTRIBUTOR_ROLE, distributor.address)).wait();
  await (await SupplyChain.grantRole(RETAILER_ROLE, retailer.address)).wait();
  console.log("Roles granted.");

  console.log("Registering product...");
  const metadata = "Luxury Watch X-200 | Switzerland | Batch A-42";
  const tx = await SupplyChain.connect(manufacturer).registerProduct(metadata);
  const receipt = await tx.wait();
  
  // Get event logs
  console.log("Product registered. Transaction hash:", tx.hash);

  console.log("Shipping to distributor...");
  await (await SupplyChain.connect(manufacturer).shipToDistributor(0, distributor.address)).wait();
  console.log("Product shipped to distributor.");

  console.log("Receiving at distributor...");
  await (await SupplyChain.connect(distributor).receiveAtDistributor(0)).wait();
  console.log("Product received at distributor.");

  console.log("Simulation steps complete on blockchain.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
