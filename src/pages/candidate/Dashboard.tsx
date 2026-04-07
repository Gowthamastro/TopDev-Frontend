import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';
import {
    Briefcase, CheckCircle2, Clock, Play, Target,
    Star, TrendingUp, AlertCircle, ChevronRight, Award, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string }> = {
        invited:   { label: 'Invited',   cls: 'status-invited' },
        started:   { label: 'In Progress', cls: 'status-started' },
        submitted: { label: 'Submitted', cls: 'status-submitted' },
        scored:    { label: 'Scored',    cls: 'status-scored' },
        expired:   { label: 'Expired',   cls: 'status-expired' },
    };
    const cfg = map[status] || { label: status, cls: '' };
    return (
        <span className={`badge ${cfg.cls}`} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>
            {cfg.label}
        </span>
    );
}

function RatingBadge({ badge }: { badge: string | null }) {
    if (!badge) return null;
    const map: Record<string, { label: string; color: string; bg: string }> = {
        elite:           { label: '🏆 Elite', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        strong:          { label: '⚡ Strong', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
        qualified:       { label: '✅ Qualified', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
        below_threshold: { label: '📈 Keep Improving', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
    };
    const cfg = map[badge] || { label: badge, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
    return (
        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg }}>
            {cfg.label}
        </span>
    );
}

export default function CandidateDashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['candidate-profile'],
        queryFn: async () => {
            const res = await api.get('/api/v1/candidates/profile');
            return res.data;
        }
    });

    const { data: myAttempts = [], isLoading: attemptsLoading } = useQuery({
        queryKey: ['my-attempts'],
        queryFn: async () => {
            const res = await api.get('/api/v1/candidates/my-attempts');
            return res.data;
        },
        refetchInterval: 15000,
    });

    const { data: matchedJobs = [], refetch: refetchJobs } = useQuery({
        queryKey: ['matched-jobs'],
        queryFn: async () => {
            const res = await api.get('/api/v1/candidates/matched-jobs');
            return res.data;
        },
        enabled: !!profile?.skills?.length
    });

    const applyMutation = useMutation({
        mutationFn: async (jobId: number) => {
            const res = await api.post(`/api/v1/candidates/jobs/${jobId}/apply`);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success('Applied! Opening assessment...');
            setTimeout(() => navigate(`/test/${data.token}`), 800);
            refetchJobs();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.detail || 'Failed to apply.');
        }
    });

    useEffect(() => {
        if (!profileLoading && profile && (!profile.skills || profile.skills.length === 0)) {
            navigate('/candidate/onboard');
        }
    }, [profile, profileLoading, navigate]);

    if (profileLoading || !profile) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, border: '3px solid #1e2433', borderTopColor: '#0d59f2', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Loading your dashboard…</p>
            </div>
        </div>
    );

    // Compute stats
    const completed = myAttempts.filter((a: any) => ['submitted', 'scored'].includes(a.status));
    const pending = myAttempts.filter((a: any) => ['invited', 'started'].includes(a.status));
    const scores = completed.filter((a: any) => a.total_score != null).map((a: any) => a.total_score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null;
    const availableJobs = matchedJobs.filter((j: any) => !j.has_applied);

    const firstName = user?.fullName?.split(' ')[0] || 'Candidate';

    return (
        <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }} className="animate-fadeInUp">

            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: '#f1f5f9' }}>
                        Hi, {firstName} 👋
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 15, margin: '6px 0 0' }}>
                        {profile.headline || 'Complete your profile to get personalized job matches'}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {(profile.skills || []).slice(0, 4).map((s: string) => (
                        <span key={s} className="skill-tag" style={{ fontSize: 12 }}>{s}</span>
                    ))}
                </div>
            </header>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Applied</span>
                        <Briefcase size={16} color="#0d59f2" />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#f1f5f9' }}>{myAttempts.length}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Total roles applied</div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Completed</span>
                        <CheckCircle2 size={16} color="#10b981" />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#f1f5f9' }}>{completed.length}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Tests finished</div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Pending</span>
                        <Clock size={16} color="#f59e0b" />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#f1f5f9' }}>{pending.length}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Tests not started</div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Avg Score</span>
                        <TrendingUp size={16} color="#a78bfa" />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: avgScore !== null ? '#f1f5f9' : '#4b5563' }}>
                        {avgScore !== null ? `${avgScore}%` : '—'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Across scored tests</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

                {/* Applied Roles */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                            <FileText size={18} color="#0d59f2" /> Applied Roles
                        </h2>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{myAttempts.length} total</span>
                    </div>

                    {attemptsLoading ? (
                        <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
                            Loading…
                        </div>
                    ) : myAttempts.length === 0 ? (
                        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                            <Briefcase size={32} color="#1e2433" style={{ margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: 14 }}>No applications yet</p>
                            <p style={{ color: '#4b5563', margin: '6px 0 0', fontSize: 13 }}>Apply to available roles below to get started.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {myAttempts.map((attempt: any) => (
                                <div key={attempt.id} className="card" style={{ padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                        <div>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 3 }}>{attempt.role_title}</div>
                                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{attempt.company}</div>
                                        </div>
                                        <StatusBadge status={attempt.status} />
                                    </div>

                                    {/* Score display */}
                                    {attempt.total_score != null && (
                                        <div style={{ marginBottom: 10 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Score</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{attempt.total_score}%</span>
                                                    <RatingBadge badge={attempt.rating_badge} />
                                                </div>
                                            </div>
                                            <div className="score-bar-track">
                                                <div className="score-bar-fill" style={{ width: `${attempt.total_score}%` }} />
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        {attempt.status === 'invited' && (
                                            <button className="btn-primary" onClick={() => navigate(`/test/${attempt.token}`)}
                                                style={{ fontSize: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Play size={13} /> Take Test
                                            </button>
                                        )}
                                        {attempt.status === 'started' && (
                                            <button className="btn-primary" onClick={() => navigate(`/test/${attempt.token}`)}
                                                style={{ fontSize: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, background: '#f59e0b' }}>
                                                <Play size={13} /> Resume Test
                                            </button>
                                        )}
                                        {['submitted', 'scored'].includes(attempt.status) && (
                                            <button className="btn-secondary" onClick={() => navigate(`/candidate/results/${attempt.id}`)}
                                                style={{ fontSize: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Award size={13} /> View Results
                                            </button>
                                        )}
                                        {attempt.status === 'expired' && (
                                            <span style={{ fontSize: 12, color: '#4b5563' }}>Link expired</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Available Roles */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                            <Target size={18} color="#10b981" /> Available Roles
                        </h2>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{availableJobs.length} open</span>
                    </div>

                    {!profile?.skills?.length ? (
                        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                            <AlertCircle size={32} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: 14 }}>Complete your profile first</p>
                            <p style={{ color: '#4b5563', margin: '6px 0 16px', fontSize: 13 }}>Add your skills to unlock job matches.</p>
                            <button className="btn-primary" onClick={() => navigate('/candidate/onboard')} style={{ fontSize: 13 }}>
                                Complete Profile
                            </button>
                        </div>
                    ) : availableJobs.length === 0 ? (
                        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                            <Target size={32} color="#1e2433" style={{ margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: 14 }}>No new roles at the moment</p>
                            <p style={{ color: '#4b5563', margin: '6px 0 0', fontSize: 13 }}>Check back soon — new positions are added regularly.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {availableJobs.map((job: any) => (
                                <div key={job.id} className="card" style={{ padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                        <div>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 3 }}>{job.title}</div>
                                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{job.company}</div>
                                        </div>
                                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                            {job.match_percent}% match
                                        </span>
                                    </div>

                                    {/* Skills */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                                        {(job.skills || []).slice(0, 5).map((skill: string) => (
                                            <span key={skill} style={{ padding: '2px 8px', background: '#1e2433', borderRadius: 12, fontSize: 11, color: '#94a3b8' }}>{skill}</span>
                                        ))}
                                    </div>

                                    <button
                                        className="btn-primary"
                                        onClick={() => applyMutation.mutate(job.id)}
                                        disabled={applyMutation.isPending}
                                        style={{ fontSize: 12, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
                                    >
                                        <Play size={13} /> Apply & Take Test
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
