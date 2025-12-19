import { useState, useCallback } from 'react';

export type NFCStatus = 'idle' | 'scanning' | 'success' | 'error' | 'unsupported';

interface NFCReadResult {
  serialNumber: string;
  records: Array<{
    recordType: string;
    data: string;
  }>;
}

export const useNFC = () => {
  const [status, setStatus] = useState<NFCStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [tagData, setTagData] = useState<NFCReadResult | null>(null);

  const isSupported = typeof window !== 'undefined' && 'NDEFReader' in window;

  const startScan = useCallback(async (): Promise<NFCReadResult | null> => {
    if (!isSupported) {
      setStatus('unsupported');
      setError('Web NFC is not supported on this device. Use Chrome on Android.');
      return null;
    }

    try {
      setStatus('scanning');
      setError(null);
      setTagData(null);

      // @ts-ignore - Web NFC API types
      const ndef = new NDEFReader();
      await ndef.scan();

      return new Promise((resolve) => {
        ndef.addEventListener('reading', ({ serialNumber, message }: any) => {
          const records = Array.from(message.records).map((record: any) => {
            const decoder = new TextDecoder();
            return {
              recordType: record.recordType,
              data: record.data ? decoder.decode(record.data) : '',
            };
          });

          const result: NFCReadResult = {
            serialNumber,
            records,
          };

          setTagData(result);
          setStatus('success');
          resolve(result);
        });

        ndef.addEventListener('readingerror', () => {
          setStatus('error');
          setError('Failed to read NFC tag. Please try again.');
          resolve(null);
        });
      });
    } catch (err: any) {
      setStatus('error');
      if (err.name === 'NotAllowedError') {
        setError('NFC permission denied. Please allow NFC access.');
      } else if (err.name === 'NotSupportedError') {
        setError('Web NFC is not supported on this device.');
      } else {
        setError(err.message || 'Failed to start NFC scan.');
      }
      return null;
    }
  }, [isSupported]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setTagData(null);
  }, []);

  return {
    status,
    error,
    tagData,
    isSupported,
    startScan,
    reset,
  };
};
