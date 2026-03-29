import { expect } from "chai";
import { ethers } from "hardhat";
import { SupplyChain } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SupplyChain", function () {
  let supplyChain: SupplyChain;
  let admin: SignerWithAddress;
  let manufacturer: SignerWithAddress;
  let distributor: SignerWithAddress;
  let retailer: SignerWithAddress;

  const MANUFACTURER_ROLE = ethers.id("MANUFACTURER_ROLE");
  const DISTRIBUTOR_ROLE = ethers.id("DISTRIBUTOR_ROLE");
  const RETAILER_ROLE = ethers.id("RETAILER_ROLE");

  beforeEach(async function () {
    [admin, manufacturer, distributor, retailer] = await ethers.getSigners();

    const SupplyChainFactory = await ethers.getContractFactory("SupplyChain");
    supplyChain = await SupplyChainFactory.deploy();

    await supplyChain.grantRole(MANUFACTURER_ROLE, manufacturer.address);
    await supplyChain.grantRole(DISTRIBUTOR_ROLE, distributor.address);
    await supplyChain.grantRole(RETAILER_ROLE, retailer.address);
  });

  it("should register a product", async function () {
    const metadata = "ipfs://Qm123";
    await expect(supplyChain.connect(manufacturer).registerProduct(metadata))
      .to.emit(supplyChain, "ProductRegistered")
      .withArgs(0, manufacturer.address, metadata);

    const product = await supplyChain.products(0);
    expect(product.metadata).to.equal(metadata);
    expect(product.status).to.equal(0); // Created
  });

  it("should ship to distributor", async function () {
    await supplyChain.connect(manufacturer).registerProduct("meta");
    await expect(supplyChain.connect(manufacturer).shipToDistributor(0, distributor.address))
      .to.emit(supplyChain, "ProductStatusUpdated")
      .withArgs(0, 1, manufacturer.address); // 1 = InTransitToDistributor

    const product = await supplyChain.products(0);
    expect(product.status).to.equal(1);
    expect(product.distributor).to.equal(distributor.address);
  });

  it("should receive at distributor and transfer ownership", async function () {
    await supplyChain.connect(manufacturer).registerProduct("meta");
    await supplyChain.connect(manufacturer).shipToDistributor(0, distributor.address);

    await expect(supplyChain.connect(distributor).receiveAtDistributor(0))
      .to.emit(supplyChain, "ProductStatusUpdated")
      .withArgs(0, 2, distributor.address); // 2 = AtDistributor

    expect(await supplyChain.ownerOf(0)).to.equal(distributor.address);
  });

  it("should ship to retailer", async function () {
    await supplyChain.connect(manufacturer).registerProduct("meta");
    await supplyChain.connect(manufacturer).shipToDistributor(0, distributor.address);
    await supplyChain.connect(distributor).receiveAtDistributor(0);

    await expect(supplyChain.connect(distributor).shipToRetailer(0, retailer.address))
      .to.emit(supplyChain, "ProductStatusUpdated")
      .withArgs(0, 3, distributor.address); // 3 = InTransitToRetailer

    const product = await supplyChain.products(0);
    expect(product.status).to.equal(3);
    expect(product.retailer).to.equal(retailer.address);
  });

  it("should receive at retailer and transfer ownership", async function () {
    await supplyChain.connect(manufacturer).registerProduct("meta");
    await supplyChain.connect(manufacturer).shipToDistributor(0, distributor.address);
    await supplyChain.connect(distributor).receiveAtDistributor(0);
    await supplyChain.connect(distributor).shipToRetailer(0, retailer.address);

    await expect(supplyChain.connect(retailer).receiveAtRetailer(0))
      .to.emit(supplyChain, "ProductStatusUpdated")
      .withArgs(0, 4, retailer.address); // 4 = AtRetailer

    expect(await supplyChain.ownerOf(0)).to.equal(retailer.address);
  });

  it("should sell to consumer", async function () {
    await supplyChain.connect(manufacturer).registerProduct("meta");
    await supplyChain.connect(manufacturer).shipToDistributor(0, distributor.address);
    await supplyChain.connect(distributor).receiveAtDistributor(0);
    await supplyChain.connect(distributor).shipToRetailer(0, retailer.address);
    await supplyChain.connect(retailer).receiveAtRetailer(0);

    await expect(supplyChain.connect(retailer).sellToConsumer(0))
      .to.emit(supplyChain, "ProductStatusUpdated")
      .withArgs(0, 5, retailer.address); // 5 = Sold

    const product = await supplyChain.products(0);
    expect(product.status).to.equal(5);
  });

  it("should fail to register product if not manufacturer", async function () {
    await expect(supplyChain.connect(distributor).registerProduct("meta"))
      .to.be.revertedWithCustomError(supplyChain, "AccessControlUnauthorizedAccount");
  });
});
