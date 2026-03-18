import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check if user has admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .single();

      if (!roleData) {
        await supabase.auth.signOut();
        toast.error('Access denied. Admin privileges required.');
        return;
      }

      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-muted">
      <div className="bg-card rounded-xl shadow-service border border-border p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-kesari-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-kesari" />
          </div>
          <h1 className="font-display text-2xl font-bold text-navy">Admin Login</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">Gurudwara Sadh Sangat Sahib</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 font-body">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 font-body">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-secondary-foreground py-3 rounded-lg font-semibold font-body hover:bg-navy-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
