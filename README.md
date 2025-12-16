# 🚗 smallToll

### A Decentralized, Privacy-Preserving Toll Payment System

Built for **Ethereum-based Hackathon Track**

---

## 📖 Introduction

**smallTolldecentralized toll payment protocol that leverages **Ethereum smart contracts**, **gas abstraction**, and **privacy-preserving authentication** to modernize toll collection systems.

Traditional toll systems suffer from fraud, privacy leaks, payment disputes, and infrastructure downtime. FlowPasssmallTolllized toll servers with **on-chain logic**, enabling **secure, verifiable, and anonymous toll payments** using vehicle-linked wallets.

> ⚡ No cash. No queues. No trust required.

---

## 🎯 The Vision

Road infrastructure should be **fast, fair, and frictionless**.

FlowPass envisiosmallTolle:

* Toll payments are **automatic and tamper-proof**
* Users retain **full privacy** over their identity and travel history
* Operators get **instant settlement and dispute-proof records**

By combining Ethereum’s immutable ledger with modern mobile hardware, FlowPass turns toll plazsmallTolless payment checkpoints**.

---

## 🔄 User Flow

### 1️⃣ User Onboarding

* User accesses the FlowPass web app (mobile-first)
  smallTollanonymously (Anon-Aadhaar / ZK-based auth)
* A **vehicle wallet** is created on Ethereum

### 2️⃣ Wallet Funding

* User tops up the vehicle wallet (ETH / ERC20)
* **CDP Paymaster** abstracts gas fees (no ETH required by user)

### 3️⃣ Toll Entry & Payment

* Vehicle arrives at toll plaza
* Toll operator scans vehicle RFID using a **phone-hosted web app**
* Smart contract is triggered automatically
* Toll amount is deducted from the vehicle wallet

### 4️⃣ On-Chain Recording

Each transaction stores:

* Hashed vehicle ID
* Toll amount
* Timestamp
* Transaction hash

All data is **immutable, verifiable, and privacy-safe**

### 5️⃣ Verification & Settlement

* Operators view payment status via dashboard
* Users can access **cryptographic proof of payment**
* Disputes are resolved instantly using on-chain history

---

## 🏗️ System Architecture

```
Vehicle Owner (Wallet)
        │
        ▼
Mobile Web App (RFID Scan + UI)
        │
        ▼
Ethereum Smart Contracts
(TollPayment + Paymaster)
        │
        ├────────► Operator Dashboard
        │
        └────────► User Transaction Proofs
```

### Core Components

#### 🧠 Smart Contracts (Solidity)

* `TollPayment.sol`

  * Escrows funds
  * Deducts tolls
  * Emits verifiable events

* Paymaster Contract

  * Sponsors gas fees
  * Enables frictionless UX

#### 🌐 Frontend

* React (mobile-first)
* Hosted directly on phones (mini-server approach)
* RFID scanning + dashboards

#### 🔐 Privacy Layer

* Anonymous authentication (no PII on-chain)
* Vehicle IDs hashed before storage

---

## ⚖️ Problems Solved

### 🔒 Security & Fraud

* Immutable ledger prevents double payments
* Smart contracts eliminate tampering

### 🕵️ Privacy

* No tracking of personal identity
* Anonymous, ZK-based authentication

### ⚙️ Reliability

* No centralized servers
* No single point of failure

### 🧾 Payment Proofs

* Instant, verifiable transaction history
* Simplified operator settlements

---

## 🚀 Key Features

* ⚡ **Instant On-Chain Payments**
* 🔒 **Trustless Smart Contract Escrow**
* 👤 **Anonymous User Authentication**
* ⛽ **Gasless User Experience (Paymaster)**
* 📜 **Dispute-Proof Payment Records**
* 📱 **Mobile-Based RFID Scanning**

---

## 🛠️ Tech Stack

### Blockchain

* Ethereum (Sepolia / Goerli)
* Solidity Smart Contracts

### Frontend

* React
* Tailwind CSS (White / Orange / Green)
* Ethers.js / Web3.js

### Infrastructure

* CDP Paymaster
* Mobile-hosted web server

---

## 🧪 Installation & Setup

### 1️⃣ Smart Contracts

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat deploy --network sepolia
```

Update deployed contract address in frontend config.

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3️⃣ Mobile Hosting

* Run frontend directly from mobile device
* Enable RFID scanning permissions

---

## 🔮 Future Roadmap

* 🌉 Multi-chain wallet top-ups (Socket integration)
* 🚘 FASTag interoperability
* 🏙️ Smart city toll analytics
* 🌍 Mainnet deployment

---

## 👥 Team

Built for Web3 infrastructure innovation.

**Khushvinder Thakur** – Blockchain & Full Stack Developer

---


> _FlowPass — Moving payments as fast as trsmallToll
