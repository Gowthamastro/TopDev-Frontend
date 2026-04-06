import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { UploadCloud, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

export default function CandidateOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    
    // Form State
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        phone: '',
        location: '',
        years_of_experience: 0,
        experience_level: 'junior',
        headline: '',
        bio: '',
        skills: [] as string[],
        linkedin_url: '',
        github_url: '',
        portfolio_url: ''
    });

    // Check if profile exists
    const { data: profile } = useQuery({
        queryKey: ['candidate-profile'],
        queryFn: async () => {
            const res = await api.get('/api/v1/candidates/profile');
            return res.data;
        }
    });

    const parseResumeMutation = useMutation({
        mutationFn: async (file: File) => {
            const fd = new FormData();
            fd.append('file', file);
            const res = await api.post('/api/v1/candidates/parse-resume', fd);
            return res.data;
        },
        onSuccess: (data) => {
            setFormData(prev => ({
                ...prev,
                years_of_experience: data.years_of_experience || 0,
                experience_level: data.experience_level || 'junior',
                headline: data.headline || '',
                bio: data.bio || '',
                skills: data.skills || []
            }));
            toast.success("Resume parsed successfully!");
            setStep(2);
        },
        onError: () => {
            toast.error("Failed to parse resume. Proceeding manually.");
            setStep(2);
        }
    });

    const onboardMutation = useMutation({
        mutationFn: async () => {
            const baseRes = await api.post('/api/v1/candidates/onboard', formData);
            if (resumeFile) {
                const fd = new FormData();
                fd.append('file', resumeFile);
                await api.post('/api/v1/candidates/resume', fd);
            }
            return baseRes.data;
        },
        onSuccess: () => {
            toast.success('Profile created! Your assessment is ready.');
            navigate('/candidate');
        },
        onError: () => toast.error('Failed to save profile.')
    });

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
            parseResumeMutation.mutate(file);
        } else {
            toast.error("Please upload a PDF file.");
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            parseResumeMutation.mutate(file);
        }
    };

    if (profile?.skills?.length > 0) {
        // Redirect if already onboarded
        setTimeout(() => navigate('/candidate'), 0);
        return null;
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
            <div className="card animate-fadeInUp">
                {step === 1 && (
                    <div style={{ padding: 48, textAlign: 'center' }}>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Welcome! Let's get to know you.</h1>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>Upload your resume and we'll automatically extract your skills to give you the best job matches.</p>
                        
                        <div 
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleFileDrop}
                            style={{ 
                                border: '2px dashed var(--color-border)', 
                                borderRadius: 12, 
                                padding: 48,
                                cursor: 'pointer',
                                background: 'var(--color-bg-secondary)',
                                transition: 'all 0.2s',
                                marginBottom: 16
                            }}
                            onClick={() => document.getElementById('resume-upload')?.click()}
                        >
                            {parseResumeMutation.isPending ? (
                                <Loader2 className="animate-spin" size={48} color="#475569" style={{ margin: '0 auto 16px' }} />
                            ) : (
                                <UploadCloud size={48} color="#475569" style={{ margin: '0 auto 16px' }} />
                            )}
                            <h3 style={{ fontSize: 18, marginBottom: 8 }}>{parseResumeMutation.isPending ? "Extracting skills via AI..." : "Click or drag resume (PDF)"}</h3>
                            <input id="resume-upload" type="file" accept=".pdf" onChange={handleFileInput} style={{ display: 'none' }} />
                        </div>
                        <button onClick={() => setStep(2)} className="btn btn-outline">Skip & fill manually</button>
                    </div>
                )}

                {step === 2 && (
                    <div style={{ padding: 40 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Review your profile</h2>
                        
                        <div style={{ display: 'grid', gap: 16 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>Headline</label>
                                <input className="input" value={formData.headline} onChange={e => setFormData({ ...formData, headline: e.target.value })} placeholder="e.g. Senior Frontend Engineer" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>Years of Experience</label>
                                    <input type="number" className="input" value={formData.years_of_experience} onChange={e => setFormData({ ...formData, years_of_experience: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>Phone</label>
                                    <input className="input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>Location</label>
                                <input className="input" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="City, Country" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>Bio</label>
                                <textarea className="input" style={{ minHeight: 80 }} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>Skills (comma separated)</label>
                                <input className="input" value={formData.skills.join(', ')} onChange={e => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>LinkedIn URL</label>
                                    <input className="input" value={formData.linkedin_url} onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>GitHub URL</label>
                                    <input className="input" value={formData.github_url} onChange={e => setFormData({ ...formData, github_url: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <button className="btn btn-primary" onClick={() => onboardMutation.mutate()} disabled={onboardMutation.isPending}>
                                {onboardMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : "Save Profile & Continue"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
