import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import apiEndpoints from '../apiConfig';
import { Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (token: string) => void;
  otpAuthUrl: string;
  userEmail: string; // Assuming email is passed for verification
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ isOpen, onClose, onVerified, otpAuthUrl, userEmail }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    // Basic validation for 6 digits
    if (!/^\d{6}$/.test(verificationCode)) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(apiEndpoints.verify2fa, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Ensure email is being sent correctly if needed by backend
        body: JSON.stringify({ email: userEmail, token: verificationCode }),
      });

      const responseBodyText = await response.text(); // Read body first
      const data = responseBodyText ? JSON.parse(responseBodyText) : {};

      if (!response.ok) {
        // Use message from backend if available, otherwise generic error
        throw new Error(data.message || `Verification failed with status ${response.status}`);
      }
      
      console.log("2FA Verification successful:", data);
      onVerified(data.token); // Pass the final JWT token back
      onClose(); // Close modal on success
      setVerificationCode(''); // Reset code input
      
    } catch (err: any) {
      console.error("2FA Verification fetch error:", err);
      setError(err.message || 'An unknown error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset error when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setVerificationCode(e.target.value);
  };

  // Close handler to reset state
  const handleClose = () => {
      setVerificationCode('');
      setError('');
      setIsLoading(false);
      onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Scan the QR code with your authenticator app (e.g., Google Authenticator), then enter the 6-digit code below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {otpAuthUrl ? (
            <div className="p-4 bg-white rounded-lg">
              {/* Ensure QRCode component is rendered */}
              <QRCodeSVG value={otpAuthUrl} size={192} />
            </div>
          ) : (
            <p className="text-sm text-red-600">Error: QR Code URL not available.</p> // Show error if URL is missing
          )}
          <div className="w-full space-y-2">
            <Input 
              id="otp-code" // Add id for label association if needed
              placeholder="123456" 
              className="text-center text-2xl tracking-widest h-12"
              maxLength={6} // Capping input at 6 digits
              value={verificationCode}
              onChange={handleInputChange} // Use updated handler
              aria-label="Enter 6-digit code"
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </div>
          <Button onClick={handleVerify} className="w-full" disabled={isLoading || verificationCode.length !== 6}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify & Enable
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthModal;

