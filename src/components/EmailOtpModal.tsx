import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiEndpoints from '../apiConfig';
import { Loader2 } from 'lucide-react';

interface EmailOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (token: string) => void;
  userEmail: string;
}

const EmailOtpModal = ({ isOpen, onClose, onVerified, userEmail }: EmailOtpModalProps) => {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(apiEndpoints.verifyEmailOtp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp: otpCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      onVerified(data.token); // Pass the final JWT token back
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Verification Code</DialogTitle>
          <DialogDescription>
            We've sent a 6-digit code to {userEmail}. Please enter it below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-full space-y-2">
            <Input 
              placeholder="123456" 
              className="text-center text-2xl tracking-widest h-12"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </div>
          <Button onClick={handleVerify} className="w-full" disabled={isLoading || otpCode.length !== 6}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify & Enable
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailOtpModal;