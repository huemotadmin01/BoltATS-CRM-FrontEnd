import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'sonner';

const DEMOS = [
  { label: 'Admin',     email: 'admin@company.com',     password: 'admin123' },
  { label: 'Recruiter', email: 'recruiter@company.com', password: 'admin123' },
  { label: 'Sales',     email: 'sales@company.com',     password: 'admin123' },
];

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');       // start empty (no prefill)
  const [password, setPassword] = useState(''); // start empty
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Logged in!');
    } catch (err: any) {
      const msg = err?.message || 'Login failed';
      toast.error(msg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    toast.message(`Filled ${e}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ATS</span>
            </div>
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to TalentFlow
          </h2>

          {/* Demo accounts */}
          <div className="mt-4 text-sm text-gray-700 space-y-1 text-center">
            <div className="font-medium">Use a demo account:</div>
            <div className="space-y-1">
              {DEMOS.map((d) => (
                <div key={d.label} className="flex items-center justify-center gap-2">
                  <span className="text-gray-600 w-24 text-right">{d.label}:</span>
                  <code className="px-1">{d.email}</code>
                  <span className="text-gray-500">/</span>
                  <code className="px-1">{d.password}</code>
                  <button
                    type="button"
                    onClick={() => fillDemo(d.email, d.password)}
                    className="text-blue-600 hover:underline ml-2"
                  >
                    Fill
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="you@company.com"   // <-- corrected placeholder
            autoComplete="email"
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loading}
          />

          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
