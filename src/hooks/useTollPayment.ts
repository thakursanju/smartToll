import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { supabase } from '@/integrations/supabase/client';

// Toll booth configuration (would come from smart contract in production)
const TOLL_BOOTHS: Record<string, { name: string; fee: string }> = {
  'TB001': { name: 'Mumbai-Pune Expressway - Entry', fee: '0.001' },
  'TB002': { name: 'Mumbai-Pune Expressway - Exit', fee: '0.0015' },
  'TB003': { name: 'Delhi-Jaipur Highway - Toll Plaza 1', fee: '0.0008' },
  'TB004': { name: 'Bangalore Outer Ring Road', fee: '0.0005' },
};

export type PaymentStatus = 'idle' | 'preparing' | 'pending' | 'confirming' | 'success' | 'error';

interface PaymentResult {
  txHash: string;
  blockNumber: number;
  amount: string;
  tollBooth: string;
}

export const useTollPayment = () => {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastPayment, setLastPayment] = useState<PaymentResult | null>(null);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const processTollPayment = useCallback(async (
    rfidTagId: string,
    tollBoothId: string = 'TB001',
    anonAadhaarVerified: boolean = false
  ) => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return null;
    }

    const booth = TOLL_BOOTHS[tollBoothId] || TOLL_BOOTHS['TB001'];
    
    try {
      setStatus('preparing');
      setError(null);

      // In production, this would call the actual smart contract
      // For demo, we simulate the transaction
      const mockTxHash = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      setStatus('pending');
      
      // Simulate transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus('confirming');
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockBlockNumber = Math.floor(Math.random() * 1000000) + 18000000;

      // Store transaction in database
      const { error: dbError } = await supabase
        .from('toll_transactions')
        .insert({
          wallet_address: address,
          rfid_tag_id: rfidTagId,
          toll_booth_id: tollBoothId,
          toll_booth_name: booth.name,
          amount_wei: parseEther(booth.fee).toString(),
          amount_eth: parseFloat(booth.fee),
          tx_hash: mockTxHash,
          block_number: mockBlockNumber,
          status: 'confirmed',
          anon_aadhaar_verified: anonAadhaarVerified,
        });

      if (dbError) {
        console.error('Failed to store transaction:', dbError);
      }

      const result: PaymentResult = {
        txHash: mockTxHash,
        blockNumber: mockBlockNumber,
        amount: booth.fee,
        tollBooth: booth.name,
      };

      setLastPayment(result);
      setStatus('success');
      
      return result;
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Payment failed');
      return null;
    }
  }, [isConnected, address]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setLastPayment(null);
  }, []);

  return {
    status,
    error,
    lastPayment,
    isConnected,
    processTollPayment,
    reset,
    tollBooths: TOLL_BOOTHS,
  };
};
