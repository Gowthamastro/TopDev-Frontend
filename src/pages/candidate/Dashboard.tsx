import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Briefcase, Star, Clock, CheckCircle2, ChevronRight, Target, Play } from 'lucide-react';
import toast from 'react-hot-toast';

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

    const { data: matchedJobs, refetch: refetchJobs } = useQuery({
        queryKey: ['matched-jobs'],
        queryFn: async () => {
            const res = await api.get('/api/v1/candidates/matched-jobs');
            return res.data;
        },
        enabled: !!profile?.skills?.length
    });

    // Dummy test attempts for now; in a real app this would be a separate user endpoint
    // For now we will just use the `/test/{token}` or `/results` flows. Since we don't have a `GET /test-attempts` endpoint,
    // we'll just display profile details and jobs!

    const applyMutation = useMutation({
        mutationFn: async (jobId: number) => {
            const res = await api.post(`/api/v1/candidates/jobs/${jobId}/apply`);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success("Applied! Redirecting to test...");
            setTimeout(() => {
                navigate(`/test/${data.token}`);
            }, 1000);
            refetchJobs();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.detail || "Failed to apply.");
        }
    });

    useEffect(() => {
        if (!profileLoading && profile && (!profile.skills || profile.skills.length === 0)) {
            navigate('/candidate/onboard');
        }
    }, [profile, profileLoading, navigate]);

    if (profileLoading || !profile) return <div style={{ padding: 40 }}>Loading...</div>;

    return (
        <div style={{ padding: 40, maxWidth: 1000, margin: '0 auto' }} className="animate-fadeInUp">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>Hi, {user?.fullName?.split(' ')[0]} 👋</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>{profile.headline || 'Software Engineer'}</p>
                </div>
                <div className="card" style={{ padding: '16px 24px', display: 'flex', gap: 24 }}>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Experience</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{profile.years_of_experience || 0} Years</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Top Skills</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>{(profile.skills || []).slice(0, 2).join(', ') || 'None'}</div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
                {/* Available Jobs */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Target size={20} color="var(--color-primary)" /> Job Matches For You
                        </h2>
                    </div>
                    
                    <div style={{ display: 'grid', gap: 16 }}>
                        {matchedJobs?.length === 0 && (
                            <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                No jobs available at the moment.
                            </div>
                        )}
                        {matchedJobs?.map((job: any) => (
                            <div key={job.id} className="card" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 600 }}>{job.title}</h3>
                                        <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                                            {job.match_percent}% Match
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 12 }}>
                                        {job.company} • {job.difficulty || 'Intermediate'} Focus
                                    </p>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {(job.skills || []).map((skill: string, idx: number) => (
                                            <span key={idx} style={{ padding: '2px 8px', background: 'var(--color-bg-tertiary)', borderRadius: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    {job.has_applied ? (
                                        <button className="btn btn-outline" disabled style={{ opacity: 0.5 }}>
                                            <CheckCircle2 size={16} /> Applied
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-primary" 
                                            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                                            onClick={() => applyMutation.mutate(job.id)}
                                            disabled={applyMutation.isPending}
                                        >
                                            <Play size={16} /> Take Job Test
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
