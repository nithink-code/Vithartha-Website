import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Globe, Award, Users, Target, Briefcase, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    const founderDetails = {
        name: 'Vithartha Consulting',
        tagline: 'Empowering Businesses with Expert Financial & Compliance Solutions',
        mission: 'To simplify compliance, finance, and business advisory for startups and growing enterprises across India, delivering expert-led, technology-driven solutions that accelerate growth.',
        vision: 'To become India\'s most trusted partner for startup compliance, financial management, and business consulting.',
    };

    const services = [
        'GST Registration & Filing',
        'Income Tax & TDS Compliance',
        'Company Incorporation & Startup Consulting',
        'Virtual CFO & Accountant Services',
        'Legal & Secretarial Services',
        'Payroll Management (EPF, ESI)',
    ];

    const stats = [
        { label: 'Clients Served', value: '500+', icon: Users },
        { label: 'Services Offered', value: '25+', icon: Briefcase },
        { label: 'Years of Expertise', value: '10+', icon: Award },
        { label: 'Client Satisfaction', value: '99%', icon: Target },
    ];

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '6rem', position: 'relative', overflow: 'hidden' }}>
            <div className="page-gradient-accent" style={{ opacity: 0.5 }} />

            {/* Hero Section */}
            <section className="about-hero" style={{ padding: '6rem 2rem 5rem', position: 'relative', overflow: 'hidden', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
                <div className="hero-bg">
                    <div className="hero-gradient-sweep" />
                    <div className="grid-pattern" style={{ opacity: 0.6 }} />
                </div>

                {/* Decorative logo-color diagonal accents (Same as Home) */}
                <div className="hero-accent-div" style={{
                    position: 'absolute',
                    top: 0, right: 0,
                    width: '45%', height: '100%',
                    background: 'linear-gradient(135deg, transparent 40%, rgba(74,173,160,0.06) 100%)',
                    zIndex: 1, pointerEvents: 'none',
                }} />
                <div className="hero-accent-div" style={{
                    position: 'absolute',
                    bottom: 0, left: 0,
                    width: '30%', height: '50%',
                    background: 'linear-gradient(315deg, transparent 40%, rgba(139,26,45,0.08) 100%)',
                    zIndex: 1, pointerEvents: 'none',
                }} />
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(67,97,238,0.08)', color: '#4361ee', border: '1px solid rgba(67,97,238,0.2)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                            <Globe size={13} /> About Us
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: '1.2rem', lineHeight: 1.15 }}>
                            {founderDetails.name} <span style={{ color: '#4361ee' }}>.</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
                            {founderDetails.tagline}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="about-section" style={{ padding: '0 2rem 3rem' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="about-stats-grid"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' }}>
                        {stats.map((stat, idx) => (
                            <motion.div key={idx} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="about-card"
                                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.8rem 1.2rem', textAlign: 'center' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(67,97,238,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                    <stat.icon size={20} color="#4361ee" />
                                </div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text)', marginBottom: '0.3rem' }}>{stat.value}</div>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="about-section" style={{ padding: '2rem 2rem 3rem' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div className="about-mv-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            className="about-card"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #4361ee, #7c3aed)' }} />
                            <h3 style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Our Mission</h3>
                            <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.8, fontWeight: 500 }}>{founderDetails.mission}</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            className="about-card"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10b981, #059669)' }} />
                            <h3 style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Our Vision</h3>
                            <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.8, fontWeight: 500 }}>{founderDetails.vision}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* What We Offer */}
            <section className="about-section" style={{ padding: '2rem 2rem 3rem' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="about-card"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                            What We Offer
                        </h3>
                        <div className="about-offer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            {services.map((service, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 1.2rem', background: 'var(--bg)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4361ee', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)' }}>{service}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="about-section" style={{ padding: '2rem 2rem 4rem' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="about-card"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f59e0b, #f97316)' }} />
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            Get in Touch
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                            Have questions or need assistance? Reach out to us directly.
                        </p>

                        <div className="about-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
                            <a href="mailto:info@vithartha.com" style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)', transition: 'all 0.2s', cursor: 'pointer' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(67,97,238,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                                    <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'rgba(67,97,238,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Mail size={18} color="#4361ee" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>info@vithartha.com</div>
                                    </div>
                                </div>
                            </a>

                            <a href="tel:+919876543210" style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)', transition: 'all 0.2s', cursor: 'pointer' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                                    <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone size={18} color="#10b981" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phone</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>+91 98765 43210</div>
                                    </div>
                                </div>
                            </a>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MapPin size={18} color="#7c3aed" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>India</div>
                                </div>
                            </div>

                            <a href="https://www.linkedin.com/company/vithartha" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)', transition: 'all 0.2s', cursor: 'pointer' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                                    <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Linkedin size={18} color="#f59e0b" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>LinkedIn</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>Vithartha Consulting</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-section" style={{ padding: '0 2rem 5rem' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                            Ready to Grow Your Business?
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                            Let Vithartha handle your compliance and finances so you can focus on what matters most.
                        </p>
                        <button onClick={() => navigate('/onboarding')}
                            style={{ background: '#4361ee', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: 'var(--radius-full)', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(67,97,238,0.3)', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(67,97,238,0.4)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(67,97,238,0.3)'; }}>
                            Get Started <ArrowRight size={18} />
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
