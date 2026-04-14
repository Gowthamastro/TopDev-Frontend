import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Clock, Briefcase, Zap, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function JobsPage() {
    const { data: jobs, isLoading, isError } = useQuery({
        queryKey: ['client-jobs'],
        queryFn: () => api.get('/api/v1/jobs/').then(r => r.data)
    });

    const statusColors: Record<string, { bg: string; color: string; border: string }> = {
        active: { bg: 'rgba(0,0,0,0.04)', color: '#000', border: '1px solid rgba(0,0,0,0.08)' },
        draft: { bg: 'rgba(0,0,0,0.03)', color: '#666', border: '1px solid rgba(0,0,0,0.06)' },
        archived: { bg: 'rgba(0,0,0,0.02)', color: '#999', border: '1px solid rgba(0,0,0,0.05)' },
        filled: { bg: '#000', color: '#fff', border: '1px solid #000' }
    };

    const diffConfig: Record<string, { bg: string; color: string; border: string }> = {
        beginner: { bg: 'rgba(0,0,0,0.03)', color: '#666', border: '1px solid rgba(0,0,0,0.06)' },
        intermediate: { bg: 'rgba(0,0,0,0.04)', color: '#333', border: '1px solid rgba(0,0,0,0.08)' },
        advanced: { bg: '#000', color: '#fff', border: '1px solid #000' }
    };

    return (
        <div style={{ padding: '32px 32px', maxWidth: 1200, margin: '0 auto' }} className="animate-fadeInUp">
            {/* Header Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#000', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12, margin: 0, fontFamily: "'Manrope', sans-serif" }}>
                        <Briefcase color="#000" size={28} />
                        Active Roles
                    </h1>
                    <p style={{ color: '#666', marginTop: 8, fontSize: 14, maxWidth: 560 }}>
                        Manage your open positions, track candidates, and review assessments in one unified command center.
                    </p>
                </div>
                <Link to="/client/jobs/upload" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px' }}>
                    <Plus size={18} />
                    Deploy New Role
                </Link>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="card" style={{ padding: 80, textAlign: 'center' }}>
                    <div style={{ width: 32, height: 32, border: '3px solid #F0F0F0', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: '#666', fontSize: 14 }}>Initializing role data...</p>
                </div>
            ) : isError ? (
                <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                    <AlertCircle color="#dc2626" size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
                    <h3 style={{ color: '#000', fontWeight: 700, margin: '0 0 4px', fontFamily: "'Manrope', sans-serif" }}>Failed to load roles</h3>
                    <p style={{ color: '#666', fontSize: 14, margin: 0 }}>There was an error communicating with the server.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {(jobs || []).map((job: any) => {
                        const st = statusColors[job.status] || statusColors.archived;
                        const df = diffConfig[job.difficulty] || diffConfig.beginner;
                        return (
                            <div key={job.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}>

                                {/* Card Header */}
                                <div style={{ marginBottom: 16 }}>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#000', margin: '0 0 10px', fontFamily: "'Manrope', sans-serif" }}>{job.title}</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 9999, background: st.bg, color: st.color, border: st.border, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
                                            {job.status}
                                        </span>
                                        {job.difficulty && (
                                            <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 9999, background: df.bg, color: df.color, border: df.border, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
                                                {job.difficulty}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20, flex: 1 }}>
                                    {(job.skills || []).slice(0, 4).map((sk: string) => (
                                        <span key={sk} style={{ fontSize: 12, padding: '3px 10px', background: '#F9F9F9', border: '1px solid rgba(0,0,0,0.06)', color: '#666', borderRadius: 4 }}>
                                            {sk}
                                        </span>
                                    ))}
                                    {(job.skills || []).length > 4 && (
                                        <span style={{ fontSize: 12, padding: '3px 10px', background: '#F9F9F9', border: '1px solid rgba(0,0,0,0.04)', color: '#999', borderRadius: 4 }}>
                                            +{(job.skills || []).length - 4}
                                        </span>
                                    )}
                                </div>

                                {/* Footer */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: 'auto' }}>
                                    <span style={{ fontSize: 12, color: '#999', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Clock size={12} />
                                        {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <Link to={`/client/jobs/${job.id}/assessment`} style={{ fontSize: 12, color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}>
                                            <Zap size={14} /> Test
                                        </Link>
                                        <Link to={`/client/jobs/${job.id}/candidates`} style={{ fontSize: 12, color: '#000', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}>
                                            Pipeline <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {(!jobs || jobs.length === 0) && !isError && (
                        <div style={{ gridColumn: '1 / -1', padding: 64, textAlign: 'center' }} className="card">
                            <div style={{ width: 64, height: 64, background: 'rgba(0,0,0,0.04)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                                <Briefcase color="#000" size={28} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#000', margin: '0 0 8px', fontFamily: "'Manrope', sans-serif" }}>No active roles</h3>
                            <p style={{ color: '#666', maxWidth: 400, margin: '0 auto 24px', fontSize: 14 }}>Deploy your first job assessment to start screening talent.</p>
                            <Link to="/client/jobs/upload" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <Plus size={16} /> Create Role
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
