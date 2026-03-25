# Blockchain Supply Chain System

## What This Is

An enterprise-grade blockchain supply chain system that guarantees transparency, traceability, and anti-counterfeiting from manufacturer to consumer. It uses a hybrid architecture combining on-chain ledger security with high-performance off-chain processing and real-time event streaming.

## Core Value

Guarantees the authentic, tamper-proof history of every product, providing verifiable trust from origin to purchase.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **On-Chain Ledger**: Solidity smart contracts on Ethereum for unique product IDs and immutable state changes.
- [ ] **Scalable Backend**: Java and Spring Boot backend acting as the central hub for business logic.
- [ ] **Event Streaming**: Kafka integration for real-time event tracking and system-wide synchronization.
- [ ] **Metadata Storage**: MongoDB for rich, off-chain metadata storage and fast retrieval.
- [ ] **Role-Based Dashboards**: React frontend providing specialized views for manufacturers, distributors, and retailers.
- [ ] **Consumer Verification**: QR code scanning interface for end consumers to verify product history.

### Out of Scope

- [ ] **Public Mainnet Deployment (Initial)** — [Rationale: Initial focus on private or testnet for development and cost control]
- [ ] **End-to-End Logistics Optimization** — [Rationale: Focus is on traceability and authenticity, not route planning]

## Context

The system addresses the need for immutable proof of authenticity in complex supply chains. It bridges the gap between secure blockchain state and rich business data required for daily operations.

## Constraints

- **Tech Stack**: Solidity, Ethereum, Java/Spring Boot, Kafka, MongoDB, React.
- **Architecture**: Hybrid On-chain/Off-chain to balance security and cost.
- **Security**: Must ensure data integrity across the entire chain of custody.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid Architecture | Balance on-chain immutability with off-chain performance and storage costs | — Pending |
| Event-Driven Logic | Kafka ensures real-time updates across distributed components | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-25 after initialization*
