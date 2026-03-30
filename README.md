# Blockchain Supply Chain System

An enterprise-grade, hybrid blockchain supply chain system ensuring traceability and authenticity from manufacturer to consumer.

## Tech Stack
- **Blockchain**: Solidity, Hardhat, Ethers.js (ERC721 based)
- **Backend**: Java 17, Spring Boot, MongoDB, Apache Kafka
- **Frontend**: React, TypeScript, Three.js, Vite
- **Infrastructure**: Docker, Docker Compose

## Getting Started

### 1. Infrastructure
Spin up the required databases and event streaming:
```bash
docker-compose up -d
```

### 2. Smart Contracts (Blockchain)
Navigate to the `blockchain` directory and deploy the contracts:
```bash
cd blockchain
npm install
npx hardhat node # In a separate terminal
npx hardhat run scripts/deploy.ts --network localhost
```

### 3. Backend Hub (Java)
Navigate to the `backend` directory and start the Spring Boot application:
```bash
cd backend
./mvnw spring-boot:run
```
*Note: Ensure your `JAVA_HOME` points to a JDK 17+.*

### 4. Frontend Dashboards (React)
Navigate to the `frontend` directory and start the development server:
```bash
cd frontend
npm install
npm run dev
```

## System Architecture
1. **On-Chain**: Every product unit is minted as a unique NFT on the Ethereum blockchain.
2. **Event Listening**: The Spring Boot backend listens for real-time blockchain events via Web3j.
3. **Event Streaming**: Events are pushed to Kafka for asynchronous, decoupled processing.
4. **Off-Chain Storage**: Rich metadata and full provenance history are stored in MongoDB for fast retrieval.
5. **Interactive UI**: Three.js-powered dashboards provide 3D visualizations of products and the global supply chain.

## Verification
- Use the **Manufacturer Dashboard** to register new units.
- Monitor the **Stakeholder Dashboard** for real-time supply chain updates.
- Use the **Consumer Portal** to verify authenticity via the public-facing ledger interface.
