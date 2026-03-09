import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialData = location.state?.initialData || {};

    const [formData, setFormData] = useState({
        name: initialData.name || '',
        email: initialData.email || '',
        company: '',
        password: '',
        role: 'user'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [regRole, setRegRole] = useState('user');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRoleChange = (role) => {
        setRegRole(role);
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Welcome aboard, ${data.name || formData.name}! Taking you to onboarding...`, {
                    icon: '✅',
                });
                localStorage.setItem('user', JSON.stringify(data));
                window.dispatchEvent(new Event('storage'));
                setTimeout(() => {
                    if (data.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/onboarding');
                    }
                }, 1200);
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
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
                background: `
                    radial-gradient(circle at 10% 10%, rgba(0,123,255,0.05) 0%, transparent 40%),
                    radial-gradient(circle at 90% 90%, rgba(0,123,255,0.05) 0%, transparent 40%)
                `,
                pointerEvents: 'none',
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    width: '100%',
                    maxWidth: '620px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Modern Glass Card */}
                <div className="auth-card" style={{
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border)',
                    padding: '1.8rem 2.8rem',
                    boxShadow: 'var(--shadow-card)',
                }}>
                    {/* Back button */}
                    <button
                        id="reg-back-btn"
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            color: 'var(--text-muted)', fontSize: '0.75rem',
                            fontWeight: 600, marginBottom: '1.2rem',
                            padding: 0, transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'white'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        <ArrowLeft size={13} /> Back to home
                    </button>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'inline-flex', padding: '0.4rem', background: 'rgba(74,173,160,0.1)', borderRadius: '50%', marginBottom: '0.6rem' }}>
                            <ShieldCheck size={20} color="#4AADA0" />
                        </div>
                        <h1 style={{
                            fontSize: '1.5rem', fontWeight: 800,
                            color: 'var(--text)', marginBottom: '0.2rem',
                            letterSpacing: '-0.02em',
                        }}>
                            Create Account
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            Join Vithartha as a business partner
                        </p>
                    </div>

                    {/* Role Selector */}
                    <div style={{
                        display: 'flex',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '0.2rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)',
                        marginBottom: '1.2rem',
                    }}>
                        <button
                            type="button"
                            onClick={() => handleRoleChange('user')}
                            style={{
                                flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: '0.3s',
                                background: regRole === 'user' ? 'var(--grad-blue)' : 'transparent',
                                color: regRole === 'user' ? 'white' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            <User size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> User Account
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleChange('admin')}
                            style={{
                                flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: '0.3s',
                                background: regRole === 'admin' ? 'var(--grad-blue)' : 'transparent',
                                color: regRole === 'admin' ? 'white' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            <ShieldCheck size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Admin Account
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        <div className="reg-name-company-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="input-label" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.3rem' }}>Full Name *</label>
                                <div className="input-group" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.5rem 0.9rem' }}>
                                    <User size={15} color="var(--text-muted)" />
                                    <input
                                        id="reg-name"
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={{ color: 'var(--text)', fontSize: '0.85rem' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="input-label" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.3rem' }}>Company</label>
                                <div className="input-group" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.5rem 0.9rem' }}>
                                    <Building size={15} color="var(--text-muted)" />
                                    <input
                                        id="reg-company"
                                        type="text"
                                        name="company"
                                        placeholder="Optional"
                                        value={formData.company}
                                        onChange={handleChange}
                                        style={{ color: 'var(--text)', fontSize: '0.85rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="input-label" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.3rem' }}>Email Address *</label>
                            <div className="input-group" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.5rem 0.9rem' }}>
                                <Mail size={15} color="var(--text-muted)" />
                                <input
                                    id="reg-email"
                                    type="email"
                                    name="email"
                                    placeholder="you@company.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ color: 'var(--text)', fontSize: '0.85rem' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="input-label" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.3rem' }}>Password *</label>
                            <div className="input-group" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.5rem 0.9rem' }}>
                                <Lock size={15} color="var(--text-muted)" />
                                <input
                                    id="reg-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Min 8 characters"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ color: 'var(--text)', fontSize: '0.85rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', marginTop: '0.4rem' }}>
                            <input
                                type="checkbox"
                                id="reg-agree"
                                checked={agreed}
                                onChange={e => setAgreed(e.target.checked)}
                                style={{ accentColor: 'var(--v-blue)', cursor: 'pointer' }}
                            />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                I agree to the <span style={{ color: 'var(--v-blue)', fontWeight: 600 }}>Agreement</span> and <span style={{ color: 'var(--v-blue)', fontWeight: 600 }}>Privacy Policy</span>.
                            </span>
                        </label>

                        <button
                            id="reg-submit-btn"
                            type="submit"
                            className="btn"
                            disabled={loading || !agreed}
                            style={{
                                width: '100%', padding: '0.9rem',
                                fontSize: '0.9rem',
                                borderRadius: 'var(--radius-full)',
                                marginTop: '0.5rem',
                                justifyContent: 'center',
                                background: 'var(--grad-blue)',
                                color: 'white',
                                border: 'none',
                                fontWeight: 800,
                                boxShadow: 'var(--blue-glow)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                opacity: agreed ? 1 : 0.6,
                            }}
                        >
                            {loading ? (
                                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                            ) : (
                                <>Get Started Now</>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Already registered?{' '}
                            <Link
                                to="/login"
                                id="reg-login-link"
                                style={{ color: 'var(--v-blue)', fontWeight: 700, textDecoration: 'none' }}
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
