// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TollPayment
 * @dev Smart contract for decentralized toll payments with privacy features
 * @notice This contract handles toll payments, operator management, and proof generation
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract TollPayment is Ownable, ReentrancyGuard, Pausable {
    
    // ============ Structs ============
    
    struct TollBooth {
        uint256 id;
        string name;
        string location;
        uint256 baseFee;
        address operator;
        bool isActive;
    }
    
    struct Payment {
        bytes32 paymentId;
        uint256 boothId;
        uint256 amount;
        uint256 timestamp;
        bytes32 vehicleHash; // Hashed RFID for privacy
        bytes32 proofHash;   // ZK proof hash
        bool isDisputed;
    }
    
    struct Operator {
        address operatorAddress;
        string name;
        uint256 totalCollected;
        bool isActive;
    }
    
    // ============ State Variables ============
    
    mapping(uint256 => TollBooth) public tollBooths;
    mapping(bytes32 => Payment) public payments;
    mapping(address => Operator) public operators;
    mapping(address => uint256) public userBalances;
    mapping(bytes32 => bool) public usedProofs;
    
    uint256 public boothCounter;
    uint256 public totalPayments;
    uint256 public platformFeePercent = 1; // 1% platform fee
    
    address public paymaster; // CDP Paymaster address
    address public anonAadhaarVerifier; // Anon-Aadhaar verifier contract
    
    // ============ Events ============
    
    event TollBoothCreated(uint256 indexed boothId, string name, address operator);
    event PaymentProcessed(bytes32 indexed paymentId, uint256 boothId, uint256 amount, uint256 timestamp);
    event BalanceDeposited(address indexed user, uint256 amount);
    event BalanceWithdrawn(address indexed user, uint256 amount);
    event DisputeRaised(bytes32 indexed paymentId, address indexed user);
    event DisputeResolved(bytes32 indexed paymentId, bool inFavorOfUser);
    event OperatorAdded(address indexed operator, string name);
    event OperatorRemoved(address indexed operator);
    
    // ============ Modifiers ============
    
    modifier onlyOperator() {
        require(operators[msg.sender].isActive, "Not an active operator");
        _;
    }
    
    modifier onlyPaymaster() {
        require(msg.sender == paymaster, "Only paymaster can call");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(address _paymaster, address _anonAadhaarVerifier) {
        paymaster = _paymaster;
        anonAadhaarVerifier = _anonAadhaarVerifier;
    }
    
    // ============ User Functions ============
    
    /**
     * @dev Deposit funds to user balance
     */
    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Must deposit some funds");
        userBalances[msg.sender] += msg.value;
        emit BalanceDeposited(msg.sender, msg.value);
    }
    
    /**
     * @dev Process toll payment with ZK proof
     * @param boothId The toll booth ID
     * @param vehicleHash Hashed RFID tag data
     * @param zkProof Zero-knowledge proof from Anon-Aadhaar
     */
    function payToll(
        uint256 boothId,
        bytes32 vehicleHash,
        bytes calldata zkProof
    ) external nonReentrant whenNotPaused {
        TollBooth storage booth = tollBooths[boothId];
        require(booth.isActive, "Toll booth not active");
        require(userBalances[msg.sender] >= booth.baseFee, "Insufficient balance");
        
        // Verify ZK proof (simplified - actual implementation would call verifier)
        bytes32 proofHash = keccak256(zkProof);
        require(!usedProofs[proofHash], "Proof already used");
        usedProofs[proofHash] = true;
        
        // Calculate fees
        uint256 platformFee = (booth.baseFee * platformFeePercent) / 100;
        uint256 operatorAmount = booth.baseFee - platformFee;
        
        // Deduct from user
        userBalances[msg.sender] -= booth.baseFee;
        
        // Pay operator
        operators[booth.operator].totalCollected += operatorAmount;
        
        // Create payment record
        bytes32 paymentId = keccak256(
            abi.encodePacked(boothId, vehicleHash, block.timestamp, totalPayments)
        );
        
        payments[paymentId] = Payment({
            paymentId: paymentId,
            boothId: boothId,
            amount: booth.baseFee,
            timestamp: block.timestamp,
            vehicleHash: vehicleHash,
            proofHash: proofHash,
            isDisputed: false
        });
        
        totalPayments++;
        
        emit PaymentProcessed(paymentId, boothId, booth.baseFee, block.timestamp);
    }
    
    /**
     * @dev Gas-free payment via paymaster
     */
    function payTollGasless(
        address user,
        uint256 boothId,
        bytes32 vehicleHash,
        bytes calldata zkProof
    ) external onlyPaymaster nonReentrant whenNotPaused {
        TollBooth storage booth = tollBooths[boothId];
        require(booth.isActive, "Toll booth not active");
        require(userBalances[user] >= booth.baseFee, "Insufficient balance");
        
        bytes32 proofHash = keccak256(zkProof);
        require(!usedProofs[proofHash], "Proof already used");
        usedProofs[proofHash] = true;
        
        uint256 platformFee = (booth.baseFee * platformFeePercent) / 100;
        uint256 operatorAmount = booth.baseFee - platformFee;
        
        userBalances[user] -= booth.baseFee;
        operators[booth.operator].totalCollected += operatorAmount;
        
        bytes32 paymentId = keccak256(
            abi.encodePacked(boothId, vehicleHash, block.timestamp, totalPayments)
        );
        
        payments[paymentId] = Payment({
            paymentId: paymentId,
            boothId: boothId,
            amount: booth.baseFee,
            timestamp: block.timestamp,
            vehicleHash: vehicleHash,
            proofHash: proofHash,
            isDisputed: false
        });
        
        totalPayments++;
        
        emit PaymentProcessed(paymentId, boothId, booth.baseFee, block.timestamp);
    }
    
    /**
     * @dev Withdraw user balance
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        userBalances[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit BalanceWithdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Raise dispute for a payment
     */
    function raiseDispute(bytes32 paymentId) external {
        Payment storage payment = payments[paymentId];
        require(payment.amount > 0, "Payment not found");
        require(!payment.isDisputed, "Already disputed");
        require(block.timestamp - payment.timestamp <= 7 days, "Dispute period expired");
        
        payment.isDisputed = true;
        emit DisputeRaised(paymentId, msg.sender);
    }
    
    // ============ Operator Functions ============
    
    /**
     * @dev Create a new toll booth
     */
    function createTollBooth(
        string calldata name,
        string calldata location,
        uint256 baseFee
    ) external onlyOperator returns (uint256) {
        boothCounter++;
        
        tollBooths[boothCounter] = TollBooth({
            id: boothCounter,
            name: name,
            location: location,
            baseFee: baseFee,
            operator: msg.sender,
            isActive: true
        });
        
        emit TollBoothCreated(boothCounter, name, msg.sender);
        return boothCounter;
    }
    
    /**
     * @dev Update toll booth fee
     */
    function updateBoothFee(uint256 boothId, uint256 newFee) external onlyOperator {
        require(tollBooths[boothId].operator == msg.sender, "Not booth owner");
        tollBooths[boothId].baseFee = newFee;
    }
    
    /**
     * @dev Withdraw operator earnings
     */
    function withdrawOperatorEarnings() external onlyOperator nonReentrant {
        uint256 amount = operators[msg.sender].totalCollected;
        require(amount > 0, "No earnings to withdraw");
        
        operators[msg.sender].totalCollected = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    // ============ Admin Functions ============
    
    function addOperator(address operatorAddress, string calldata name) external onlyOwner {
        operators[operatorAddress] = Operator({
            operatorAddress: operatorAddress,
            name: name,
            totalCollected: 0,
            isActive: true
        });
        
        emit OperatorAdded(operatorAddress, name);
    }
    
    function removeOperator(address operatorAddress) external onlyOwner {
        operators[operatorAddress].isActive = false;
        emit OperatorRemoved(operatorAddress);
    }
    
    function resolveDispute(bytes32 paymentId, bool inFavorOfUser) external onlyOwner {
        Payment storage payment = payments[paymentId];
        require(payment.isDisputed, "Not disputed");
        
        if (inFavorOfUser) {
            // Refund logic would go here
        }
        
        payment.isDisputed = false;
        emit DisputeResolved(paymentId, inFavorOfUser);
    }
    
    function setPaymaster(address _paymaster) external onlyOwner {
        paymaster = _paymaster;
    }
    
    function setPlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 5, "Fee too high");
        platformFeePercent = _feePercent;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ============ View Functions ============
    
    function getPayment(bytes32 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }
    
    function getTollBooth(uint256 boothId) external view returns (TollBooth memory) {
        return tollBooths[boothId];
    }
    
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
}
