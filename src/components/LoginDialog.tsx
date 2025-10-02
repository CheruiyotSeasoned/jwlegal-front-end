import { useState } from 'react';
import { useAuth, User } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Scale } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const { login, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      const userData = JSON.parse(localStorage.getItem('user') || 'null');
      if (userData) setUser(userData);
      onOpenChange(false);
      toast({ title: `Welcome back, ${userData?.name || userData?.email}!` });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast({ variant: 'destructive', title: 'Google login failed' });
      return;
    }

    setGoogleLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: credentialResponse.credential }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const accessToken = data.access_token;
      localStorage.setItem('token', accessToken);

      const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userRes.ok) throw new Error('Failed to fetch user info');
      const userData: User = await userRes.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      toast({ title: `Welcome back, ${userData.name || userData.email}!` });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Google login failed' });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Scale className="h-6 w-6 text-primary" />
            <DialogTitle>Legal Buddy</DialogTitle>
          </div>
          <DialogDescription>Sign in to continue</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t" />
          <span className="px-2 text-muted-foreground text-sm">OR</span>
          <div className="flex-grow border-t" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast({ variant: 'destructive', title: 'Google login failed' })}
          />
        </div>

        <DialogFooter>
          <p className="text-xs text-center text-muted-foreground w-full">
            By signing in, you agree to our Terms & Privacy.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
