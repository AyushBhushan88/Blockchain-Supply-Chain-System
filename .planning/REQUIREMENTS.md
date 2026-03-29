# Requirements - Blockchain Supply Chain System

## Vision

An enterprise-grade blockchain supply chain system ensuring traceability and authenticity from manufacturer to consumer.

## Functional Requirements

### Core Ledger (Solidity/Ethereum)
- [ ] Unique digital identifiers (NFTs or similar) for each product unit.
- [ ] Immutable recording of ownership transfers (Chain of Custody).
- [ ] Event emission for all significant state changes.

### Scalable Backend (Java/Spring Boot)
- [ ] Central hub for business logic, processing blockchain events.
- [ ] Integration with Kafka for event-driven architecture.
- [ ] REST APIs for manufacturers, distributors, and retailers.

### Event Streaming & Synchronization (Kafka)
- [ ] Real-time synchronization between on-chain events and off-chain storage (MongoDB).
- [ ] Inter-service communication for decoupled backend modules.

### Off-Chain Metadata (MongoDB)
- [ ] Storage of rich product details (images, descriptions, detailed specs) not suitable for on-chain storage.
- [ ] Fast retrieval of product history and current status.

### User Interfaces (React)
- [ ] **Manufacturer Dashboard**: Product creation, digital ID assignment, and initial dispatch.
- [ ] **Distributor/Retailer Views**: Receiving products, updating custody, and viewing inventory.
- [ ] **Consumer Verification Portal**: QR code scanning interface for public and registered users to verify authenticity.

## Non-Functional Requirements

- **Security**: Data integrity across the hybrid architecture; secure key management.
- **Scalability**: Backend and event streaming must handle high throughput.
- **Latency**: Real-time updates for consumers and stakeholders.
- **Usability**: Intuitive dashboards for supply chain operators and simple verification for consumers.

## Constraints

- Hybrid Architecture (On-chain/Off-chain).
- Initial focus on private/testnet deployment.
- High-performance event processing via Kafka.
