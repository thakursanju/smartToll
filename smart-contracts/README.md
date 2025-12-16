# SmartToll Smart Contracts

## Overview

This directory contains the Solidity smart contracts for the SmartToll decentralized toll payment system.

## Contracts

### TollPayment.sol

The main contract handling all toll payment operations.

#### Features

- **User Balance Management**: Deposit and withdraw funds
- **Toll Payment Processing**: Pay tolls with ZK proof verification
- **Gas-Free Transactions**: Paymaster integration for gasless payments
- **Operator Management**: Add/remove toll booth operators
- **Dispute Resolution**: On-chain dispute handling with proof verification

#### Key Functions

| Function | Description | Access |
|----------|-------------|--------|
| `deposit()` | Add funds to user balance | Public |
| `payToll()` | Process toll payment with ZK proof | Public |
| `payTollGasless()` | Gas-free payment via paymaster | Paymaster only |
| `withdraw()` | Withdraw user balance | Public |
| `raiseDispute()` | Dispute a payment | Public |
| `createTollBooth()` | Create new toll booth | Operators |
| `addOperator()` | Register new operator | Owner |

## Deployment

### Prerequisites

- Node.js v18+
- Hardhat or Foundry
- Private key with testnet funds

### Environment Variables

```env
PRIVATE_KEY=your_private_key
RPC_URL=https://sepolia.base.org
ETHERSCAN_API_KEY=your_api_key
PAYMASTER_ADDRESS=0x...
ANON_AADHAAR_VERIFIER=0x...
```

### Deploy Script

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const paymaster = process.env.PAYMASTER_ADDRESS;
  const verifier = process.env.ANON_AADHAAR_VERIFIER;

  const TollPayment = await hre.ethers.getContractFactory("TollPayment");
  const tollPayment = await TollPayment.deploy(paymaster, verifier);

  await tollPayment.deployed();
  console.log("TollPayment deployed to:", tollPayment.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.js --network base-sepolia

# Verify on Etherscan
npx hardhat verify --network base-sepolia CONTRACT_ADDRESS PAYMASTER VERIFIER
```

## Testing

```bash
npx hardhat test
```

### Test Coverage

- User deposits and withdrawals
- Toll payment processing
- ZK proof verification
- Operator management
- Dispute resolution flow
- Access control

## Security Considerations

1. **Reentrancy Protection**: All payment functions use `nonReentrant` modifier
2. **Access Control**: Role-based permissions (Owner, Operator, Paymaster)
3. **Pausable**: Emergency stop mechanism
4. **Proof Replay Prevention**: Used proofs are tracked and cannot be reused

## Gas Optimization

- Packed structs for efficient storage
- Minimal storage writes
- Batch operations where possible

## Integration

### Frontend Integration

```typescript
import { ethers } from 'ethers';
import TollPaymentABI from './TollPayment.json';

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  TollPaymentABI,
  signer
);

// Deposit funds
await contract.deposit({ value: ethers.parseEther("0.1") });

// Pay toll
await contract.payToll(boothId, vehicleHash, zkProof);
```

### CDP Paymaster Integration

The contract supports gasless transactions via the `payTollGasless` function, which can only be called by the registered paymaster address.

## License

MIT
