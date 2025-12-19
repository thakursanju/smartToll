-- Create toll_transactions table for storing payment records
CREATE TABLE public.toll_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  rfid_tag_id TEXT NOT NULL,
  toll_booth_id TEXT NOT NULL,
  toll_booth_name TEXT NOT NULL,
  amount_wei TEXT NOT NULL,
  amount_eth DECIMAL(18, 8) NOT NULL,
  tx_hash TEXT,
  block_number BIGINT,
  status TEXT NOT NULL DEFAULT 'pending',
  anon_aadhaar_verified BOOLEAN DEFAULT false,
  proof_ipfs_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.toll_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read transactions (for proof verification)
CREATE POLICY "Public read access for toll transactions"
ON public.toll_transactions
FOR SELECT
USING (true);

-- Policy: Anyone can insert transactions (wallet-based, no traditional auth)
CREATE POLICY "Anyone can insert toll transactions"
ON public.toll_transactions
FOR INSERT
WITH CHECK (true);

-- Policy: Wallet owners can update their own transactions
CREATE POLICY "Wallet owners can update their transactions"
ON public.toll_transactions
FOR UPDATE
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_toll_transactions_wallet ON public.toll_transactions(wallet_address);
CREATE INDEX idx_toll_transactions_rfid ON public.toll_transactions(rfid_tag_id);
CREATE INDEX idx_toll_transactions_status ON public.toll_transactions(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_toll_transactions_updated_at
BEFORE UPDATE ON public.toll_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.toll_transactions;