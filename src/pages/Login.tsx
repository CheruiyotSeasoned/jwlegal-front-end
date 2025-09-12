import { useState } from 'react';
import { useAuth, User } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { Scale, ArrowLeft } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user , setUser} = useAuth(); // <-- make sure your hook exposes setUser
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);

      if (user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast({ variant: "destructive", title: "Google login failed: no credential returned" });
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
      localStorage.setItem("token", accessToken);

      const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userResponse.ok) throw new Error("Failed to fetch user info");

      const userData: User = await userResponse.json();
      setUser(userData);  // ✅ push user into global context
      localStorage.setItem("user", JSON.stringify(userData));

      toast({ variant: "default", title: `Welcome back, ${userData.name || userData.email}!` });

      setTimeout(() => {
        if (userData.role === "admin") navigate("/admin-dashboard");
        else navigate("/user-dashboard");
      }, 500);
    } catch (err) {
      console.error("Google login error:", err);
      toast({ variant: "destructive", title: "Google login failed" });
    } finally {
      setGoogleLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Legal Buddy</h1>
          </div>
          <p className="text-muted-foreground">Access your dashboard</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-2 text-muted-foreground text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.error('Google Login Failed')}
              />
            </div>

            {/* After the form */}
            <div className="mt-4 text-sm text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Create one
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Demo Credentials:</h4>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>Email: admin@gmail.com</p>
                <p>Password: 1234</p>
                <p>Role: Automatically assigned by system</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

