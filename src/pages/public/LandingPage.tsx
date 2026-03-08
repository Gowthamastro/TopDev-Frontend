import { Link } from 'react-router-dom';
import { Zap, Brain, BarChart3, Shield, ChevronRight, Star, Check } from 'lucide-react';

const features = [
    { icon: Brain, title: 'AI-Powered Assessments', desc: 'GPT-4 parses your JD and generates custom MCQ, coding, and scenario questions tailored to the role.' },
    { icon: BarChart3, title: 'Instant Ranked Results', desc: 'Candidates scored 0–100 with Elite, Strong, and Qualified badges. Only top performers reach you.' },
    { icon: Shield, title: 'Secure Test Links', desc: 'Tamper-proof 48-hour test links with token expiry. Candidates can\'t game the system.' },
    { icon: Zap, title: 'No-Code Admin Controls', desc: 'Edit scoring weights, AI prompts, email templates, and thresholds — no developer needed.' },
];

const plans = [
    { name: 'Starter', price: '$49', roles: '5 roles/month', cta: 'Get started' },
    { name: 'Growth', price: '$149', roles: '20 roles/month', cta: 'Start growing', popular: true },
    { name: 'Enterprise', price: 'Custom', roles: 'Unlimited', cta: 'Contact us' },
];

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
            {/* Nav */}
            <nav style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(9,9,14,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={16} color="white" />
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 800 }}>TopDev</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Link to="/login" style={{ fontSize: 14, color: 'var(--color-text-muted)', textDecoration: 'none' }}>Sign in</Link>
                    <Link to="/register" className="btn-primary" style={{ padding: '9px 20px' }}>Get started free</Link>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '100px 24px 80px', position: 'relative', overflow: 'hidden' }} className="animated-bg">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, fontSize: 13, color: '#818cf8', fontWeight: 500, marginBottom: 28 }}>
                    <Star size={12} fill="#818cf8" /> AI-Powered IT Recruitment
                </div>
                <h1 style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1, margin: '0 auto 20px', maxWidth: 800 }}>
                    <span className="gradient-text">Top Talent.</span><br />Top Scores.
                </h1>
                <p style={{ fontSize: 18, color: 'var(--color-text-muted)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
                    TopDev automatically generates custom technical assessments from your job description, scores candidates with AI, and delivers only your top performers.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/register" className="btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>
                        Start hiring smarter <ChevronRight size={18} />
                    </Link>
                    <Link to="/login" className="btn-secondary" style={{ padding: '14px 28px', fontSize: 16 }}>
                        Sign in
                    </Link>
                </div>
                {/* Hero Mockup */}
                <div style={{ marginTop: 64, maxWidth: 880, margin: '64px auto 0', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
                    <div style={{ background: 'var(--color-surface)', padding: '12px 16px', display: 'flex', gap: 8, borderBottom: '1px solid var(--color-border)' }}>
                        {['#ef4444', '#f59e0b', '#10b981'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
                        <div style={{ background: 'var(--color-card)', borderRadius: 4, flex: 1, height: 12 }} />
                    </div>
                    <div style={{ background: 'var(--color-card)', padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                        {[{ badge: '⭐ Elite', score: '94.2', name: 'Priya K.', color: '#f59e0b' }, { badge: '🔹 Strong', score: '81.5', name: 'Marcus T.', color: '#6366f1' }, { badge: '✅ Qualified', score: '68.1', name: 'Aditya R.', color: '#10b981' }].map(c => (
                            <div key={c.name} style={{ background: 'var(--color-surface)', borderRadius: 10, padding: 16, border: '1px solid var(--color-border)' }}>
                                <div style={{ fontSize: 12, padding: '3px 10px', background: `${c.color}18`, color: c.color, borderRadius: 20, display: 'inline-block', fontWeight: 600, marginBottom: 10 }}>{c.badge}</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.score}</div>
                                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>{c.name}</div>
                                <div style={{ height: 4, borderRadius: 2, background: 'var(--color-border)', marginTop: 10 }}>
                                    <div style={{ height: '100%', width: `${parseFloat(c.score)}%`, background: c.color, borderRadius: 2 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
                <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 48 }}>Everything you need to hire better</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}>
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="card" style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                            <div style={{ width: 44, height: 44, background: 'rgba(99,102,241,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={20} color="#818cf8" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>{title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.7 }}>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section style={{ padding: '60px 48px', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 48 }}>How TopDev works</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
                        {[
                            { step: '01', title: 'Upload JD', desc: 'Paste or upload your job description' },
                            { step: '02', title: 'AI Generates Test', desc: 'Custom assessment created in seconds' },
                            { step: '03', title: 'Candidates Assessed', desc: 'Secure links sent, answers scored by AI' },
                            { step: '04', title: 'View Top Talent', desc: 'Ranked candidates delivered to your portal' },
                        ].map(s => (
                            <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white' }}>{s.step}</div>
                                <div style={{ fontSize: 15, fontWeight: 700 }}>{s.title}</div>
                                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section style={{ padding: '80px 48px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Simple, transparent pricing</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 48, fontSize: 15 }}>No hidden fees. Cancel anytime.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                    {plans.map(plan => (
                        <div key={plan.name} className="card" style={{ position: 'relative', border: plan.popular ? '2px solid #6366f1' : '1px solid var(--color-border)' }}>
                            {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 20 }}>Most Popular</div>}
                            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-text-muted)' }}>{plan.price !== 'Custom' ? '/mo' : ''}</span></div>
                            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>{plan.roles}</div>
                            <Link to="/register" className={plan.popular ? 'btn-primary' : 'btn-secondary'} style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '11px' }}>{plan.cta}</Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--color-border)', padding: '28px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={16} color="#818cf8" />
                    <span style={{ fontSize: 14, fontWeight: 700 }}>TopDev</span>
                    <span style={{ fontSize: 13, color: 'var(--color-text-subtle)' }}>— Top Talent. Top Scores.</span>
                </div>
                <span style={{ fontSize: 13, color: 'var(--color-text-subtle)' }}>© 2024 TopDev AI</span>
            </footer>
        </div>
    );
}
