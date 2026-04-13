import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import { useEffect } from 'react';
import {
    Briefcase, MapPin, Target, ChevronRight, User, FileText,
    Building2, Clock, Search, Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';

export default function CandidateDashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { flags } = useFeatureFlags();

    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['candidate-profile'],
        queryFn: async () => {
            const res = await api.get('/api/v1/candidates/profile');
            return res.data;
        }
    });

    const { data: matchedJobs = [], refetch: refetchJobs } = useQuery({
        queryKey: ['matched-jobs'],
        queryFn: async () => {
            const res = await api.get('/api/v1/candidates/matched-jobs');
            return res.data;
        },
    });

    const applyMutation = useMutation({
        mutationFn: async (jobId: number) => {
            const res = await api.post(`/api/v1/candidates/jobs/${jobId}/apply`);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Application submitted!');
            refetchJobs();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.detail || 'Failed to apply.');
        }
    });

    useEffect(() => {
        if (!profileLoading && profile && !profile.is_profile_complete) {
            navigate('/complete-profile');
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

    const firstName = user?.fullName?.split(' ')[0] || 'Candidate';
    const availableJobs = matchedJobs.filter((j: any) => !j.has_applied);
    const appliedJobs = matchedJobs.filter((j: any) => j.has_applied);

    return (
        <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }} className="animate-fadeInUp">
            <SEO 
                title="Candidate Dashboard" 
                description="Browse active job roles, manage your applications, and track your recruitment progress on TopDev."
            />

            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: '#f1f5f9' }}>
                        Hi, {firstName} 👋
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 15, margin: '6px 0 0' }}>
                        {profile.headline || 'Browse jobs and apply to your best matches'}
                    </p>
                </div>
                <button
                    className="btn-secondary"
                    onClick={() => navigate('/complete-profile')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                >
                    <Edit3 size={14} /> Edit Profile
                </button>
            </header>

            {/* Profile Summary Card */}
            <div className="card" style={{ padding: 20, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #0d59f2, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={24} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9' }}>{user?.fullName}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{profile.headline || 'Software Professional'}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {(profile.skills || []).slice(0, 6).map((s: string) => (
                            <span key={s} style={{ padding: '2px 10px', background: '#1e2433', borderRadius: 12, fontSize: 11, color: '#94a3b8' }}>{s}</span>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>{profile.years_of_experience ?? '—'}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Yrs Exp</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>{appliedJobs.length}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Applied</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#0d59f2' }}>{availableJobs.length}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Open Jobs</div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

                {/* Available Jobs */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                            <Search size={18} color="#0d59f2" /> Available Jobs
                        </h2>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{availableJobs.length} open</span>
                    </div>

                    {availableJobs.length === 0 ? (
                        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                            <Target size={32} color="#1e2433" style={{ margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: 14 }}>No new roles at the moment</p>
                            <p style={{ color: '#4b5563', margin: '6px 0 0', fontSize: 13 }}>Check back soon — new positions added regularly.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {availableJobs.map((job: any) => (
                                <div key={job.id} className="card" style={{ padding: 18, transition: 'border-color 0.2s' }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#1e2433')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                        <div>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{job.title}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#64748b' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={12} /> {job.company}</span>
                                                {job.difficulty && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {job.difficulty}</span>}
                                            </div>
                                        </div>
                                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                            {job.match_percent}% match
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                                        {(job.skills || []).slice(0, 5).map((skill: string) => (
                                            <span key={skill} style={{ padding: '2px 8px', background: '#1e2433', borderRadius: 12, fontSize: 11, color: '#94a3b8' }}>{skill}</span>
                                        ))}
                                    </div>

                                    <button
                                        className="btn-primary"
                                        onClick={() => applyMutation.mutate(job.id)}
                                        disabled={applyMutation.isPending}
                                        style={{ fontSize: 12, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
                                    >
                                        <Briefcase size={13} /> Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Applied Jobs */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                            <FileText size={18} color="#10b981" /> My Applications
                        </h2>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{appliedJobs.length} applied</span>
                    </div>

                    {appliedJobs.length === 0 ? (
                        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                            <Briefcase size={32} color="#1e2433" style={{ margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: 14 }}>No applications yet</p>
                            <p style={{ color: '#4b5563', margin: '6px 0 0', fontSize: 13 }}>Apply to available roles to get started.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {appliedJobs.map((job: any) => (
                                <div key={job.id} className="card" style={{ padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 3 }}>{job.title}</div>
                                            <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Building2 size={12} /> {job.company}
                                            </div>
                                        </div>
                                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(13,89,242,0.1)', color: '#60a5fa' }}>
                                            Applied ✓
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
