# Supply Chain System Runbook

This document outlines the workflow and commands required to run, simulate, and verify the Blockchain Supply Chain System.

## 1. System Architecture
- **Blockchain**: Local Hardhat node (Ethereum) hosting `SupplyChain.sol`.
- **Infrastructure**: MongoDB (Metadata Storage) & Kafka (Event Streaming) via Docker.
- **Backend**: Java/Spring Boot hub (Event Listener + REST API).
- **Frontend**: React (Vite) Dashboards for Stakeholders.

---

## 2. Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- Java 17+ (or Docker for building)

---

## 3. Starting the System

### Step 1: Infrastructure (Docker)
Start MongoDB and Kafka:
```bash
docker compose up -d
```

### Step 2: Blockchain Node & Contract
In the `blockchain/` directory:
```bash
# Install dependencies
npm install

# Start local node (keep this terminal open)
npx hardhat node

# Deploy contract (in a new terminal)
npx hardhat run scripts/deploy.ts --network localhost
```
*Note: Note the deployed contract address. It defaults to `0x5FbDB2315678afecb367f032d93F642f64180aa3`.*

### Step 3: Backend Hub
If you have local Java 17:
```bash
cd backend
./mvnw spring-boot:run
```
Otherwise, use the verified Docker build/run method:
```bash
# Build (if not already built)
docker run --rm -v "$(pwd)":/usr/src/mymaven -w /usr/src/mymaven maven:3.9.9-eclipse-temurin-17 mvn clean compile -DskipTests

# Run
docker run -d --name supply-chain-backend --network host -v "$(pwd)":/usr/src/mymaven -w /usr/src/mymaven maven:3.9.9-eclipse-temurin-17 mvn spring-boot:run
```

### Step 4: Frontend
In the `frontend/` directory:
```bash
npm install
npm run dev
```
Access the UI at `http://localhost:5173`.

---

## 4. Simulation Workflow (E2E)

To simulate a product moving through the supply chain without manual UI entry, run the simulation script:

```bash
cd blockchain
npx hardhat run scripts/simulate.ts --network localhost
```

### What this script does:
1. **Grants Roles**: Assigns Manufacturer, Distributor, and Retailer roles to local Hardhat accounts.
2. **Registers Product**: Calls `registerProduct` on the smart contract.
3. **Updates Status**: Ships product to a Distributor and marks it as received.

---

## 5. Verification

### Check Backend Logs
Monitor how the backend reacts to Blockchain events:
```bash
docker logs -f supply-chain-backend
```
Look for: `Detected ProductRegistered event` and `Updated MongoDB record`.

### Query REST API
Verify the off-chain data and audit trail for Product ID #0:
```bash
curl -s http://localhost:8080/api/products/0 | jq .
```

### Check MongoDB Directly
```bash
docker exec -it supply-chain-mongodb mongosh supply_chain_db --eval "db.product_records.find().pretty()"
```

---

## 6. Troubleshooting
- **Kafka Errors**: If Kafka fails with `NodeExists`, run `docker compose down -v` to clear volumes and restart.
- **Port Conflicts**: Ensure ports `8080` (Backend), `27017` (Mongo), `9092` (Kafka), and `8545` (Hardhat) are not being used by local services.
- **Contract Address**: If you redeploy the contract, update the address in `backend/src/main/resources/application.yml`.
