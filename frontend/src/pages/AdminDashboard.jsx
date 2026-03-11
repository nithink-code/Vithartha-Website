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
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        serviceName: '',
        status: ''
    });

    useEffect(() => {
        if (selectedLead) {
            setEditForm({
                name: selectedLead.name || '',
                email: selectedLead.email || '',
                serviceName: selectedLead.serviceName || '',
                status: selectedLead.status || ''
            });
        }
    }, [selectedLead]);

    const handleUpdateLead = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.patch(`${apiUrl}/leads/${selectedLead._id}`, editForm);
            if (response.data) {
                toast.success('Service request updated successfully');
                fetchLeads();
                setSelectedLead(null);
            }
        } catch (error) {
            toast.error('Update failed');
            console.error(error);
        }
    };

    const fetchLeads = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
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
            const apiUrl = import.meta.env.VITE_API_URL;
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
                    <div className="admin-stats-grid" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '1rem' 
                    }}>
                        {[
                            { label: 'Platform Users', value: stats.total, icon: Users, color: '#4361ee' },
                            { label: 'Pending Approval', value: stats.pending, icon: Clock, color: '#f59e0b' },
                            { label: 'Fulfilled', value: stats.completed, icon: CheckCircle, color: '#10b981' },
                            { label: 'Revenue (₹)', value: stats.revenue, icon: TrendingUp, color: '#7c3aed' }
                        ].map((s, idx) => (
                            <div key={idx} style={{ 
                                padding: '1.2rem', 
                                borderRadius: '20px', 
                                background: 'rgba(255,255,255,0.01)', 
                                border: '1px solid rgba(255,255,255,0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                    <div style={{ padding: '6px', background: `${s.color}10`, borderRadius: '8px' }}>
                                        <s.icon size={16} color={s.color} />
                                    </div>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{s.label}</span>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>{s.value}</div>
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
                        padding: 'clamp(1rem, 3vw, 2.5rem)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    <div className="admin-pipeline-header" style={{ 
                        display: 'flex', 
                        flexDirection: 'row',
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '1.5rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>Active Service Pipeline</h2>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Showing {filteredLeads.length} entries</div>
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
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                    alignItems: 'center',
                                    padding: '1rem 1.25rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.04)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    gap: '1rem'
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
                                <div className="admin-lead-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '0' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #4361ee, #7c3aed)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.9rem', fontWeight: 800, color: 'white',
                                        flexShrink: 0
                                    }}>
                                        {lead.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.email}</div>
                                    </div>
                                </div>

                                {/* Service Label */}
                                <div className="admin-lead-service" style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.serviceName}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#4361ee', fontWeight: 600, letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.user?.profile?.industry || 'General Business'}</div>
                                </div>

                                {/* Documents Status */}
                                <div className="admin-lead-docs" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FileText size={14} color={(lead.documents?.length > 0) ? '#10b981' : 'rgba(255,255,255,0.2)'} />
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: (lead.documents?.length > 0) ? '#10b981' : 'rgba(255,255,255,0.4)' }}>
                                        {lead.documents?.length || 0} Files
                                    </div>
                                </div>

                                {/* Actions / Status */}
                                <div className="admin-lead-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                    {lead.status === 'Completed' ? (
                                        <div style={{
                                            padding: '6px 12px', background: 'rgba(16,185,129,0.1)',
                                            color: '#10b981', borderRadius: '8px', fontSize: '0.65rem',
                                            fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
                                        }}>
                                            Completed
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => handleApprove(lead._id, e)}
                                            style={{
                                                padding: '6px 12px',
                                                background: '#10b981',
                                                border: 'none',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                boxShadow: '0 4px 12px rgba(16,185,129,0.2)',
                                                transition: 'all 0.2s',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            <Check size={14} /> Approve
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
                                  width: '100%', maxWidth: '500px',
                                  background: 'linear-gradient(135deg, #151515 0%, #000000 100%)',
                                  borderRadius: '28px', border: '1px solid rgba(67, 97, 238, 0.4)',
                                  padding: '1.5rem 2rem', position: 'relative',
                                  maxHeight: '94vh', overflowY: 'auto',
                                  margin: 'auto', overflow: 'hidden',
                                  outline: 'none',
                                  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(67, 97, 238, 0.2)'
                              }}
                          >
                              <button onClick={() => setSelectedLead(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', zIndex: 1100 }}>
                                  <X size={22} />
                              </button>
  
                               <div style={{ textAlign: 'center', marginBottom: '1.2rem', marginTop: '0.1rem' }}>
                                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #4361ee, #7c3aed)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'white', boxShadow: '0 10px 25px rgba(67, 97, 238, 0.3)' }}>
                                      {selectedLead.name[0]}
                                  </div>
                                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>{selectedLead.name}</h3>
                                  <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem', fontSize: '0.85rem', fontWeight: 500 }}>Lead Assessment & Verification</p>
                              </div>
  
                              <form onSubmit={handleUpdateLead} style={{ padding: '0 0.5rem' }}>
                                   <div className="admin-modal-grid" style={{ 
                                       display: 'grid', 
                                       gridTemplateColumns: 'repeat(2, 1fr)', 
                                       gap: '0.8rem', 
                                       marginBottom: '1.2rem',
                                       padding: '1rem',
                                       background: 'rgba(255,255,255,0.02)',
                                       borderRadius: '18px',
                                       border: '1px solid rgba(255,255,255,0.05)'
                                   }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Client Name</label>
                                        <div className="input-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.6rem' }}>
                                            <input 
                                                type="text" 
                                                value={editForm.name} 
                                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                style={{ fontSize: '0.8rem', fontWeight: 600 }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact Email</label>
                                        <div className="input-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.6rem' }}>
                                            <input 
                                                type="email" 
                                                value={editForm.email} 
                                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                style={{ fontSize: '0.8rem', fontWeight: 600 }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Service Engagement</label>
                                        <div className="input-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.6rem' }}>
                                            <input 
                                                type="text" 
                                                value={editForm.serviceName} 
                                                onChange={(e) => setEditForm({...editForm, serviceName: e.target.value})}
                                                style={{ fontSize: '0.8rem', fontWeight: 600 }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Process Status</label>
                                        <div className="input-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.6rem' }}>
                                            <select 
                                                value={editForm.status} 
                                                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    color: 'var(--text)', 
                                                    width: '100%', 
                                                    outline: 'none',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="Open" style={{ background: '#151515' }}>Open / Pending</option>
                                                <option value="In Progress" style={{ background: '#151515' }}>In Progress</option>
                                                <option value="Reviewing" style={{ background: '#151515' }}>Reviewing Documents</option>
                                                <option value="Completed" style={{ background: '#151515' }}>Completed / Fulfilled</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Applied On</label>
                                        <div style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, opacity: 0.7 }}>
                                            {new Date(selectedLead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Industry</label>
                                        <div style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, opacity: 0.7 }}>
                                            {selectedLead.user?.profile?.industry || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                 <div style={{ marginBottom: '2.5rem', padding: '0 1rem' }}>
                                     <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}>
                                         <FileText size={16} /> Verification Documents
                                     </label>
                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                         {selectedLead.documents?.length > 0 ? selectedLead.documents.map((doc, idx) => (
                                             <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                 <FileText size={18} color="#10b981" />
                                                 <span style={{ fontSize: '0.8rem', fontWeight: 600, flex: 1, color: '#f0f0f0' }}>{doc.name}</span>
                                                 <ArrowUpRight size={16} color="rgba(255,255,255,0.3)" />
                                             </div>
                                         )) : (
                                             <div style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                                                 No documents uploaded.
                                             </div>
                                         )}
                                     </div>
                                 </div>

                                 <div style={{ padding: '0 1rem' }}>
                                     <button
                                         type="submit"
                                         style={{
                                             width: '100%', padding: '1.2rem', background: 'var(--v-blue)', border: 'none', color: 'white',
                                             borderRadius: '20px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                                             boxShadow: 'var(--blue-glow)',
                                             display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                             transition: 'all 0.3s'
                                         }}
                                         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                     >
                                         <RefreshCw size={20} /> Update Service Engagement
                                     </button>
                                 </div>
                              </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
