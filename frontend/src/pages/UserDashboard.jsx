import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    LayoutDashboard, FileText, Plus, Clock,
    ArrowUpRight, LogOut, CheckCircle, Search,
    AlertCircle, TrendingUp, Sparkles, Target, Zap, X
} from 'lucide-react';

/* ══════════════════════════════════════════════════
   GREEN GLOW CARD  – minimal tilt, smooth green glow
══════════════════════════════════════════════════ */
const PremiumCard = ({ children, style = {}, className = '', glowColor = 'rgba(16, 185, 129, 0.15)' }) => {
    const cardRef = useRef(null);
    const glowRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        if (glowRef.current) {
            glowRef.current.style.left = `${x}px`;
            glowRef.current.style.top = `${y}px`;
            glowRef.current.style.opacity = '1';
        }

        const baseGlow = glowColor.split(',').slice(0, 3).join(',');
        card.style.borderColor = 'rgba(255, 255, 255, 0.22)';
        card.style.boxShadow = `inset 0 0 20px ${baseGlow}, 0.15)`;
    }, [glowColor]);

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'none';
        card.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        card.style.boxShadow = 'none';
        if (glowRef.current) glowRef.current.style.opacity = '0';
    }, []);

    return (
        <div
            ref={cardRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                background: 'linear-gradient(135deg, #252525 0%, #151515 100%)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.4s ease',
                position: 'relative',
                overflow: 'hidden',
                ...style,
            }}
        >
            <div
                ref={glowRef}
                style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 0,
                }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </div>
    );
};

import Loader from '../components/Loader';

const UserDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);
    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const isAdmin = storedUser?.role === 'admin';

    useEffect(() => {
        if (isAdmin) {
            navigate('/admin');
            return;
        }

        const fetchUserServices = async () => {
            try {
                const userId = storedUser?._id || storedUser?.id;
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await axios.get(`${apiUrl}/leads?userId=${userId}`);
                setLeads(response.data);
            } catch (error) {
                console.error("Error fetching services:", error);
                toast.error("Failed to load your services");
            } finally {
                // Keep the loader visible for a professional amount of time
                setTimeout(() => setLoading(false), 500);
            }
        };

        if (storedUser && !isAdmin) {
            fetchUserServices();
        } else {
            setLoading(false);
        }
    }, []);

    const handleUploadDocument = async (leadId) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            // Mock document upload - just adding an entry to the documents array
            const response = await axios.patch(`${apiUrl}/leads/${leadId}`, {
                $push: { documents: { name: 'Business_Proof.pdf', url: '#' } }
            });

            if (response.data.success) {
                toast.success("Document uploaded successfully!");
                // Refresh leads
                const userId = storedUser?._id || storedUser?.id;
                const leadsRes = await axios.get(`${apiUrl}/leads?userId=${userId}`);
                setLeads(leadsRes.data);
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload document");
        }
    };

    const stats = {
        pending: leads.filter(l => l.status === 'Open').length,
        inProgress: leads.filter(l => l.status === 'InProgress').length,
        completed: leads.filter(l => l.status === 'Completed').length,
    };

    if (loading) return <Loader minimal={true} />;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            color: 'var(--text)',
            paddingTop: 'clamp(80px, 12vw, 100px)',
            paddingBottom: '60px',
            position: 'relative'
        }}>
            {/* Background Gradient Texture */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% -20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)',
                pointerEvents: 'none'
            }} />
            {/* Header / Stats Title */}
            <div className="dash-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                <div className="dash-header" style={{ textAlign: 'center', marginBottom: '3.5rem', marginTop: '4.5rem' }}>
                    <h1 className="dash-title" style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '0.5rem' }}>
                        Manage Your Services <span style={{ color: '#10b981' }}>.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 400 }}>
                        Hello {storedUser.name || 'User'}, track and control your active business milestones
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                        <button
                            onClick={() => window.triggerVitharthaRefresh && window.triggerVitharthaRefresh()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.5)',
                                padding: '0.5rem 1.2rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.querySelector('svg')?.classList.add('spin-slow');
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                e.currentTarget.querySelector('svg')?.classList.remove('spin-slow');
                            }}
                        >
                            <TrendingUp size={14} /> Refresh Portfolio Status
                        </button>
                    </div>
                </div>

                {/* Separate Stats Card inspired by image */}
                <PremiumCard
                    glowColor="rgba(139, 92, 246, 0.15)"
                    className="dash-stats-card"
                    style={{
                        background: 'linear-gradient(145deg, #252525 0%, #151515 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                        borderRadius: '32px',
                        padding: '2.5rem',
                        marginBottom: '2.5rem'
                    }}
                >
                    <div className="dash-user-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', width: '100%' }}>
                        {[
                            { label: 'Pending', count: stats.pending, color: '#f59e0b' },
                            { label: 'In Progress', count: stats.inProgress, color: '#4361ee' },
                            { label: 'Completed', count: stats.completed, color: '#10b981' }
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(139, 92, 246, 0.08)',
                                borderRadius: '24px',
                                padding: '2rem 1rem',
                                textAlign: 'center',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#ffffff', lineHeight: 1, marginBottom: '0.5rem' }}>
                                    {item.count}<span style={{ color: '#8b5cf6', fontSize: '1.8rem' }}>+</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </PremiumCard>

                <PremiumCard
                    className="dash-portfolio-card"
                    style={{
                        background: 'linear-gradient(135deg, #252525 0%, #151515 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.12)',
                        borderRadius: '32px',
                        padding: '3rem',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="dash-portfolio-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 className="dash-portfolio-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>Service Portfolio</h3>
                            <button className="btn btn-primary" onClick={() => navigate('/services')} style={{
                                padding: '0.6rem 1.4rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600,
                                background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', boxShadow: '0 10px 20px -10px rgba(16, 185, 129, 0.5)',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}>
                                New Service <Plus size={16} />
                            </button>
                        </div>

                        {leads.length > 0 ? leads.map((lead, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="service-row"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(255,255,255,0.02)',
                                    padding: '1.5rem 2rem',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <h4 className="dash-service-name" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>{lead.serviceName}</h4>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            color: lead.status === 'Completed' ? '#10b981' : (lead.status === 'InProgress' ? '#4361ee' : '#f59e0b'),
                                            background: lead.status === 'Completed' ? 'rgba(16,185,129,0.1)' : (lead.status === 'InProgress' ? 'rgba(67,97,238,0.1)' : 'rgba(245,158,11,0.1)'),
                                            padding: '3px 10px',
                                            borderRadius: '6px'
                                        }}>
                                            {lead.status === 'Open' ? 'Pending' : lead.status}
                                        </span>
                                    </div>
                                    <div className="dash-service-meta" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 500 }}>
                                            ID: #{lead._id?.slice(-6).toUpperCase()}
                                        </span>
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                                            Ordered: {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </span>
                                        <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>₹{lead.cost || 1000}</span>
                                    </div>
                                </div>

                                <div className="service-row-actions" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    {lead.status === 'InProgress' && (
                                        <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                                                <span>Progress</span>
                                                <span>65%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                                <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1, delay: 0.5 }} style={{ height: '100%', background: '#4361ee' }} />
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setSelectedServiceDetail(lead)}
                                        style={{
                                            background: 'white',
                                            border: 'none',
                                            color: 'black',
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(255,255,255,0.3)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        View Details <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="dash-empty-state" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <AlertCircle size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1.5rem' }} />
                                <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', fontWeight: 700 }}>No active services found</h4>
                                <p style={{ color: 'rgba(255,255,255,0.2)', maxWidth: '300px', margin: '1rem auto' }}>Start your journey by selecting a service from our curated recommendations.</p>
                                <button onClick={() => navigate('/services')} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '0.6rem 1.5rem', borderRadius: '12px', fontWeight: 700, marginTop: '1rem', cursor: 'pointer' }}>
                                    Explore Services
                                </button>
                            </div>
                        )}
                    </div>
                </PremiumCard>
            </div>

            {/* Service Detail Modal */}
            <AnimatePresence>
                {selectedServiceDetail && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', padding: '2rem'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="dash-modal-content"
                            style={{
                                width: '100%', maxWidth: '480px',
                                background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                                borderRadius: '28px',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                padding: '3rem',
                                position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setSelectedServiceDetail(null)}
                                style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.2rem' }}>Service Details</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label className="dash-modal-label" style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Service Name</label>
                                    <div className="dash-modal-val" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginTop: '0.2rem' }}>{selectedServiceDetail.serviceName}</div>
                                </div>

                                <div className="dash-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label className="dash-modal-label" style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</label>
                                        <div className="dash-modal-val" style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginTop: '0.1rem' }}>{selectedServiceDetail.status === 'Open' ? 'Pending' : selectedServiceDetail.status}</div>
                                    </div>
                                    <div>
                                        <label className="dash-modal-label" style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cost</label>
                                        <div className="dash-modal-val" style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginTop: '0.1rem' }}>₹{selectedServiceDetail.cost || 1000}</div>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order Date</label>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginTop: '0.1rem' }}>
                                        {new Date(selectedServiceDetail.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Estimated Completion</label>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginTop: '0.1rem' }}>
                                        {new Date(new Date(selectedServiceDetail.createdAt).getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Service Documents</label>
                                    <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {selectedServiceDetail.documents && selectedServiceDetail.documents.length > 0 ? (
                                            selectedServiceDetail.documents.map((doc, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                                                    <FileText size={14} /> {doc.name}
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>No documents uploaded yet.</p>
                                        )}
                                        <button
                                            onClick={() => handleUploadDocument(selectedServiceDetail._id)}
                                            style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px dashed rgba(255,255,255,0.2)',
                                                color: 'white',
                                                padding: '0.4rem',
                                                borderRadius: '8px',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                marginTop: '0.3rem'
                                            }}
                                        >
                                            <Plus size={12} /> Upload required document
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedServiceDetail(null)}
                                style={{
                                    width: '100%', padding: '0.8rem', background: '#10b981', border: 'none', color: 'white',
                                    borderRadius: '12px', fontWeight: 800, marginTop: '1.5rem', cursor: 'pointer',
                                    boxShadow: '0 6px 12px -6px rgba(16, 185, 129, 0.4)'
                                }}
                            >
                                Close Details
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default UserDashboard;
