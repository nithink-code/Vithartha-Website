import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Building, Edit2, Save, X, Phone, Globe } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profile: {
            companyName: '',
            phone: '',
            businessStage: '',
            industry: ''
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                        headers: { Authorization: `Bearer ${storedUser.token}` }
                    });
                    setUser(response.data);
                    setFormData({
                        name: response.data.name,
                        email: response.data.email,
                        profile: {
                            companyName: response.data.profile?.companyName || '',
                            phone: response.data.profile?.phone || '',
                            businessStage: response.data.profile?.businessStage || '',
                            industry: response.data.profile?.industry || ''
                        }
                    });
                }
            } catch (error) {
                toast.error("Failed to load profile");
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/auth/profile`, formData, {
                headers: { Authorization: `Bearer ${storedUser.token}` }
            });
            if (response.data) {
                const updatedUser = { ...storedUser, ...response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(response.data);
                setIsEditing(false);
                toast.success("Profile updated successfully!");
                // Dispatch storage event to update navbar
                window.dispatchEvent(new Event('storage'));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    if (!user) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>Loading...</div>;

    return (
        <div
            className="profile-container"
            style={{
                minHeight: '100vh',
                padding: '100px 20px 40px',
                background: 'var(--bg)',
                color: 'var(--text)',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="profile-card"
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    background: 'var(--card-bg)',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-xl)',
                    overflow: 'hidden'
                }}
            >
                {/* Header Section */}
                <div
                    className="profile-header"
                    style={{
                        padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                        background: 'linear-gradient(135deg, rgba(67,97,238,0.1), rgba(124,58,237,0.1))',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1.5rem',
                        position: 'relative',
                        flexWrap: 'wrap',
                    }}
                >
                    <div
                        className="profile-avatar"
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4361ee, #7c3aed)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            fontWeight: 800,
                            color: 'white',
                            boxShadow: '0 10px 25px rgba(67,97,238,0.3)',
                            flexShrink: 0,
                        }}
                    >
                        {user.name[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', wordBreak: 'break-word' }}>{user.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                            <span style={{
                                padding: '4px 12px',
                                background: user.role === 'admin' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                color: user.role === 'admin' ? '#ef4444' : '#10b981',
                                borderRadius: '100px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <Shield size={12} /> {user.role}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Member since {new Date(user.createdAt || Date.now()).getFullYear()}</span>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="profile-edit-btn"
                            style={{
                                padding: '10px 20px',
                                borderRadius: '12px',
                                background: 'var(--bg)',
                                border: '1px solid var(--border)',
                                color: 'var(--text)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <Edit2 size={16} /> Edit Profile
                        </button>
                    )}
                </div>

                {/* Form / Details Section */}
                <form onSubmit={handleUpdate} className="profile-form" style={{ padding: '40px' }}>
                    <div className="profile-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

                        {/* Personal Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 className="profile-section-title" style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 10px', color: '#4361ee', letterSpacing: '0.02em' }}>Personal Information</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        disabled={!isEditing}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={inputStyle(isEditing)}
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        disabled={true} // Usually email is changed via special flow
                                        value={formData.email}
                                        style={{ ...inputStyle(false), opacity: 0.7 }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        disabled={!isEditing}
                                        value={formData.profile.phone}
                                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, phone: e.target.value } })}
                                        style={inputStyle(isEditing)}
                                        placeholder="+91 00000 00000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 className="profile-section-title" style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 10px', color: '#4361ee', letterSpacing: '0.02em' }}>Business Details</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Company Name</label>
                                <div style={{ position: 'relative' }}>
                                    <Building size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        disabled={!isEditing}
                                        value={formData.profile.companyName}
                                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, companyName: e.target.value } })}
                                        style={inputStyle(isEditing)}
                                        placeholder="Your Company"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Industry</label>
                                <div style={{ position: 'relative' }}>
                                    <Globe size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        disabled={!isEditing}
                                        value={formData.profile.industry}
                                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, industry: e.target.value } })}
                                        style={inputStyle(isEditing)}
                                        placeholder="e.g. Fintech, Healthcare"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Business Stage</label>
                                <div style={{ position: 'relative' }}>
                                    <Shield size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        disabled={!isEditing}
                                        value={formData.profile.businessStage}
                                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, businessStage: e.target.value } })}
                                        style={inputStyle(isEditing)}
                                        placeholder="Startup, Growth, etc."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="profile-actions" style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    background: 'transparent',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <X size={18} /> Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    padding: '12px 32px',
                                    borderRadius: '12px',
                                    background: 'var(--grad-primary)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 15px rgba(67,97,238,0.3)'
                                }}
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    );
};

const inputStyle = (editable) => ({
    width: '100%',
    padding: '12px 12px 12px 42px',
    borderRadius: '12px',
    border: editable ? '2px solid var(--primary)' : '1px solid var(--border)',
    background: editable ? 'var(--bg)' : 'rgba(255,255,255,0.02)',
    color: 'var(--text)',
    fontSize: '0.95rem',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.2s',
    cursor: editable ? 'text' : 'not-allowed'
});

export default Profile;
