import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Plus, ArrowRight, Award } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function ClientDashboard() {
    const { user } = useAuthStore();
    const { data } = useQuery({ queryKey: ['client-dashboard'], queryFn: () => api.get('/api/v1/clients/dashboard').then(r => r.data) });
    const { data: jobs } = useQuery({ queryKey: ['client-jobs'], queryFn: () => api.get('/api/v1/jobs/').then(r => r.data) });

    const stats = data?.stats || {};

    return (
        <div style={{ padding: 32, maxWidth: 1200 }} className="animate-fadeInUp">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: 14 }}>
                        {data?.client?.company_name} · <span style={{ textTransform: 'capitalize', color: '#818cf8' }}>{data?.client?.plan} plan</span>
                    </p>
                </div>
                <Link to="/client/jobs/upload" className="btn-primary">
                    <Plus size={16} /> Post New Role
                </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total Roles', value: stats.total_jobs ?? '—', icon: Briefcase, color: '#6366f1' },
                    { label: 'Candidates Assessed', value: stats.total_candidates ?? '—', icon: Users, color: '#8b5cf6' },
                    { label: 'Qualified Candidates', value: stats.qualified_candidates ?? '—', icon: Award, color: '#10b981' },
                ].map((s) => (
                    <div key={s.label} className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>{s.label}</span>
                            <div style={{ width: 32, height: 32, background: `${s.color}18`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <s.icon size={16} color={s.color} />
                            </div>
                        </div>
                        <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--color-text)' }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Recent Jobs */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Active Roles</h2>
                    <Link to="/client/jobs" style={{ fontSize: 13, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>View all <ArrowRight size={14} /></Link>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Role Title</th>
                            <th>Difficulty</th>
                            <th>Key Skills</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(jobs || []).slice(0, 5).map((job: any) => (
                            <tr key={job.id}>
                                <td style={{ fontWeight: 600 }}>{job.title}</td>
                                <td><span style={{ fontSize: 12, padding: '3px 8px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: 4, textTransform: 'capitalize' }}>{job.difficulty || 'mid'}</span></td>
                                <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{(job.skills || []).slice(0, 3).join(', ')}</td>
                                <td><span style={{ fontSize: 12, padding: '3px 8px', background: 'rgba(16,185,129,0.12)', color: '#10b981', borderRadius: 4 }}>{job.status}</span></td>
                                <td>
                                    <Link to={`/client/jobs/${job.id}/candidates`} style={{ fontSize: 12, color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                                        View candidates <ArrowRight size={12} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {(!jobs || jobs.length === 0) && (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
                                No roles yet. <Link to="/client/jobs/upload" style={{ color: 'var(--color-primary)' }}>Post your first role →</Link>
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
