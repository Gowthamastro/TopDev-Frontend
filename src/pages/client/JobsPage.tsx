import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Clock } from 'lucide-react';
import api from '../../services/api';

export default function JobsPage() {
    const { data: jobs, isLoading } = useQuery({ queryKey: ['client-jobs'], queryFn: () => api.get('/api/v1/jobs/').then(r => r.data) });

    const statusColors: Record<string, string> = { active: '#10b981', draft: '#f59e0b', archived: '#64748b', filled: '#6366f1' };
    const diffColors: Record<string, string> = { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444' };

    return (
        <div style={{ padding: 32 }} className="animate-fadeInUp">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Job Roles</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: 14 }}>Manage your active roles and view candidate pipelines.</p>
                </div>
                <Link to="/client/jobs/upload" className="btn-primary"><Plus size={16} /> New Role</Link>
            </div>

            {isLoading ? (
                <div style={{ color: 'var(--color-text-muted)', padding: 40, textAlign: 'center' }}>Loading roles...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: 16 }}>
                    {(jobs || []).map((job: any) => (
                        <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{job.title}</h3>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <span style={{ fontSize: 11, padding: '2px 8px', background: `${statusColors[job.status] || '#64748b'}18`, color: statusColors[job.status] || '#64748b', borderRadius: 4, fontWeight: 600, textTransform: 'capitalize' }}>{job.status}</span>
                                        {job.difficulty && <span style={{ fontSize: 11, padding: '2px 8px', background: `${diffColors[job.difficulty] || '#64748b'}18`, color: diffColors[job.difficulty] || '#64748b', borderRadius: 4, fontWeight: 600, textTransform: 'capitalize' }}>{job.difficulty}</span>}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {(job.skills || []).slice(0, 5).map((sk: string) => (
                                    <span key={sk} style={{ fontSize: 11, padding: '3px 8px', background: 'rgba(99,102,241,0.08)', color: '#818cf8', borderRadius: 4 }}>{sk}</span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={12} /> {new Date(job.created_at).toLocaleDateString()}
                                </span>
                                <Link to={`/client/jobs/${job.id}/candidates`} style={{ fontSize: 13, color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 500 }}>
                                    View candidates <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                    {(!jobs || jobs.length === 0) && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--color-text-muted)' }}>
                            No roles yet. <Link to="/client/jobs/upload" style={{ color: 'var(--color-primary)' }}>Post your first role →</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
