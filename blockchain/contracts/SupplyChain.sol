// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SupplyChain is ERC721, AccessControl {
    uint256 private _nextTokenId;

    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");

    enum ProductStatus { Created, InTransitToDistributor, AtDistributor, InTransitToRetailer, AtRetailer, Sold }

    struct Product {
        uint256 id;
        string metadata;
        ProductStatus status;
        address manufacturer;
        address distributor;
        address retailer;
    }

    mapping(uint256 => Product) public products;

    event ProductRegistered(uint256 indexed productId, address indexed manufacturer, string metadata);
    event ProductStatusUpdated(uint256 indexed productId, ProductStatus status, address indexed actor);

    constructor() ERC721("SupplyChainProduct", "SCP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function registerProduct(string memory metadata) public onlyRole(MANUFACTURER_ROLE) returns (uint256) {
        uint256 productId = _nextTokenId++;

        _safeMint(msg.sender, productId);
        products[productId] = Product(productId, metadata, ProductStatus.Created, msg.sender, address(0), address(0));

        emit ProductRegistered(productId, msg.sender, metadata);
        emit ProductStatusUpdated(productId, ProductStatus.Created, msg.sender);

        return productId;
    }

    function shipToDistributor(uint256 productId, address distributor) public {
        require(ownerOf(productId) == msg.sender, "Not product owner");
        require(products[productId].status == ProductStatus.Created, "Invalid status");

        products[productId].distributor = distributor;
        products[productId].status = ProductStatus.InTransitToDistributor;

        emit ProductStatusUpdated(productId, ProductStatus.InTransitToDistributor, msg.sender);
    }

    function receiveAtDistributor(uint256 productId) public onlyRole(DISTRIBUTOR_ROLE) {
        require(products[productId].distributor == msg.sender, "Not assigned distributor");
        require(products[productId].status == ProductStatus.InTransitToDistributor, "Invalid status");

        _transfer(ownerOf(productId), msg.sender, productId);
        products[productId].status = ProductStatus.AtDistributor;

        emit ProductStatusUpdated(productId, ProductStatus.AtDistributor, msg.sender);
    }

    function shipToRetailer(uint256 productId, address retailer) public onlyRole(DISTRIBUTOR_ROLE) {
        require(ownerOf(productId) == msg.sender, "Not product owner");
        require(products[productId].status == ProductStatus.AtDistributor, "Invalid status");

        products[productId].retailer = retailer;
        products[productId].status = ProductStatus.InTransitToRetailer;

        emit ProductStatusUpdated(productId, ProductStatus.InTransitToRetailer, msg.sender);
    }

    function receiveAtRetailer(uint256 productId) public onlyRole(RETAILER_ROLE) {
        require(products[productId].retailer == msg.sender, "Not assigned retailer");
        require(products[productId].status == ProductStatus.InTransitToRetailer, "Invalid status");

        _transfer(ownerOf(productId), msg.sender, productId);
        products[productId].status = ProductStatus.AtRetailer;

        emit ProductStatusUpdated(productId, ProductStatus.AtRetailer, msg.sender);
    }

    function sellToConsumer(uint256 productId) public onlyRole(RETAILER_ROLE) {
        require(ownerOf(productId) == msg.sender, "Not product owner");
        require(products[productId].status == ProductStatus.AtRetailer, "Invalid status");

        products[productId].status = ProductStatus.Sold;

        emit ProductStatusUpdated(productId, ProductStatus.Sold, msg.sender);
    }

    // Overrides required by AccessControl
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
