import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { Scale, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    phone: '',
    address: '',
    national_id: '',
    lsk_number: '',
    specialization: '',
    years_of_experience: 0,
  });

  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'years_of_experience' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...form,
      date_of_birth: `${dateOfBirth}T00:00:00`, // formatted correctly
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        payload
      );
      alert('Account created successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Something went wrong. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
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
            <h1 className="text-2xl font-bold">Create Account</h1>
          </div>
          <p className="text-muted-foreground">
            Register to use Legal Buddy
          </p>
        </div>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Fill in your details to register</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
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
                  required
                />
              </div>
              <div>
                <Label>Role</Label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border rounded-md h-10 px-3"
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
                  required
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>National ID</Label>
                <Input
                  name="national_id"
                  value={form.national_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>LSK Number</Label>
                <Input
                  name="lsk_number"
                  value={form.lsk_number}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Specialization</Label>
                <Input
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Years of Experience</Label>
                <Input
                  name="years_of_experience"
                  type="number"
                  value={form.years_of_experience}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-1 md:col-span-2 mt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-sm text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
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
