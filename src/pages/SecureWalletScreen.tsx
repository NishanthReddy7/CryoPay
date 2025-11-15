import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldAlert, Copy, Eye, QrCode, Mail, MessageSquare, Loader2 } from 'lucide-react';
import TwoFactorAuthModal from '../components/TwoFactorAuthModal';
import EmailOtpModal from '../components/EmailOtpModal';
import { useAuth } from '../context/AuthContext';
import apiEndpoints from '../apiConfig';

const CryoPayLogo = () => ( <div className="text-2xl font-bold tracking-tighter">Cryo<span className="text-slate-500">Pay</span></div> );

const SecureWalletScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { walletAddress, privateKey, email } = location.state || {};

  const [privateKeyRevealed, setPrivateKeyRevealed] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [otpAuthUrl, setOtpAuthUrl] = useState('');
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCopyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  
  const handleOpenQrModal = async () => {
    // This is the flow for the authenticator app
    const response = await fetch(apiEndpoints.generate2fa, {
      method: 'POST', body: JSON.stringify({ email }), headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    setOtpAuthUrl(data.otpauth_url);
    setQrModalOpen(true);
  };

  const handleSendEmailOtp = async () => {
    setEmailOtpLoading(true);
    setError('');
    try {
      const response = await fetch(apiEndpoints.sendEmailOtp, {
        method: 'POST', body: JSON.stringify({ email }), headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send OTP email.");
      }
      setEmailModalOpen(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const handle2faVerified = (finalToken: string) => {
    // Decode token to get user info
    const payload = JSON.parse(atob(finalToken.split('.')[1]));
    login(finalToken, { id: payload.userId, firstName: 'User' });
    setIs2faEnabled(true);
  };

  const canFinish = hasStoredKey && is2faEnabled;

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col p-4 font-sans">
        <header className="w-full max-w-lg mx-auto py-6 flex-shrink-0">
          <div className="flex justify-center"><CryoPayLogo /></div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 font-medium mb-1 text-center">Step 3 of 3</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div className="bg-slate-800 h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-lg bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Your New Wallet is Ready!</h1>
              <p className="text-slate-500 mt-2">Final steps: back up your credentials and secure your account.</p>
            </div>
            
            {/* Wallet Credentials */}
            <div className="space-y-2">
              <Label>Your CryoPay Public Address</Label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-md">
                <code className="truncate text-slate-700">{walletAddress || '...'}</code>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(walletAddress)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 border-l-4 border-orange-400 text-orange-800 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold">IMPORTANT: Back Up Your Private Key</h3>
                  <p className="text-sm">We do not store this key. If you lose it, your funds are lost forever.</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-md">
                {privateKeyRevealed ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <code className="truncate text-slate-700 text-sm">{privateKey || '...'}</code>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(privateKey)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="stored-key" 
                        checked={hasStoredKey} 
                        onCheckedChange={(checked) => setHasStoredKey(Boolean(checked))} 
                      />
                      <Label htmlFor="stored-key" className="text-sm">
                        I have safely stored my private key.
                      </Label>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={() => setPrivateKeyRevealed(true)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> Reveal Private Key
                  </Button>
                )}
              </div>
            </div>

            {/* 2FA Choices */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div>
                <h3 className="font-semibold text-slate-800">Set Up 2-Factor Authentication (Required)</h3>
                <p className="text-sm text-slate-500">Select a method to secure your account.</p>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleOpenQrModal} 
                disabled={is2faEnabled}
              >
                <QrCode className="w-5 h-5 mr-3"/> Authenticator App (Recommended)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSendEmailOtp} 
                disabled={is2faEnabled || emailOtpLoading}
              >
                <Mail className="w-5 h-5 mr-3"/> 
                {emailOtpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} 
                Send a code to your email
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <MessageSquare className="w-5 h-5 mr-3"/> Send a code to your phone (Coming Soon)
              </Button>
            </div>
            
            <Button 
              onClick={() => navigate('/dashboard')} 
              disabled={!canFinish} 
              className="w-full"
            >
              Finish & Go to Dashboard
            </Button>
          </div>
        </main>
      </div>

      <TwoFactorAuthModal 
        isOpen={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        onVerified={handle2faVerified} 
        otpAuthUrl={otpAuthUrl} 
        userEmail={email} 
      />
      <EmailOtpModal 
        isOpen={emailModalOpen} 
        onClose={() => setEmailModalOpen(false)} 
        onVerified={handle2faVerified} 
        userEmail={email} 
      />
    </>
  );
};

export default SecureWalletScreen;