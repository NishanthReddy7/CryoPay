import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mail, Lock, Eye, EyeOff, Wallet, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiEndpoints from '../apiConfig';

const CryoPayLogo = () => ( <div className="text-2xl font-bold tracking-tighter">Cryo<span className="text-slate-500">Pay</span></div> );

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 2FA Modal state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [is2FALoading, setIs2FALoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(apiEndpoints.loginCustodial, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log in.');
      }
      
      // Check if 2FA is required
      if (data.requires2FA) {
        setShow2FAModal(true);
      } else {
        // Login successful without 2FA
        login(data.token, {
          id: data.user.id,
          firstName: data.user.firstName
        });
        navigate('/dashboard');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async () => {
    setIs2FALoading(true);
    setError('');

    try {
      const response = await fetch(apiEndpoints.verify2fa, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: twoFactorCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid 2FA code.');
      }

      // Login successful
      login(data.token, {
        id: data.user.id,
        firstName: data.user.firstName
      });
      setShow2FAModal(false);
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIs2FALoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
        <header className="absolute top-8"><CryoPayLogo /></header>
        <div className="w-full max-w-md bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Log in to your CryoPay account.</p>
          </div>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="pl-10" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-slate-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  id="password" 
                  type={passwordVisible ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button 
                  type="button" 
                  onClick={() => setPasswordVisible(!passwordVisible)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Logging In...' : 'Log In'}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <Separator className="flex-1" />
            <span className="mx-4 text-xs text-slate-400">OR</span>
            <Separator className="flex-1" />
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link to="/signup-non-custodial">
              <Wallet className="w-5 h-5 mr-2" />Connect with Wallet
            </Link>
          </Button>
        </div>
        <footer className="absolute bottom-6 text-slate-500">
          <p>Don't have an account? <Link to="/onboarding" className="font-semibold text-slate-800 hover:underline">Sign Up</Link></p>
        </footer>
      </div>

      {/* 2FA Modal */}
      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code from your authenticator app.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-full space-y-2">
              <Input 
                placeholder="123456" 
                className="text-center text-2xl tracking-widest h-12"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
              />
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            </div>
            <Button 
              onClick={handle2FASubmit} 
              className="w-full" 
              disabled={is2FALoading || twoFactorCode.length !== 6}
            >
              {is2FALoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify & Log In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginScreen;