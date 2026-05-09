import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { login, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) navigate('/');
    return () => dispatch(clearError());
  }, [token, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="container max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 md:p-12"
          style={{ padding: '3rem', borderRadius: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Welcome Back</h1>
            <p className="text-text-secondary" style={{ color: 'var(--color-text-secondary)' }}>Sign in to continue your premium experience.</p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-lg mb-6 text-sm" style={{ backgroundColor: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', color: 'var(--color-danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  id="email"
                  type="email" 
                  required
                  className="input-field w-full pl-12"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', paddingLeft: '3rem' }}
                />
              </div>
            </div>

            <div className="input-group">
              <div className="flex justify-between items-center">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-primary hover:underline" style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  id="password"
                  type={showPassword ? 'text' : 'password'} 
                  required
                  className="input-field w-full pl-12 pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: '100%', paddingLeft: '3rem', paddingRight: '3rem' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary btn-lg w-full mt-2"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <FiArrowRight className="ml-2" />}
            </button>
          </form>

          <div className="text-center mt-10" style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <p className="text-text-secondary" style={{ color: 'var(--color-text-secondary)' }}>
              Don't have an account? {' '}
              <Link to="/register" className="text-primary font-bold hover:underline" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Create an account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
