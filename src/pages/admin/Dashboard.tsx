import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sliders, Settings, Mail, ToggleLeft, BookTemplate, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
    const { data } = useQuery({ queryKey: ['admin-stats'], queryFn: () => api.get('/api/v1/admin/stats').then(r => r.data) });
    const navigate = useNavigate();

    const controls = [
        { to: '/admin/scoring', icon: Sliders, label: 'Scoring Weights', desc: 'Edit technical / coding / problem-solving weights' },
        { to: '/admin/settings', icon: Settings, label: 'Platform Settings', desc: 'Thresholds, test structure, link expiry, AI prompts' },
        { to: '/admin/email-templates', icon: Mail, label: 'Email Templates', desc: 'Edit test invitation & result notification emails' },
        { to: '/admin/feature-flags', icon: ToggleLeft, label: 'Feature Flags', desc: 'Enable/disable platform features' },
        { to: '/admin/role-templates', icon: BookTemplate, label: 'Role Templates', desc: 'Manage reusable job role templates' },
    ];

    return (
        <div style={{ padding: 32, maxWidth: 1100 }} className="animate-fadeInUp">
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Admin Dashboard</h1>
                <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: 14 }}>No-code controls — manage everything without touching code.</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total Users', value: data?.total_users ?? '—' },
                    { label: 'Assessments Taken', value: data?.total_attempts ?? '—' },
                    { label: 'Qualified Candidates', value: data?.qualified_candidates ?? '—' },
                    { label: 'Avg Score', value: data?.average_score ? `${data.average_score}` : '—' },
                ].map(d => (
                    <div key={d.label} className="stat-card"><span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{d.label}</span><span style={{ fontSize: 28, fontWeight: 700 }}>{d.value}</span></div>
                ))}
            </div>

            {/* Control panels */}
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>No-Code Controls</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 16 }}>
                {controls.map(({ to, icon: Icon, label, desc }) => (
                    <div key={to} className="card" onClick={() => navigate(to)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'border-color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#3d3d5c')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                        <div style={{ width: 44, height: 44, background: 'rgba(99,102,241,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={20} color="#818cf8" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{desc}</div>
                        </div>
                        <ArrowRight size={16} color="var(--color-text-subtle)" />
                    </div>
                ))}
            </div>
        </div>
    );
}
