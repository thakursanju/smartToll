# SmartToll Architecture Documentation

## System Overview

SmartToll is a decentralized toll payment system built on blockchain technology with privacy-preserving authentication.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │   Mobile    │    │   Web App   │    │   Wallet    │                  │
│  │    App      │    │  (React)    │    │  (MetaMask) │                  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                  │
│         │                  │                  │                          │
│         └──────────────────┼──────────────────┘                          │
│                            ▼                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                         AUTHENTICATION LAYER                             │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      ANON-AADHAAR                                │    │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │    │
│  │  │  QR Scan    │───▶│  ZK Proof   │───▶│  Verify     │          │    │
│  │  │  Aadhaar    │    │  Generation │    │  On-Chain   │          │    │
│  │  └─────────────┘    └─────────────┘    └─────────────┘          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                            ▼                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                          SERVICE LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │    RFID      │  │   Payment    │  │   Dispute    │  │   Wallet    │  │
│  │   Scanner    │  │   Service    │  │   Service    │  │   Top-Up    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │
│         │                 │                 │                 │          │
│         └─────────────────┼─────────────────┼─────────────────┘          │
│                           ▼                 ▼                            │
├─────────────────────────────────────────────────────────────────────────┤
│                        BLOCKCHAIN LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    BASE BLOCKCHAIN                               │    │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │    │
│  │  │TollPayment  │    │   CDP       │    │   Socket    │          │    │
│  │  │  Contract   │◀──▶│  Paymaster  │    │   Bridge    │          │    │
│  │  └─────────────┘    └─────────────┘    └─────────────┘          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer

#### Web Application (React)
- **Technology**: React, TypeScript, Tailwind CSS
- **Responsibilities**:
  - User interface for all operations
  - RFID tag scanning via camera
  - Wallet connection management
  - Transaction history display

#### Mobile Responsiveness
- Mobile-first design approach
- Camera access for RFID scanning
- Touch-optimized UI components

### 2. Authentication Layer

#### Anon-Aadhaar Integration
- **Purpose**: Privacy-preserving identity verification
- **Flow**:
  1. User scans Aadhaar QR code
  2. ZK proof generated client-side
  3. Proof verified on-chain without revealing personal data
- **Benefits**:
  - No personal data stored
  - Sybil resistance
  - Regulatory compliance potential

### 3. Payment Layer

#### Smart Contract (TollPayment.sol)
- Handles deposits, payments, withdrawals
- Manages toll booth registry
- Processes ZK proofs
- Stores payment receipts

#### CDP Paymaster
- Sponsors gas fees for users
- Enables gasless transactions
- Improves UX significantly

### 4. Data Layer

#### On-Chain Data
- Payment records (hashed vehicle IDs)
- Toll booth configurations
- User balances
- Dispute states

#### Off-Chain Data (Future)
- IPFS for proof documents
- Indexed transaction history

## Sequence Diagrams

### Payment Flow

```
User          Frontend       Contract      Paymaster     Booth
 │               │              │              │           │
 │──Scan RFID───▶│              │              │           │
 │               │              │              │           │
 │               │──Get Booth───▶              │           │
 │               │◀──Booth Info──│              │           │
 │               │              │              │           │
 │◀─Show Amount──│              │              │           │
 │               │              │              │           │
 │──Confirm Pay──▶              │              │           │
 │               │──Request Tx──▶              │           │
 │               │              │──Sponsor Gas─▶           │
 │               │              │◀─────OK──────│           │
 │               │              │              │           │
 │               │◀──Tx Hash────│              │           │
 │◀──Receipt─────│              │              │           │
 │               │              │              │           │
```

### Dispute Flow

```
User          Frontend       Contract        Admin
 │               │              │              │
 │──View Tx──────▶              │              │
 │◀──Tx Details──│              │              │
 │               │              │              │
 │──Raise Issue──▶              │              │
 │               │──raiseDispute▶              │
 │               │◀──Event──────│              │
 │◀──Confirmed───│              │              │
 │               │              │              │
 │               │              │◀──Review─────│
 │               │              │──Resolve────▶│
 │               │◀──Event──────│              │
 │◀──Resolution──│              │              │
```

## Security Model

### Privacy Guarantees
1. **Identity**: ZK proofs reveal nothing about actual identity
2. **Location**: Only booth ID stored, not GPS coordinates
3. **Vehicle**: RFID data is hashed before storage

### Access Control
- **Owner**: Platform administration
- **Operators**: Booth management
- **Paymaster**: Gas sponsorship
- **Users**: Payments and disputes

### Threat Mitigations
| Threat | Mitigation |
|--------|------------|
| Replay attacks | Proof hash tracking |
| Front-running | Commit-reveal (future) |
| Reentrancy | OpenZeppelin guards |
| Denial of service | Rate limiting, pausable |

## Performance Considerations

### Gas Optimization
- Struct packing
- Minimal storage writes
- Batch operations

### Scalability
- Base L2 for low fees
- Off-chain indexing
- Caching strategies

## Future Enhancements

1. **Multi-Chain Wallet Top-Up** (Socket Protocol)
2. **NFT Receipts** for premium users
3. **Subscription Plans** for frequent travelers
4. **Dynamic Pricing** based on congestion
5. **DAO Governance** for fee parameters

## API Reference

See [smart-contracts/README.md](../smart-contracts/README.md) for contract API documentation.
