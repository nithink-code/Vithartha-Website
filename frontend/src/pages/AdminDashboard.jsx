import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Briefcase, TrendingUp, Bell, Search, Filter,
    Check, MessageSquare, ShieldAlert, FileText, ArrowUpRight,
    RefreshCw, X, AlertCircle, Building, CheckCircle, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const PremiumCard = ({ children, style = {}, className = '', glowColor = 'rgba(67, 97, 238, 0.15)' }) => {
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

        const rotX = ((y - cy) / cy) * -3;
        const rotY = ((x - cx) / cx) * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02) translateY(-2px)`;

        if (glowRef.current) {
            glowRef.current.style.left = `${x}px`;
            glowRef.current.style.top = `${y}px`;
            glowRef.current.style.opacity = '1';
        }

        const baseGlow = glowColor.split(',').slice(0, 3).join(',');
        card.style.borderColor = `${baseGlow}, 0.5)`;
    }, [glowColor]);

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.borderColor = 'rgba(255, 255, 255, 0.08)';
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
                borderRadius: '24px',
                border: '1px solid var(--border)',
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.4s ease, box-shadow 0.4s ease',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                ...style,
            }}
        >
            <div
                ref={glowRef}
                style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
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

const AdminDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);

    const fetchLeads = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${apiUrl}/leads`);
            setLeads(response.data);
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast.error("Failed to load platform data");
        } finally {
            // Keep the loader visible for a professional amount of time
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleApprove = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await axios.patch(`${apiUrl}/leads/${id}`, { status: 'Completed' });
            if (response.data) {
                toast.success('Service request approved & marked as Completed');
                fetchLeads();
                if (selectedLead?._id === id) setSelectedLead(null);
            }
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    const stats = {
        total: leads.length,
        pending: leads.filter(l => l.status === 'Open').length,
        completed: leads.filter(l => l.status === 'Completed').length,
        revenue: (leads.length * 2500).toLocaleString('en-IN')
    };

    const filteredLeads = leads.filter(l =>
        l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            toast.error("Please enter a name or service to search");
            return;
        }
        if (filteredLeads.length === 1) {
            setSelectedLead(filteredLeads[0]);
            toast.success(`Displaying details for ${filteredLeads[0].name}`);
        } else if (filteredLeads.length > 1) {
            toast.success(`Found ${filteredLeads.length} matching results`);
        } else {
            toast.error("No matching users or services found");
        }
    };

    if (loading) return <Loader minimal={true} />;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            color: 'var(--text)',
            paddingTop: 'clamp(100px, 14vw, 140px)',
            paddingBottom: '80px',
            position: 'relative'
        }}>
            {/* Background Texture */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% -20%, rgba(67, 97, 238, 0.05) 0%, transparent 50%)',
                pointerEvents: 'none'
            }} />

            <div className="admin-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                <div className="admin-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(67,97,238,0.08)', borderRadius: '100px', border: '1px solid rgba(67,97,238,0.15)', marginBottom: '1.5rem' }}>
                        <ShieldAlert size={15} color="#4361ee" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4361ee', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Administrator Access</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, letterSpacing: '-0.03em', margin: 0, color: 'var(--text)' }}>
                        Admin Dashboard <span style={{ color: '#4361ee' }}>.</span>
                    </h1>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.6rem', maxWidth: '600px', margin: '0.6rem auto 2.5rem', lineHeight: 1.6 }}>
                        Overseeing all active Vithartha service engagements with professional precision
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                        <button
                            onClick={() => window.triggerVitharthaRefresh && window.triggerVitharthaRefresh()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                background: 'rgba(67, 97, 238, 0.05)',
                                border: '1px solid rgba(67, 97, 238, 0.15)',
                                color: '#4361ee',
                                padding: '0.6rem 1.5rem',
                                borderRadius: '100px',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(67, 97, 238, 0.1)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(67, 97, 238, 0.2)';
                                e.currentTarget.querySelector('svg')?.classList.add('spin-slow');
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(67, 97, 238, 0.05)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.querySelector('svg')?.classList.remove('spin-slow');
                            }}
                        >
                            <RefreshCw size={15} /> Refresh Global Pipeline
                        </button>
                    </div>

                    {/* Centered Search Bar below heading */}
                    <div className="admin-search-wrap" style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <div className="admin-search-input-group" style={{
                            flex: 1,
                            display: 'flex', alignItems: 'center', gap: '12px',
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            padding: '0.8rem 1.2rem', borderRadius: '18px',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <Search size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Search by name, email or service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ background: 'none', border: 'none', color: 'var(--text)', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                            />
                        </div>
                        <button onClick={handleSearch} style={{
                            background: 'var(--v-blue)', border: 'none',
                            color: 'white', padding: '0.8rem 2rem', borderRadius: '18px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700,
                            boxShadow: 'var(--blue-glow)',
                            transition: 'all 0.3s'
                        }}>
                            <Search size={18} /> Search
                        </button>
                    </div>
                </div>

                {/* Stats Summary Panel */}
                <PremiumCard
                    glowColor="rgba(67, 97, 238, 0.1)"
                    style={{
                        background: 'linear-gradient(145deg, #252525 0%, #151515 100%)',
                        border: '1px solid var(--border)',
                        padding: '2rem',
                        marginBottom: '2.5rem',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {[
                            { label: 'Platform Users', value: stats.total, icon: Users, color: '#4361ee' },
                            { label: 'Pending Approval', value: stats.pending, icon: Clock, color: '#f59e0b' },
                            { label: 'Fulfilled', value: stats.completed, icon: CheckCircle, color: '#10b981' },
                            { label: 'Revenue (₹)', value: stats.revenue, icon: TrendingUp, color: '#7c3aed' }
                        ].map((s, idx) => (
                            <div key={idx} style={{ padding: '1.5rem', borderRadius: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ padding: '8px', background: `${s.color}10`, borderRadius: '10px' }}>
                                        <s.icon size={18} color={s.color} />
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{s.label}</span>
                                </div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                </PremiumCard>

                {/* Main Content: User Service List */}
                <PremiumCard
                    className="admin-pipeline-card"
                    style={{
                        background: 'linear-gradient(135deg, #252525 0%, #151515 100%)',
                        border: '1px solid var(--border)',
                        padding: '2.5rem',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    <div className="admin-pipeline-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>Active Service Pipeline</h2>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Showing {filteredLeads.length} entries</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {filteredLeads.length > 0 ? filteredLeads.map((lead, i) => (
                            <motion.div
                                key={lead._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedLead(lead)}
                                className="admin-lead-row"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1.5fr 1fr 1.2fr',
                                    alignItems: 'center',
                                    padding: '1.5rem 2rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.04)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.borderColor = 'rgba(67,97,238,0.2)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                                }}
                            >
                                {/* User Info */}
                                <div className="admin-lead-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #4361ee, #7c3aed)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1rem', fontWeight: 800, color: 'white'
                                    }}>
                                        {lead.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>{lead.name}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{lead.email}</div>
                                    </div>
                                </div>

                                {/* Service Label */}
                                <div className="admin-lead-service" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{lead.serviceName}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#4361ee', fontWeight: 600, letterSpacing: '0.02em' }}>{lead.user?.profile?.industry || 'General Business'}</div>
                                </div>

                                {/* Documents Status */}
                                <div className="admin-lead-docs" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={16} color={(lead.documents?.length > 0) ? '#10b981' : 'rgba(255,255,255,0.2)'} />
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: (lead.documents?.length > 0) ? '#10b981' : 'rgba(255,255,255,0.4)' }}>
                                        {lead.documents?.length || 0} Files
                                    </div>
                                </div>

                                {/* Actions / Status */}
                                <div className="admin-lead-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    {lead.status === 'Completed' ? (
                                        <div style={{
                                            padding: '8px 16px', background: 'rgba(16,185,129,0.1)',
                                            color: '#10b981', borderRadius: '10px', fontSize: '0.75rem',
                                            fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
                                        }}>
                                            Completed
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => handleApprove(lead._id, e)}
                                            style={{
                                                padding: '8px 20px',
                                                background: '#10b981',
                                                border: 'none',
                                                color: 'white',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Check size={16} /> Approve
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <AlertCircle size={40} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
                                <div style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>No requests found in pipeline</div>
                            </div>
                        )}
                    </div>
                </PremiumCard>
            </div>

            {/* Detailed View Modal */}
            <AnimatePresence>
                {selectedLead && (
                    <div className="admin-modal-overlay" style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', padding: '2rem'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="admin-modal-content"
                            style={{
                                width: '100%', maxWidth: '600px',
                                background: 'linear-gradient(135deg, #151515 0%, #000000 100%)',
                                borderRadius: '32px', border: '1px solid rgba(67, 97, 238, 0.2)',
                                padding: '3rem', position: 'relative'
                            }}
                        >
                            <button onClick={() => setSelectedLead(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>

                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #4361ee, #7c3aed)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: 'white', boxShadow: '0 10px 30px rgba(67, 97, 238, 0.3)' }}>
                                    {selectedLead.name[0]}
                                </div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{selectedLead.name}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Lead Assessment & Verification</p>
                            </div>

                            <div className="admin-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Service</label>
                                    <div style={{ fontWeight: 700 }}>{selectedLead.serviceName}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Applied On</label>
                                    <div style={{ fontWeight: 700 }}>{new Date(selectedLead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Industry</label>
                                    <div style={{ fontWeight: 700 }}>{selectedLead.user?.profile?.industry || 'N/A'}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</label>
                                    <div style={{ fontWeight: 700 }}>{selectedLead.email}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <FileText size={14} /> Verification Documents
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {selectedLead.documents?.length > 0 ? selectedLead.documents.map((doc, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <FileText size={16} color="#10b981" />
                                            <span style={{ fontSize: '0.85rem', flex: 1 }}>{doc.name}</span>
                                            <ArrowUpRight size={14} color="rgba(255,255,255,0.3)" />
                                        </div>
                                    )) : (
                                        <div style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
                                            No documents uploaded by user yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedLead.status !== 'Completed' && (
                                <button
                                    onClick={() => handleApprove(selectedLead._id)}
                                    style={{
                                        width: '100%', padding: '1.2rem', background: '#10b981', border: 'none', color: 'white',
                                        borderRadius: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        opacity: 1
                                    }}
                                >
                                    <CheckCircle size={20} /> Approve Service Request
                                </button>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
