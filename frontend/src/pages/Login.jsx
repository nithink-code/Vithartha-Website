import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginRole, setLoginRole] = useState('user'); // 'user' or 'admin'
    const googleBtnRef = useRef(null);
    const [googleBtnWidth, setGoogleBtnWidth] = useState(300);

    // Dynamically measure container width for Google button
    useEffect(() => {
        const el = googleBtnRef.current;
        if (!el) return;
        const measure = () => {
            const w = el.clientWidth;
            if (w > 0) setGoogleBtnWidth(Math.min(w, 400));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.role === 'admin') {
                    toast.success("Welcome Login Successful");
                } else {
                    toast.success("Login Successful");
                }

                localStorage.setItem('user', JSON.stringify(data));
                window.dispatchEvent(new Event('storage'));

                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    // Check for existing leads to bypass onboarding for users
                    const userId = data._id || data.id;
                    const leadsResponse = await fetch(`${import.meta.env.VITE_API_URL}/leads?userId=${userId}`);
                    const leads = await leadsResponse.json();

                    if (leads && leads.length > 0) {
                        navigate('/dashboard');
                    } else {
                        navigate('/onboarding');
                    }
                }

            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken: credentialResponse.credential }),
            });

            const data = await response.json();

            if (data.needsRegistration) {
                toast.success('Welcome! Please complete your registration.');
                navigate('/register', { state: { initialData: data.user } });
            } else if (response.ok) {
                if (data.role === 'admin') {
                    toast.success("Welcome Login Successful");
                } else {
                    toast.success("Login Successful");
                }

                localStorage.setItem('user', JSON.stringify(data));
                window.dispatchEvent(new Event('storage'));

                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    // Check for existing leads to bypass onboarding for users
                    const userId = data._id || data.id;
                    const leadsResponse = await fetch(`${import.meta.env.VITE_API_URL}/leads?userId=${userId}`);
                    const leads = await leadsResponse.json();

                    if (leads && leads.length > 0) {
                        navigate('/dashboard');
                    } else {
                        navigate('/onboarding');
                    }
                }
            } else {
                toast.error(data.message || 'Google Login failed');
            }
        } catch (error) {
            console.error('Google Auth Error:', error);
            toast.error('Authentication failed');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
            position: 'relative',
            overflow: 'hidden',
            padding: 'clamp(5rem, 10vw, 2rem) 1rem',
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at 50% 50%, rgba(0,123,255,0.04) 0%, transparent 50%)`,
                pointerEvents: 'none',
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '460px', zIndex: 1 }}
            >
                <div className="auth-card" style={{
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border)',
                    padding: '1.8rem 2.5rem',
                    boxShadow: 'var(--shadow-card)',
                }}>
                    {/* Compact Header */}
                    <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                        <img src="/vithartha-logo.png" alt="Logo" style={{ height: '22px', marginBottom: '0.6rem' }} />
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.1rem' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Sign in to continue</p>
                    </div>

                    {/* Role Selector */}
                    <div style={{
                        display: 'flex',
                        background: 'var(--bg-card-alt)',
                        padding: '0.2rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)',
                        marginBottom: '1.2rem',
                    }}>
                        <button
                            onClick={() => setLoginRole('user')}
                            style={{
                                flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: '0.3s',
                                background: loginRole === 'user' ? 'var(--grad-blue)' : 'transparent',
                                color: loginRole === 'user' ? 'white' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            <User size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> User Login
                        </button>
                        <button
                            onClick={() => setLoginRole('admin')}
                            style={{
                                flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: '0.3s',
                                background: loginRole === 'admin' ? 'var(--grad-blue)' : 'transparent',
                                color: loginRole === 'admin' ? 'white' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            <ShieldCheck size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Admin Login
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div>
                            <div className="input-group" style={{ background: 'var(--bg-card)', padding: '0.55rem 1rem', border: '1px solid var(--border)' }}>
                                <Mail size={14} color="var(--text-muted)" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ color: 'var(--text)', fontSize: '0.85rem' }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="input-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.55rem 1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <Lock size={14} color="var(--text-muted)" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ color: 'var(--text)', fontSize: '0.85rem' }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.4rem' }}>
                            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--v-blue)', fontSize: '0.68rem', fontWeight: 600 }}>Forgot password?</button>
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-full)', background: 'var(--grad-blue)', color: 'white', fontWeight: 800, border: 'none', fontSize: '0.88rem', marginTop: '0.4rem',
                                boxShadow: 'var(--blue-glow)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                            }}
                        >
                            {loading ? "Signing in..." : <>Sign In <LogIn size={15} style={{ marginLeft: '6px' }} /></>}
                        </button>
                    </form>

                    <div style={{ position: 'relative', margin: '1rem 0', textAlign: 'center' }}>
                        <div style={{ height: '1px', background: 'var(--border)', position: 'absolute', top: '50%', left: 0, right: 0 }} />
                        <span style={{ position: 'relative', background: 'var(--card-bg)', padding: '0 0.8rem', color: 'var(--text-muted)', fontSize: '0.68rem' }}>or</span>
                    </div>

                    <div ref={googleBtnRef} className="google-oauth-wrap" style={{ display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-full)' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google Login Failed')}
                            text="signin_with"
                            theme="filled_black"
                            shape="pill"
                            width={googleBtnWidth}
                        />
                    </div>

                    <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            New here? <Link to="/register" style={{ color: 'var(--v-blue)', fontWeight: 700, textDecoration: 'none' }}>Create account</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
