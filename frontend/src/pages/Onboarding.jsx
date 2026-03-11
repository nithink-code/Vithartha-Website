import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Send, BarChart, Rocket, Building, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const steps = [
    { label: 'Business Stage', step: 1 },
    { label: 'Assistance Needed', step: 2 },
    { label: 'Timeline', step: 3 },
];

const businessStages = [
    { value: 'Startup', icon: Rocket, label: 'Starting Up', desc: 'Idea or new enterprise — building from the ground up', color: '#4361ee' },
    { value: 'Growing', icon: TrendingUp, label: 'Growing', desc: 'Looking to scale — expanding to new markets', color: '#7c3aed' },
    { value: 'Established', icon: Building, label: 'Established', desc: 'Optimization & retention — stable and looking to improve', color: '#10b981' },
];

const needsOptions = [
    { value: 'GST Compliance', icon: CheckCircle, color: '#4361ee' },
    { value: 'Income Tax', icon: BarChart, color: '#7c3aed' },
    { value: 'Virtual CFO', icon: TrendingUp, color: '#f72585' },
    { value: 'Registration', icon: Building, color: '#10b981' },
    { value: 'Legal Advisory', icon: Zap, color: '#f59e0b' },
    { value: 'Payroll', icon: CheckCircle, color: '#3b82f6' },
];

const urgencyOptions = [
    { value: 'Immediate (ASAP)', label: 'Immediate', sub: 'Need help right away', color: '#ef4444', dot: '#ef4444' },
    { value: 'Planning (1-3 months)', label: '1–3 Months', sub: 'Planning ahead', color: '#f59e0b', dot: '#f59e0b' },
    { value: 'Exploring (Quarterly)', label: 'Exploring', sub: 'Just browsing options', color: '#10b981', dot: '#10b981' },
];

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ businessStage: '', needs: [], urgency: '' });
    const navigate = useNavigate();

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'admin') {
            navigate('/admin');
            return;
        }

        const checkExistingInterests = async () => {
            if (user) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/leads?userId=${user._id || user.id}`);
                    const leads = await response.json();
                    if (leads && leads.length > 0) {
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error("Error checking interests:", error);
                }
            }
        };
        checkExistingInterests();
    }, [navigate]);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const toggleNeed = (need) => {
        setFormData(prev => ({
            ...prev,
            needs: prev.needs.includes(need)
                ? prev.needs.filter(n => n !== need)
                : [...prev.needs, need],
        }));
    };

    const handleSubmit = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${apiUrl}/onboarding/recommend`, formData);
            if (response.data.success) {
                navigate('/recommendations', { state: { recommendations: response.data.data, userData: formData } });
            }
        } catch {
            toast.error('Using smart defaults for your roadmap.');
            navigate('/recommendations', { state: { fallback: true, userData: formData } });
        }
    };

    const slideVariants = {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
        center: { opacity: 1, x: 0 },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
            padding: '6rem 1.25rem 2rem',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(67,97,238,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '460px' }}>
                {/* Progress steps */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', gap: '0' }}>
                    {steps.map((s, i) => (
                        <React.Fragment key={s.step}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                <motion.div
                                    animate={{
                                        background: step > s.step ? 'var(--grad-primary)' : step === s.step ? 'var(--grad-primary)' : 'var(--card-bg)',
                                        border: step === s.step ? '2.5px solid var(--primary)' : step > s.step ? '2.5px solid var(--primary)' : '2.5px solid var(--border)',
                                        scale: step === s.step ? 1.1 : 1,
                                    }}
                                    style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        color: step >= s.step ? 'white' : 'var(--text-muted)',
                                        transition: 'all 0.3s',
                                        boxShadow: step === s.step ? '0 0 0 4px rgba(67,97,238,0.15)' : 'none',
                                    }}
                                >
                                    {step > s.step ? <CheckCircle size={18} color="white" /> : s.step}
                                </motion.div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: step === s.step ? 'var(--primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                    {s.label}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div style={{
                                    height: 2,
                                    width: '56px',
                                    background: step > s.step ? 'var(--grad-primary)' : 'var(--border)',
                                    marginBottom: '22px',
                                    transition: 'background 0.3s',
                                }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Card */}
                <motion.div
                    layout
                    style={{
                        background: 'var(--card-bg)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-lg)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Card top gradient bar */}
                    <div style={{ height: 4, background: 'var(--grad-primary)' }} />

                    <div style={{ padding: '1.4rem 1.6rem' }}>
                        <AnimatePresence mode="wait" custom={1}>
                            {/* Step 1: Business Stage */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    custom={1}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <div style={{ marginBottom: '1.2rem' }}>
                                        <div className="section-tag" style={{ display: 'inline-flex', fontSize: '0.70rem' }}>Step 1 of 3</div>
                                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '-0.03em' }}>
                                            Where is your business today?
                                        </h2>
                                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>Select the option that best describes your current situation.</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                        {businessStages.map(({ value, icon: Icon, label, desc, color }) => {
                                            const selected = formData.businessStage === value;
                                            return (
                                                <motion.button
                                                    key={value}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => setFormData({ ...formData, businessStage: value })}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1.2rem',
                                                        padding: '0.85rem 1.1rem',
                                                        borderRadius: 'var(--radius-lg)',
                                                        border: selected ? `2px solid ${color}` : '2px solid var(--border)',
                                                        background: selected ? `${color}10` : 'var(--bg)',
                                                        cursor: 'pointer',
                                                        textAlign: 'left',
                                                        width: '100%',
                                                        transition: 'all 0.2s',
                                                        fontFamily: 'var(--font-body)',
                                                    }}
                                                    id={`stage-${value.toLowerCase()}`}
                                                >
                                                    <div style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: 'var(--radius-md)',
                                                        background: `${color}18`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                    }}>
                                                        <Icon size={17} color={color} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontWeight: 700, color: selected ? color : 'var(--text)', margin: '0 0 0.15rem', fontSize: '0.88rem' }}>{label}</p>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.76rem', margin: 0 }}>{desc}</p>
                                                    </div>
                                                    {selected && <CheckCircle size={20} color={color} />}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            id="onboard-next-1"
                                            className="btn btn-primary"
                                            onClick={handleNext}
                                            disabled={!formData.businessStage}
                                            style={{ borderRadius: 'var(--radius-full)', padding: '0.55rem 1.5rem', fontSize: '0.85rem' }}
                                        >
                                            Continue <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Needs */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    custom={1}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <div style={{ marginBottom: '1.2rem' }}>
                                        <div className="section-tag" style={{ display: 'inline-flex', fontSize: '0.70rem' }}>Step 2 of 3</div>
                                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '-0.03em' }}>
                                            What assistance do you need?
                                        </h2>
                                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>Select all that apply — we'll build your custom roadmap.</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                        {needsOptions.map(({ value, icon: Icon, color }) => {
                                            const selected = formData.needs.includes(value);
                                            return (
                                                <motion.button
                                                    key={value}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => toggleNeed(value)}
                                                    id={`need-${value.toLowerCase().replace(/ /g, '-')}`}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.8rem',
                                                        padding: '0.55rem 0.8rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: selected ? `2px solid ${color}` : '2px solid var(--border)',
                                                        background: selected ? `${color}10` : 'var(--bg)',
                                                        cursor: 'pointer',
                                                        fontFamily: 'var(--font-body)',
                                                        fontSize: '0.82rem',
                                                        fontWeight: selected ? 700 : 500,
                                                        color: selected ? color : 'var(--text-secondary)',
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    <Icon size={15} color={selected ? color : 'var(--text-muted)'} />
                                                    {value}
                                                    {selected && <CheckCircle size={14} color={color} style={{ marginLeft: 'auto' }} />}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    {formData.needs.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{ marginTop: '1.2rem', padding: '0.8rem 1.2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                                        >
                                            <p style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, margin: 0 }}>
                                                ✓ {formData.needs.length} service{formData.needs.length > 1 ? 's' : ''} selected: {formData.needs.join(', ')}
                                            </p>
                                        </motion.div>
                                    )}

                                    <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <button className="btn" id="onboard-back-2" onClick={handleBack} style={{ borderRadius: 'var(--radius-full)' }}>
                                            <ArrowLeft size={16} /> Back
                                        </button>
                                        <button
                                            id="onboard-next-2"
                                            className="btn btn-primary"
                                            onClick={handleNext}
                                            disabled={formData.needs.length === 0}
                                            style={{ borderRadius: 'var(--radius-full)', padding: '0.55rem 1.5rem', fontSize: '0.85rem' }}
                                        >
                                            Continue <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Urgency */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    custom={1}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <div style={{ marginBottom: '1.2rem' }}>
                                        <div className="section-tag" style={{ display: 'inline-flex', fontSize: '0.70rem' }}>Step 3 of 3</div>
                                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '-0.03em' }}>
                                            What's your timeline?
                                        </h2>
                                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>This helps us prioritize and assign the right advisor.</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                        {urgencyOptions.map(({ value, label, sub, color, dot }) => {
                                            const selected = formData.urgency === value;
                                            return (
                                                <motion.button
                                                    key={value}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => setFormData({ ...formData, urgency: value })}
                                                    id={`urgency-${label.toLowerCase().replace(/[^a-z]/g, '-')}`}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1.2rem',
                                                        padding: '0.85rem 1.1rem',
                                                        borderRadius: 'var(--radius-lg)',
                                                        border: selected ? `2px solid ${color}` : '2px solid var(--border)',
                                                        background: selected ? `${color}10` : 'var(--bg)',
                                                        cursor: 'pointer',
                                                        textAlign: 'left',
                                                        width: '100%',
                                                        fontFamily: 'var(--font-body)',
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontWeight: 700, color: selected ? color : 'var(--text)', margin: '0 0 0.2rem' }}>{label}</p>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>{sub}</p>
                                                    </div>
                                                    {selected && <CheckCircle size={20} color={color} />}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <button className="btn" id="onboard-back-3" onClick={handleBack} style={{ borderRadius: 'var(--radius-full)' }}>
                                            <ArrowLeft size={16} /> Back
                                        </button>
                                        <button
                                            id="onboard-submit"
                                            className="btn btn-primary"
                                            onClick={handleSubmit}
                                            disabled={!formData.urgency}
                                            style={{ borderRadius: 'var(--radius-full)', padding: '0.55rem 1.5rem', fontSize: '0.85rem' }}
                                        >
                                            Analyze & Recommend <Send size={17} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Onboarding;
