import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { UploadCloud, CheckCircle2, Loader2, X, Plus, DollarSign, Clock, Briefcase, User, Link, ChevronRight, ChevronLeft } from 'lucide-react';

const NOTICE_PERIOD_OPTIONS = [
    { label: 'Immediate', value: 0 },
    { label: '15 Days', value: 15 },
    { label: '1 Month', value: 30 },
    { label: '2 Months', value: 60 },
    { label: '3 Months', value: 90 },
];

export default function CandidateOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [skillInput, setSkillInput] = useState('');

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
        portfolio_url: '',
        current_salary: '' as string | number,
        expected_salary: '' as string | number,
        notice_period_days: 30,
    });

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
            toast.success('Resume parsed! Review and complete your profile.');
            setStep(2);
        },
        onError: () => {
            toast.error('Could not parse resume. Fill in manually.');
            setStep(2);
        }
    });

    const onboardMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                ...formData,
                current_salary: formData.current_salary ? Number(formData.current_salary) : null,
                expected_salary: formData.expected_salary ? Number(formData.expected_salary) : null,
            };
            const baseRes = await api.post('/api/v1/candidates/onboard', payload);
            if (resumeFile) {
                const fd = new FormData();
                fd.append('file', resumeFile);
                await api.post('/api/v1/candidates/resume', fd);
            }
            return baseRes.data;
        },
        onSuccess: () => {
            toast.success('Profile saved! Your assessment is being generated.');
            navigate('/candidate');
        },
        onError: () => toast.error('Failed to save profile. Please try again.')
    });

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
            parseResumeMutation.mutate(file);
        } else {
            toast.error('Please upload a PDF file.');
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setResumeFile(file); parseResumeMutation.mutate(file); }
    };

    const addSkill = (val?: string) => {
        const toAdd = (val || skillInput).trim();
        if (toAdd && !formData.skills.includes(toAdd)) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, toAdd] }));
        }
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); }
    };

    if (profile?.skills?.length > 0) {
        setTimeout(() => navigate('/candidate'), 0);
        return null;
    }

    const steps = ['Resume', 'Profile', 'Skills'];

    return (
        <div className="animated-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #0d59f2, #6366f1)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 0 20px rgba(13,89,242,0.3)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'white' }}>code_blocks</span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#f1f5f9' }}>Complete your profile</h1>
                <p style={{ color: 'var(--color-text-muted)', margin: '6px 0 0', fontSize: 14 }}>3 quick steps to find your perfect match</p>
            </div>

            {/* Step Indicator */}
            <div className="step-indicator" style={{ width: '100%', maxWidth: 480, marginBottom: 32 }}>
                {steps.map((label, i) => {
                    const idx = i + 1;
                    const isCompleted = step > idx;
                    const isActive = step === idx;
                    return (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                <div className={`step-dot ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
                                    {isCompleted ? <CheckCircle2 size={16} /> : idx}
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 500, color: isActive ? '#60a5fa' : isCompleted ? '#10b981' : '#4b5563', whiteSpace: 'nowrap' }}>{label}</span>
                            </div>
                            {i < steps.length - 1 && <div className={`step-line ${isCompleted ? 'completed' : ''}`} style={{ margin: '0 8px', marginBottom: 22 }} />}
                        </div>
                    );
                })}
            </div>

            {/* Card */}
            <div className="card animate-fadeInUp" style={{ width: '100%', maxWidth: 600, padding: 0, overflow: 'hidden' }}>
                {/* Step 1 — Resume Upload */}
                {step === 1 && (
                    <div style={{ padding: 40, textAlign: 'center' }}>
                        <UploadCloud size={40} color="#0d59f2" style={{ margin: '0 auto 20px' }} />
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>Upload your resume</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 28, fontSize: 14 }}>Our AI extracts your skills and experience — saves you lots of typing.</p>

                        <div
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleFileDrop}
                            onClick={() => !parseResumeMutation.isPending && document.getElementById('resume-upload')?.click()}
                            style={{
                                border: '2px dashed #1e2433',
                                borderRadius: 14, padding: '40px 24px',
                                cursor: parseResumeMutation.isPending ? 'default' : 'pointer',
                                background: '#0d1016',
                                transition: 'all 0.2s', marginBottom: 20,
                            }}
                            onMouseEnter={e => { if (!parseResumeMutation.isPending) (e.currentTarget as HTMLDivElement).style.borderColor = '#0d59f2'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1e2433'; }}
                        >
                            {parseResumeMutation.isPending ? (
                                <>
                                    <Loader2 size={40} color="#0d59f2" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                                    <p style={{ color: '#60a5fa', fontWeight: 500, margin: 0 }}>Extracting skills via AI...</p>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: '4px 0 0' }}>This takes a few seconds</p>
                                </>
                            ) : resumeFile ? (
                                <>
                                    <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
                                    <p style={{ color: '#10b981', fontWeight: 500, margin: 0 }}>{resumeFile.name}</p>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: '4px 0 0' }}>Click to replace</p>
                                </>
                            ) : (
                                <>
                                    <UploadCloud size={40} color="#4b5563" style={{ margin: '0 auto 12px' }} />
                                    <p style={{ color: '#e2e8f0', fontWeight: 500, margin: 0 }}>Drop your resume here or click to browse</p>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: '4px 0 0' }}>PDF files only • Max 10MB</p>
                                </>
                            )}
                            <input id="resume-upload" type="file" accept=".pdf" onChange={handleFileInput} style={{ display: 'none' }} />
                        </div>

                        <button onClick={() => setStep(2)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                            Skip — I'll fill in manually
                        </button>
                    </div>
                )}

                {/* Step 2 — Profile Details */}
                {step === 2 && (
                    <div style={{ padding: 40 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#f1f5f9' }}>Your details</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '0 0 28px' }}>Tell companies a bit about yourself.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            {/* Headline */}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Professional Headline</label>
                                <input className="input" value={formData.headline} onChange={e => setFormData({ ...formData, headline: e.target.value })} placeholder="e.g. Senior Frontend Engineer at Google" />
                            </div>

                            {/* Bio */}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                                    About you <span style={{ color: '#4b5563', fontWeight: 400 }}>— tell us about yourself</span>
                                </label>
                                <textarea
                                    className="input"
                                    style={{ minHeight: 90, resize: 'vertical' }}
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="I'm a passionate engineer with 5+ years of experience building scalable web applications..."
                                />
                            </div>

                            {/* Experience & Location */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                        <Briefcase size={13} /> Years of Experience
                                    </label>
                                    <input type="number" min={0} max={50} className="input" value={formData.years_of_experience}
                                        onChange={e => setFormData({ ...formData, years_of_experience: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Experience Level</label>
                                    <select className="input" style={{ appearance: 'auto' }} value={formData.experience_level}
                                        onChange={e => setFormData({ ...formData, experience_level: e.target.value })}>
                                        <option value="junior">Junior (0–2 yrs)</option>
                                        <option value="mid">Mid (3–5 yrs)</option>
                                        <option value="senior">Senior (6+ yrs)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Location & Phone */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Location</label>
                                    <input className="input" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Mumbai, India" />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Phone</label>
                                    <input className="input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
                                </div>
                            </div>

                            {/* Salary Fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                        <DollarSign size={13} /> Current Salary (₹/yr) <span style={{ color: '#4b5563' }}>optional</span>
                                    </label>
                                    <input type="number" className="input" value={formData.current_salary}
                                        onChange={e => setFormData({ ...formData, current_salary: e.target.value })}
                                        placeholder="e.g. 1200000" />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                        <DollarSign size={13} /> Expected Salary (₹/yr)
                                    </label>
                                    <input type="number" className="input" value={formData.expected_salary}
                                        onChange={e => setFormData({ ...formData, expected_salary: e.target.value })}
                                        placeholder="e.g. 1800000" />
                                </div>
                            </div>

                            {/* Notice Period */}
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                    <Clock size={13} /> Notice Period
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {NOTICE_PERIOD_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, notice_period_days: opt.value })}
                                            style={{
                                                padding: '7px 16px', borderRadius: 20,
                                                border: `1px solid ${formData.notice_period_days === opt.value ? '#0d59f2' : '#1e2433'}`,
                                                background: formData.notice_period_days === opt.value ? 'rgba(13,89,242,0.15)' : '#11141c',
                                                color: formData.notice_period_days === opt.value ? '#60a5fa' : '#94a3b8',
                                                fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* LinkedIn & GitHub */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                        <Link size={13} /> LinkedIn URL
                                    </label>
                                    <input className="input" value={formData.linkedin_url} onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })} placeholder="linkedin.com/in/..." />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                        <Link size={13} /> GitHub URL
                                    </label>
                                    <input className="input" value={formData.github_url} onChange={e => setFormData({ ...formData, github_url: e.target.value })} placeholder="github.com/..." />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12 }}>
                            <button className="btn-secondary" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => {
                                    if (!formData.headline) { toast.error('Please add a professional headline'); return; }
                                    setStep(3);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                Next: Skills <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3 — Skills */}
                {step === 3 && (
                    <div style={{ padding: 40 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#f1f5f9' }}>Your skills</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '0 0 28px' }}>Add the technologies and skills you work with. These power your job matches.</p>

                        {/* Skill input */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                            <input
                                className="input"
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                                placeholder="Type a skill and press Enter (e.g. React, Python, AWS)"
                                style={{ flex: 1 }}
                            />
                            <button type="button" className="btn-secondary" onClick={() => addSkill()} style={{ flexShrink: 0, padding: '10px 16px' }}>
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 60, padding: 16, background: '#0d1016', borderRadius: 12, border: '1px solid #1e2433', marginBottom: 24 }}>
                            {formData.skills.length === 0 ? (
                                <p style={{ color: '#4b5563', fontSize: 13, margin: 0, alignSelf: 'center' }}>No skills added yet — add some above ☝️</p>
                            ) : formData.skills.map(skill => (
                                <span key={skill} className="skill-tag">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} title="Remove">×</button>
                                </span>
                            ))}
                        </div>

                        {/* Suggested skills */}
                        <div style={{ marginBottom: 32 }}>
                            <p style={{ fontSize: 12, color: '#4b5563', marginBottom: 8 }}>POPULAR SKILLS</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {['React', 'TypeScript', 'Python', 'Node.js', 'AWS', 'Docker', 'PostgreSQL', 'FastAPI', 'Go', 'Kubernetes'].map(s => (
                                    !formData.skills.includes(s) && (
                                        <button
                                            key={s} type="button"
                                            onClick={() => addSkill(s)}
                                            style={{ padding: '4px 12px', borderRadius: 20, border: '1px solid #1e2433', background: '#11141c', color: '#94a3b8', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#0d59f2'; (e.currentTarget as HTMLButtonElement).style.color = '#60a5fa'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1e2433'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
                                        >
                                            + {s}
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <button className="btn-secondary" onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => {
                                    if (formData.skills.length === 0) { toast.error('Please add at least one skill'); return; }
                                    onboardMutation.mutate();
                                }}
                                disabled={onboardMutation.isPending}
                                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                {onboardMutation.isPending ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <>Save Profile & Continue <CheckCircle2 size={16} /></>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
