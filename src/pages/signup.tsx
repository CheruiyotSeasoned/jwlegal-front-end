import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { Scale, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import Logo from "@/assets/yellow-blue-removebg-preview.png";

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client', // Changed to match backend enum
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [googleRole, setGoogleRole] = useState('client'); // Separate state for Google signup role
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...form,
      date_of_birth: '2000-01-01T00:00:00',
      address: 'Not provided',
      national_id: '00000000',
      lsk_number: '',
      specialization: '',
      years_of_experience: 0,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, payload);
      alert('Account created successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Something went wrong. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      
      // Send both id_token and role to match backend expectations
      interface GoogleSignupResponse {
        access_token: string;
        // add other fields if needed
      }

      const response = await axios.post<GoogleSignupResponse>(`${import.meta.env.VITE_API_BASE_URL}/auth/google-signup`, { 
        id_token: credential,
        role: "client" // Use the selected Google role
      });
      
      // Store the token if login is successful
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      alert('Logged in with Google!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Google signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center">
              <img
                src={Logo}
                alt="Legal Buddy Logo"
                className="h-10 w-auto"
              />
              <span className="text-xs text-muted-foreground">
                AI-Powered Legal Research
              </span>
            </div>
          </div>
        </div>

        {/* Signup Card */}
        <Card className="shadow-xl border-none rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            <CardDescription className="text-gray-500">
              Create your account and start using AI Legal Buddy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div hidden>
                <Label>Role</Label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border rounded-md h-10 px-3 text-gray-700"
                >
                  <option value="client">Client</option>
                  <option value="lawyer">Lawyer</option>
                  <option value="admin">Admin</option>
                  <option value="judicial">Judicial Officer</option>
                </select>
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+254712345678"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>

            {/* Google Signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 mb-2">Or sign up with Google</p>
              {/* Role selection for Google signup */}
              <div className="mb-3" hidden>
                <Label className="text-sm">Select your role for Google signup:</Label>
                <select
                  value={googleRole}
                  onChange={(e) => setGoogleRole(e.target.value)}
                  className="w-full border rounded-md h-10 px-3 text-gray-700 mt-1"
                >
                  <option value="CLIENT">Client</option>
                  <option value="LAWYER">Lawyer</option>
                  <option value="ADMIN">Admin</option>
                  <option value="JUDICIAL">Judicial Officer</option>
                </select>
              </div>
              
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => alert('Google Sign In Failed')}
                />
              </div>
            </div>

            <div className="mt-4 text-sm text-center text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;