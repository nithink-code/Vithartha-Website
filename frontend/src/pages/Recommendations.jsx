import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Check, Calendar, ChevronRight, ArrowRight, Star, Zap, Shield, BarChart3,
    FileCheck, Building, X, Users, ShieldAlert, CheckCircle, Clock, Search,
    AlertCircle, FileText, ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const iconMap = {
    'Finance': BarChart3,
    'Compliance': Shield,
    'Advisory': Zap,
    'Tax': FileCheck,
    'Legal': Building,
};

const categoryColors = {
    'Finance': { color: '#4361ee', bg: 'rgba(67,97,238,0.08)' },
    'Compliance': { color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    'Advisory': { color: '#f72585', bg: 'rgba(247,37,133,0.08)' },
    'Tax': { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
    'Legal': { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
};

const ALL_SERVICES = [
    { title: 'GST Registration', description: 'Quick and compliant registration under GST with expert verification and documentation.', category: 'Compliance', trigger: 'GST Compliance' },
    { title: 'GSTR 1 & 3B Filing', description: 'From monthly compliance to reconciliation - we file your GST returns under one roof.', category: 'Compliance', trigger: 'GST Compliance' },
    { title: 'GST 2B Reconciliation', description: 'Monthly reconciliation of returns and ITC credits to prevent notice and financial loss.', category: 'Compliance', trigger: 'GST Compliance' },
    { title: 'GST Notice Management', description: 'Professional handling of GST notices and departmental submissions for total peace of mind.', category: 'Compliance', trigger: 'GST Compliance' },
    { title: 'E-Way Bill & E-Invoicing', description: 'Efficient generation of E-way bills and compliance with the latest E-invoicing standards.', category: 'Compliance', trigger: 'GST Compliance' },
    { title: 'GST Health Check', description: 'Complete verification of records and compliance status to ensure audit readiness.', category: 'Compliance', trigger: 'GST Compliance' },
    { title: 'ITR Filing', description: 'ITR Filing and expert consultation to ensure maximum refund and zero compliance errors.', category: 'Tax', trigger: 'Income Tax' },
    { title: 'TDS Payment & Returns', description: 'Monthly TDS payment, return filing, and generation of digital Form 16 for employees.', category: 'Tax', trigger: 'Income Tax' },
    { title: 'IT Notice Management', description: 'Expert handling and response to Income Tax notices, representing your business professionally.', category: 'Tax', trigger: 'Income Tax' },
    { title: 'NRI Taxation', description: 'Specialized NRI taxation services, consultation, and cross-border compliance planning.', category: 'Tax', trigger: 'Income Tax' },
    { title: 'Refund Postponement/Reissue', description: 'Tracking pending refunds and assisting with reissue requests through the IT department.', category: 'Tax', trigger: 'Income Tax' },
    { title: 'Virtual CFO Service', description: 'Digitally manage your financial reporting task. Designed to support fundamental decision making.', category: 'Finance', trigger: 'Virtual CFO' },
    { title: 'Virtual Accountant', description: 'End-to-end bookkeeping, billing, and documentation support by our dedicated expert team.', category: 'Finance', trigger: 'Virtual CFO' },
    { title: 'Company Incorporation', description: 'Incorporation of Private Limited, Public Limited, OPC, or LLP with MCA compliance.', category: 'Legal', trigger: 'Registration' },
    { title: 'Startup Consulting', description: 'Consultation, registration set up, and assistance in unlocking other Startup India benefits.', category: 'Advisory', trigger: 'Registration' },
    { title: 'Import & Export (IEC)', description: 'Import export registration and IEC Code creation. DGFT registration and documentation.', category: 'Legal', trigger: 'Registration' },
    { title: 'MCA Annual Filings', description: 'Annual filings compliance and management, including returns and necessary legal forms.', category: 'Compliance', trigger: 'Legal Advisory' },
    { title: 'Legal & Secretarial Service', description: 'Property registration, Wills, Legal Documents, and various secretarial registrations.', category: 'Legal', trigger: 'Legal Advisory' },
    { title: 'Director & Professional Svc', description: 'Director DIN services, KYC compliance, and professional appointments management.', category: 'Legal', trigger: 'Legal Advisory' },
    { title: 'Share Transfer & ESOP', description: 'Share transfer registration and implementation of ESOP plans for your growing team.', category: 'Legal', trigger: 'Legal Advisory' },
    { title: 'EPF & ESI Management', description: 'Registration, regular monthly compliance, and comprehensive payroll management.', category: 'Compliance', trigger: 'Payroll' },
    { title: 'TDS (Payroll) Compliance', description: 'TDS Original Return filing and correction return filing for all your payroll needs.', category: 'Compliance', trigger: 'Payroll' },
    { title: 'Technical Service', description: 'Support for Applications, Softwares, and Cloud Services for your business infrastructure.', category: 'Advisory', trigger: 'Payroll' },
];

/* ══════════════════════════════════════════════════
   PREMIUM CARD  – 3D tilt + glow (reused from Admin)
══════════════════════════════════════════════════ */
const PremiumCard = ({ children, style = {}, className = '', glowColor = 'rgba(67, 97, 238, 0.15)', onClick }) => {
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
        if (glowRef.current) { glowRef.current.style.left = `${x}px`; glowRef.current.style.top = `${y}px`; glowRef.current.style.opacity = '1'; }
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
        <div ref={cardRef} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={onClick}
            style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.4s ease', position: 'relative', overflow: 'hidden', ...style }}>
            <div ref={glowRef} style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`, transform: 'translate(-50%, -50%)', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s ease', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   ADMIN SERVICES VIEW
══════════════════════════════════════════════════ */
const AdminServicesView = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [expandedUser, setExpandedUser] = useState(null);

    const fetchLeads = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${apiUrl}/leads`);
            setLeads(response.data);
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast.error("Failed to load service data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeads(); }, []);

    const handleApprove = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await axios.patch(`${apiUrl}/leads/${id}`, { status: 'Completed' });
            if (response.data) {
                toast.success('Service approved & marked as Completed');
                fetchLeads();
                if (selectedLead?._id === id) setSelectedLead(null);
            }
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    // Group leads by user
    const groupedByUser = leads.reduce((acc, lead) => {
        const key = lead.email || 'Unknown';
        if (!acc[key]) {
            acc[key] = { name: lead.name, email: lead.email, userId: lead.user?._id, industry: lead.user?.profile?.industry, services: [] };
        }
        acc[key].services.push(lead);
        return acc;
    }, {});

    const userGroups = Object.values(groupedByUser).filter(group =>
        !searchQuery.trim() ||
        group.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.services.some(s => s.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Auto-expand users that match search
    useEffect(() => {
        if (searchQuery.trim()) {
            const matchingEmails = userGroups
                .filter(g => g.services.some(s => s.serviceName?.toLowerCase().includes(searchQuery.toLowerCase())) || g.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(g => g.email);
            if (matchingEmails.length === 1) {
                setExpandedUser(matchingEmails[0]);
            }
        }
    }, [searchQuery]);

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            toast.error("Enter a name, email, or service to search");
            return;
        }
        if (userGroups.length === 0) {
            toast.error("No matching users or services found");
        } else {
            toast.success(`Found ${userGroups.length} user(s) matching "${searchQuery}"`);
            if (userGroups.length === 1) {
                setExpandedUser(userGroups[0].email);
            }
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setExpandedUser(null);
    };

    const stats = {
        totalUsers: Object.keys(groupedByUser).length,
        totalServices: leads.length,
        pending: leads.filter(l => l.status === 'Open').length,
        completed: leads.filter(l => l.status === 'Completed').length,
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(67,97,238,0.1)', borderTopColor: '#4361ee', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingTop: '140px', paddingBottom: '80px', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% -20%, rgba(67, 97, 238, 0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1rem, 5vw, 2rem)' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(67,97,238,0.08)', borderRadius: '100px', border: '1px solid rgba(67,97,238,0.15)', marginBottom: '1.5rem', marginTop: '1rem' }}>
                        <ShieldAlert size={15} color="#4361ee" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4361ee', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin · Service Management</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, letterSpacing: '-0.03em', margin: 0, color: 'var(--text)' }}>
                        User Services <span style={{ color: '#4361ee' }}>.</span>
                    </h1>

                    <p className="rec-subtext" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.6rem', maxWidth: '600px', margin: '0.6rem auto 2.5rem', lineHeight: 1.6 }}>
                        View services chosen by each user and manage approvals with precision
                    </p>

                    {/* Centered Search Bar below heading */}
                    <div className="admin-search-wrap" style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <div style={{
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
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                style={{ background: 'none', border: 'none', color: 'var(--text)', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                            />
                            {searchQuery && (
                                <button onClick={clearSearch} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                                    <X size={16} />
                                </button>
                            )}
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


                {/* User Groups */}
                <PremiumCard className="admin-services-card" style={{
                    background: 'linear-gradient(135deg, #252525 0%, #151515 100%)',
                    border: '1px solid var(--border)',
                    padding: 'clamp(1rem, 4vw, 2.5rem)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>Services by User</h2>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                            {searchQuery.trim() ? `${userGroups.length} result(s)` : `${userGroups.length} users`}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {userGroups.length > 0 ? userGroups.map((group, gi) => (
                            <motion.div key={group.email} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.05 }}
                                style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: expandedUser === group.email ? '1px solid rgba(67,97,238,0.3)' : '1px solid rgba(255,255,255,0.04)', overflow: 'hidden', transition: 'border-color 0.3s' }}>
                                {/* User Header */}
                                <div onClick={() => setExpandedUser(expandedUser === group.email ? null : group.email)}
                                    className="admin-user-header"
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #4361ee, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>
                                            {group.name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>{group.name}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{group.email}</div>
                                        </div>
                                    </div>
                                    <div className="admin-user-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div className="admin-user-stat-pills" style={{ display: 'flex', gap: '0.8rem' }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                                                {group.services.filter(s => s.status === 'Open').length} Pending
                                            </span>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                                {group.services.filter(s => s.status === 'Completed').length} Completed
                                            </span>
                                        </div>
                                        <ChevronRight className="admin-chevron" size={18} color="rgba(255,255,255,0.3)" style={{ transition: 'transform 0.3s', transform: expandedUser === group.email ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                                    </div>
                                </div>

                                {/* Expandable Services List */}
                                <AnimatePresence>
                                    {expandedUser === group.email && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                                            style={{ overflow: 'hidden' }}>
                                            <div className="admin-expand-services" style={{ padding: '0 2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '0.5rem' }} />
                                                {group.services.map((lead, si) => (
                                                    <motion.div key={lead._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.05 }}
                                                        className="admin-service-subrow"
                                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: lead.status === 'Completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {lead.status === 'Completed' ? <CheckCircle size={18} color="#10b981" /> : <Clock size={18} color="#f59e0b" />}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{lead.serviceName}</div>
                                                                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                                                                    Applied {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                    {lead.documents?.length > 0 && <> · <FileText size={10} style={{ verticalAlign: 'middle' }} /> {lead.documents.length} docs</>}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="admin-service-subrow-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                            {lead.status === 'Completed' ? (
                                                                <div style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <CheckCircle size={13} /> Completed
                                                                </div>
                                                            ) : (
                                                                <button onClick={(e) => handleApprove(lead._id, e)}
                                                                    style={{ padding: '6px 16px', background: '#10b981', border: 'none', color: 'white', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'all 0.2s' }}
                                                                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(16,185,129,0.4)'; }}
                                                                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)'; }}>
                                                                    <Check size={14} /> Approve
                                                                </button>
                                                            )}
                                                            <button onClick={() => setSelectedLead(lead)}
                                                                style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                Details <ArrowUpRight size={12} />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <AlertCircle size={40} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
                                <div style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>No user services found</div>
                            </div>
                        )}
                    </div>
                </PremiumCard>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedLead && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', padding: '1rem' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 14 }}
                            className="rec-modal-content"
                            style={{ width: '100%', maxWidth: '420px', background: 'linear-gradient(135deg, #151515 0%, #000000 100%)', border: '1px solid rgba(67, 97, 238, 0.2)', position: 'relative' }}>
                            <button onClick={() => setSelectedLead(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}><X size={18} /></button>

                            <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'linear-gradient(135deg, #4361ee, #7c3aed)', margin: '0 auto 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 900, color: 'white', boxShadow: '0 6px 18px rgba(67, 97, 238, 0.25)' }}>
                                    {selectedLead.name?.[0]}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{selectedLead.name}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', fontSize: '0.8rem' }}>Service Details</p>
                            </div>

                            <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                                {[
                                    { label: 'Service', value: selectedLead.serviceName },
                                    { label: 'Applied On', value: new Date(selectedLead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                                    { label: 'Status', value: selectedLead.status === 'Open' ? 'Pending' : selectedLead.status },
                                    { label: 'Contact', value: selectedLead.email },
                                ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <label style={{ fontSize: '0.62rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</label>
                                        <div style={{ fontWeight: 700, fontSize: '0.82rem', wordBreak: 'break-word' }}>{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <label style={{ fontSize: '0.62rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                                    <FileText size={12} /> Documents
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {selectedLead.documents?.length > 0 ? selectedLead.documents.map((doc, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <FileText size={13} color="#10b981" />
                                            <span style={{ fontSize: '0.78rem', flex: 1 }}>{doc.name}</span>
                                        </div>
                                    )) : (
                                        <div style={{ padding: '1rem', textAlign: 'center', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
                                            No documents uploaded yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedLead.status !== 'Completed' ? (
                                <button onClick={() => handleApprove(selectedLead._id)}
                                    style={{ width: '100%', padding: '0.8rem', background: '#10b981', border: 'none', color: 'white', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <CheckCircle size={16} /> Approve Service Request
                                </button>
                            ) : (
                                <div style={{ width: '100%', padding: '0.8rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <CheckCircle size={16} /> Already Completed
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ══════════════════════════════════════════════════
   MAIN RECOMMENDATIONS COMPONENT
══════════════════════════════════════════════════ */
const Recommendations = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { recommendations, userData, fallback } = location.state || { recommendations: [], userData: null, fallback: false };

    const [selectedService, setSelectedService] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [interestData, setInterestData] = useState({ name: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const isAdmin = storedUser?.role === 'admin';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const checkUser = () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                setIsLoggedIn(true);
                setInterestData({ name: user.name || '', email: user.email || '' });
            } else {
                setIsLoggedIn(false);
                setInterestData({ name: '', email: '' });
            }
        };
        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, [selectedService]);

    // If admin → render admin services view
    if (isAdmin) {
        return <AdminServicesView />;
    }

    // Get selected needs from onboarding
    const userNeeds = userData?.needs || storedUser?.profile?.needs || [];
    const filteredServices = ALL_SERVICES.filter(service => userNeeds.includes(service.trigger));
    const defaultServices = filteredServices.length > 0
        ? filteredServices
        : (recommendations && recommendations.length > 0 ? recommendations : [
            { title: 'Digital Accounting', description: 'End-to-end bookkeeping, billing, and reconciliation management.', category: 'Finance' },
            { title: 'GST Registration & Filing', description: 'Quick and compliant GST registration with ongoing filing support.', category: 'Compliance' },
            { title: 'Startup Legal Advisory', description: 'Company incorporation and MCA compliance for new entrepreneurs.', category: 'Advisory' },
            { title: 'Income Tax Planning', description: 'Strategic tax planning and ITR filing to minimize liability.', category: 'Tax' },
        ]);

    const displayServices = searchQuery.trim() !== ''
        ? ALL_SERVICES.filter(service =>
            service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : defaultServices;

    const handleSearch = () => {
        // Searching is now handled dynamically as user types
    };

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '5.5rem', transition: 'background 0.3s ease' }}>
            <div className="page-gradient-accent" style={{ opacity: 0.4 }} />
            {/* Header */}
            <section style={{ background: 'transparent', padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 5vw, 2rem) 3.5rem', position: 'relative', zIndex: 1 }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                            <Check size={13} /> Analysis Complete
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1.2rem', color: 'var(--text)' }}>
                            {searchQuery.trim() !== '' ? 'Search Results' : (userNeeds.length > 0 ? 'Your Specific ' : 'Your Personalised ')}
                            {searchQuery.trim() === '' && <span style={{ color: '#10b981' }}>Service Roadmap</span>}
                        </h1>
                        <p className="rec-subtext" style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                            {searchQuery.trim() !== '' ? `Showing services matching "${searchQuery}"` : "Based on your business profile, we've curated the most impactful services to accelerate your growth and ensure compliance."}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.5rem 0.5rem 0.5rem 1.2rem', borderRadius: '16px' }}>
                                <Search size={18} color="var(--text-muted)" />
                                <input type="text" placeholder="Search specific services..."
                                    value={searchQuery}
                                    onChange={e => {
                                        setSearchQuery(e.target.value);
                                    }}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    style={{ background: 'none', border: 'none', color: 'var(--text)', outline: 'none', width: '100%', fontSize: '0.95rem' }} />
                                {searchQuery && (
                                    <button onClick={() => { setSearchQuery(''); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}>
                                        <X size={16} />
                                    </button>
                                )}
                                <button onClick={handleSearch} style={{
                                    background: '#4361ee', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '12px', cursor: 'pointer',
                                    fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s'
                                }}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Cards */}
            <section className="section-sm" style={{ position: 'relative', zIndex: 1 }}>
                <div className="container recommendations-container">
                    {displayServices.length > 0 ? (
                        <div className="recommendations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', justifyContent: 'center' }}>
                            {displayServices.map((service, idx) => {
                                const cat = service.category || 'Advisory';
                                const config = categoryColors[cat] || categoryColors['Advisory'];
                                const Icon = iconMap[cat] || Zap;
                                return (
                                    <PremiumCard key={idx} glowColor={config.color + '30'}
                                        onClick={() => setSelectedService(service)}
                                        style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%' }}>
                                        <div style={{ height: 4, background: `linear-gradient(90deg, ${config.color}, transparent)` }} />
                                        <div style={{ padding: '2.5rem 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Icon size={24} color={config.color} />
                                                </div>
                                                <span style={{ background: config.bg, color: config.color, padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                                    {service.category}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem', letterSpacing: '0.02em' }}>{service.title}</h3>
                                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>{service.description}</p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {['Expert-led delivery', 'Fully compliant', 'Fast turnaround'].map(f => (
                                                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Check size={14} color="#10b981" />
                                                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
                                                </div>
                                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>4.9 · 50+ clients</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
                                                <button className="btn btn-primary" id={`rec-get-started-${idx}`} onClick={(e) => { e.stopPropagation(); setSelectedService(service); }}
                                                    style={{ flex: 1, justifyContent: 'center', borderRadius: '14px', padding: '0.8rem', background: '#10b981', border: 'none', color: '#fff', minWidth: '140px' }}>
                                                    View Details <ChevronRight size={16} />
                                                </button>
                                                <button id={`rec-book-${idx}`} className="btn" onClick={(e) => { e.stopPropagation(); setSelectedService(service); }} style={{ padding: '0.8rem 1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                                                    <Calendar size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </PremiumCard>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <Search size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>No services found</h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)' }}>We couldn't find any services matching your search.</p>
                            <button onClick={() => { setSearchQuery(''); }} className="btn btn-primary" style={{ marginTop: '1rem', background: '#4361ee', border: 'none', borderRadius: '12px' }}>
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Banner - Hidden if logged in */}
            {
                !isLoggedIn && (
                    <section style={{ background: 'var(--secondary)', padding: '5rem 2rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, rgba(67,97,238,0.25) 0%, transparent 60%)', pointerEvents: 'none' }} />
                        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem' }}>
                                <div style={{ maxWidth: '580px' }}>
                                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.04em', marginBottom: '1rem' }}>Ready to Get Started?</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                                        Create a free account to track your services, upload documents, and connect directly with your dedicated Vithartha advisor.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <button id="rec-cta-register" onClick={() => navigate('/register')}
                                        style={{ background: 'var(--text)', color: 'var(--card-bg)', border: 'none', padding: '1rem 2rem', borderRadius: 'var(--radius-full)', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}>
                                        Create Free Account <ArrowRight size={18} />
                                    </button>
                                    <button id="rec-cta-restart" onClick={() => navigate('/onboarding')} className="btn btn-ghost" style={{ padding: '1rem 2rem', borderRadius: 'var(--radius-full)' }}>
                                        Restart Assessment
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )
            }

            {/* Service Detail Modal/Form */}
            {
                selectedService && (
                    <div className="rec-detail-modal" style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="rec-modal-content"
                            style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '520px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                            <button onClick={() => setSelectedService(null)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                <X size={18} />
                            </button>
                            <div style={{ padding: 'clamp(1.2rem, 6vw, 2.5rem)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                                    <div style={{ padding: '0.2rem 0.6rem', background: (categoryColors[selectedService.category] || categoryColors['Advisory']).bg, color: (categoryColors[selectedService.category] || categoryColors['Advisory']).color, borderRadius: 'var(--radius-full)', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                        {selectedService.category}
                                    </div>
                                    <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text)', margin: 0 }}>{selectedService.title}</h2>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>{selectedService.description}</p>
                                <div className="fee-box" style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1.2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>FEE:</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>₹1,000</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Calendar size={14} color="#4361ee" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>2-4 Days</span>
                                    </div>
                                </div>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setIsSubmitting(true);
                                    try {
                                        const user = JSON.parse(localStorage.getItem('user'));
                                        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                                        await axios.post(`${apiUrl}/leads`, { user: user?._id || user?.id || null, name: interestData.name, email: interestData.email, serviceName: selectedService.title, cost: 1000 });
                                        toast.success("Interest recorded! Our advisor will contact you soon.");
                                        setSelectedService(null);
                                        navigate('/dashboard');
                                    } catch (error) {
                                        console.error("Error submitting interest:", error);
                                        toast.error("Failed to record interest. Please try again.");
                                    } finally {
                                        setIsSubmitting(false);
                                    }
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        <div className="input-group">
                                            <input type="text" placeholder="Full Name" required value={interestData.name} onChange={e => setInterestData({ ...interestData, name: e.target.value })} style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }} />
                                        </div>
                                        <div className="input-group">
                                            <input type="email" placeholder="Business Email" required value={interestData.email} onChange={e => setInterestData({ ...interestData, email: e.target.value })} style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }} />
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '0.85rem', marginTop: '0.4rem', fontSize: '0.9rem' }}>
                                            {isSubmitting ? 'Recording...' : 'Confirm Interest'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
};

export default Recommendations;
