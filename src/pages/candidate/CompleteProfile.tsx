import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import {
    User, Phone, FileText, Briefcase, DollarSign, CheckCircle2,
    ChevronRight, ChevronLeft, Loader2, UploadCloud, ShieldCheck, X
} from 'lucide-react';

const STEPS = ['Contact', 'Resume', 'Experience', 'Review'];

export default function CompleteProfile() {
    const navigate = useNavigate();
    const { user, updateProfileComplete } = useAuthStore();
    const [step, setStep] = useState(0);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const [form, setForm] = useState({
        phone: '',
        years_of_experience: 0,
        experience_level: 'junior',
        current_salary: '' as string | number,
        expected_salary: '' as string | number,
        headline: '',
        bio: '',
        skills: [] as string[],
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        location: '',
        notice_period_days: 30,
    });

    const { data: profileStatus, refetch: refetchStatus } = useQuery({
        queryKey: ['profile-status'],
        queryFn: async () => {
            const res = await api.get('/api/v1/candidates/profile-status');
            return res.data;
        },
    });

    const { data: profile } = useQuery({
        queryKey: ['candidate-profile'],
        queryFn: async () => {
            const res = await api.get('/api/v1/candidates/profile');
            return res.data;
        },
    });

    // Pre-fill form from existing profile
    useEffect(() => {
        if (profile) {
            setForm(prev => ({
                ...prev,
                phone: profile.phone || '',
                years_of_experience: profile.years_of_experience || 0,
                experience_level: profile.experience_level || 'junior',
                current_salary: profile.current_salary || '',
                expected_salary: profile.expected_salary || '',
                headline: profile.headline || '',
                bio: profile.bio || '',
                skills: profile.skills || [],
                linkedin_url: profile.linkedin_url || '',
                github_url: profile.github_url || '',
                portfolio_url: profile.portfolio_url || '',
                location: profile.location || '',
                notice_period_days: profile.notice_period_days ?? 30,
            }));
        }
    }, [profile]);

    // If already complete, redirect to dashboard
    useEffect(() => {
        if (profileStatus?.is_profile_complete) {
            updateProfileComplete(true);
            navigate('/candidate');
        }
    }, [profileStatus, navigate, updateProfileComplete]);

    const completionPercent = profileStatus?.completion_percent ?? 0;
    const fieldStatus = profileStatus?.fields ?? {};


    // --- Resume Upload ---
    const resumeMutation = useMutation({
        mutationFn: async (file: File) => {
            const fd = new FormData();
            fd.append('file', file);
            return api.post('/api/v1/candidates/resume', fd);
        },
        onSuccess: () => { toast.success('Resume uploaded'); refetchStatus(); },
        onError: () => toast.error('Resume upload failed'),
    });

    // --- Save profile ---
    const saveMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                ...form,
                current_salary: form.current_salary ? Number(form.current_salary) : null,
                expected_salary: form.expected_salary ? Number(form.expected_salary) : null,
            };
            return api.post('/api/v1/candidates/onboard', payload);
        },
        onSuccess: (res) => {
            const isComplete = res.data.is_profile_complete;
            updateProfileComplete(isComplete);
            if (isComplete) {
                toast.success('Profile complete! Welcome aboard 🎉');
                navigate('/candidate');
            } else {
                toast.error('Some required fields are still missing.');
                refetchStatus();
            }
        },
        onError: () => toast.error('Failed to save profile'),
    });

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            resumeMutation.mutate(file);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 16px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
        borderRadius: 10, color: 'var(--color-text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 13, fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
        fontFamily: "'Manrope', sans-serif"
    };

    const [activeTab, setActiveTab] = useState('profile.ts');

    const tabs = [
        { id: 'profile.ts', label: 'profile.ts', icon: <FileText size={14} /> },
        { id: 'experience.json', label: 'experience.json', icon: <ShieldCheck size={14} /> },
        { id: 'resume.md', label: 'resume.md', icon: <UploadCloud size={14} /> },
        { id: 'finalize.sh', label: 'finalize.sh', icon: <Loader2 size={14} /> },
    ];

    const renderSmartInput = (label: string, value: any, key: string, placeholder: string, type: 'text' | 'number' | 'select' = 'text', options?: {label:string, value:any}[]) => (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingLeft: 20, marginBottom: 4 }}>
            <span style={{ color: '#ABB2BF', fontSize: 13, minWidth: 100 }}>{label}:</span>
            {type === 'select' ? (
                <select 
                    style={{ background: 'transparent', border: 'none', color: '#98C379', outline: 'none', cursor: 'pointer', fontSize: 13 }}
                    value={value}
                    onChange={(e) => setForm({...form, [key]: e.target.value})}
                >
                    {options?.map(opt => <option key={opt.value} value={opt.value} style={{ background: '#1e1e1e' }}>{opt.label}</option>)}
                </select>
            ) : (
                <input 
                    type={type}
                    style={{ background: 'transparent', border: 'none', color: value ? '#98C379' : '#5C6370', outline: 'none', fontSize: 13, width: '100%' }}
                    value={value}
                    onChange={(e) => setForm({...form, [key]: e.target.value})}
                    placeholder={`'${placeholder}'`}
                />
            )}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--color-bg)' }}>
            <SEO title="Complete Profile | TopDev" description="Onboard to the network" />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{ width: 44, height: 44, background: 'var(--color-primary)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <User size={22} style={{ color: 'var(--color-bg)' }} />
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em' }}>
                    Complete your profile to continue
                </h1>
                <p style={{ color: 'var(--color-text-muted)', margin: '8px 0 0', fontSize: 14 }}>Configure your workspace and deploy your candidacy</p>
            </div>

            {/* IDE Workspace */}
            <div style={{ 
                width: '100%', 
                maxWidth: 900, 
                height: 600,
                background: '#1e1e1e', 
                borderRadius: 16, 
                border: '1px solid var(--glass-border)',
                display: 'flex',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }} className="animate-fadeInUp">
                
                {/* Sidebar */}
                <div style={{ width: 220, background: '#181818', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#6bc4e8', textTransform: 'uppercase', letterSpacing: 1 }}>Explorer</div>
                    {tabs.map(tab => (
                        <div 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ 
                                padding: '8px 16px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 10, 
                                cursor: 'pointer',
                                background: activeTab === tab.id ? '#2c2c2c' : 'transparent',
                                color: activeTab === tab.id ? '#fff' : '#858585',
                                fontSize: 13,
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ color: activeTab === tab.id ? 'var(--color-primary)' : 'inherit' }}>{tab.icon}</span>
                            {tab.label}
                        </div>
                    ))}

                    <div style={{ marginTop: 'auto', padding: 20 }}>
                        <div style={{ fontSize: 11, color: '#858585', marginBottom: 8 }}>COMPLETION</div>
                        <div style={{ width: '100%', height: 4, background: '#333', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${completionPercent}%`, height: '100%', background: 'var(--color-primary)' }} />
                        </div>
                        <div style={{ fontSize: 10, color: '#5C6370', marginTop: 4 }}>{completionPercent}% status: OK</div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Tabs / Breadcrumbs */}
                    <div style={{ background: '#252526', display: 'flex', borderBottom: '1px solid #333' }}>
                        {tabs.map(tab => (
                            <div 
                                key={tab.id}
                                style={{ 
                                    padding: '10px 20px', 
                                    fontSize: 12, 
                                    color: activeTab === tab.id ? '#fff' : '#969696',
                                    background: activeTab === tab.id ? '#1e1e1e' : '#2d2d2d',
                                    borderRight: '1px solid #181818',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    cursor: 'pointer'
                                }}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon} {tab.label}
                                {activeTab === tab.id && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                            </div>
                        ))}
                    </div>

                    {/* Editor Area */}
                    <div style={{ flex: 1, padding: 32, overflowY: 'auto', fontFamily: "'Fira Code', 'Roboto Mono', monospace" }}>
                        
                        {activeTab === 'profile.ts' && (
                            <>
                                <div style={{ color: '#C678DD', marginBottom: 8 }}>import <span style={{ color: '#D19A66' }}>{'{'} User {'}'}</span> from <span style={{ color: '#98C379' }}>'@topdev/core'</span>;</div>
                                <div style={{ color: '#E06C75', marginBottom: 20 }}><span style={{ color: '#C678DD' }}>export const</span> candidate = <span style={{ color: '#C678DD' }}>new</span> <span style={{ color: '#D19A66' }}>User</span>({'{'}</div>
                                
                                {renderSmartInput('fullName', user?.fullName, '', 'Read-only', 'text')}
                                {renderSmartInput('email', user?.email, '', 'Read-only', 'text')}
                                {renderSmartInput('phone', form.phone, 'phone', 'Update phone...')}
                                {renderSmartInput('location', form.location, 'location', 'Mumbai, India')}
                                {renderSmartInput('linkedin', form.linkedin_url, 'linkedin_url', 'LinkedIn URL')}
                                {renderSmartInput('github', form.github_url, 'github_url', 'GitHub URL')}

                                <div style={{ color: '#E06C75', marginTop: 8 }}>{'}'});</div>
                            </>
                        )}

                        {activeTab === 'experience.json' && (
                            <>
                                <div style={{ color: '#ABB2BF', marginBottom: 20 }}>{'{'}</div>
                                <div style={{ paddingLeft: 20 }}>
                                    {renderSmartInput('"headline"', form.headline, 'headline', 'Senior Frontend Engineer')}
                                    {renderSmartInput('"yearsExp"', form.years_of_experience, 'years_of_experience', '0', 'number')}
                                    {renderSmartInput('"level"', form.experience_level, 'experience_level', 'junior', 'select', [
                                        { label: 'Junior (0-2y)', value: 'junior' },
                                        { label: 'Mid (3-5y)', value: 'mid' },
                                        { label: 'Senior (6+y)', value: 'senior' },
                                    ])}
                                    {renderSmartInput('"currSalary"', form.current_salary, 'current_salary', '0', 'number')}
                                    {renderSmartInput('"expSalary"', form.expected_salary, 'expected_salary', '0', 'number')}
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingLeft: 20, marginBottom: 4 }}>
                                        <span style={{ color: '#ABB2BF', fontSize: 13, minWidth: 100 }}>"skills":</span>
                                        <span style={{ color: '#98C379', fontSize: 13 }}>[<span style={{ color: '#D19A66' }}>"{form.skills.join('", "')}"</span>]</span>
                                    </div>
                                </div>
                                <div style={{ color: '#ABB2BF', marginTop: 8 }}>{'}'}</div>
                            </>
                        )}

                        {activeTab === 'resume.md' && (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ color: '#5C6370', fontStyle: 'italic' }}># Professional Resume</div>
                                <div 
                                    onClick={() => document.getElementById('profile-resume-upload')?.click()}
                                    style={{ 
                                        flex: 1, 
                                        border: '2px dashed #333', 
                                        borderRadius: 12, 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        background: '#252526'
                                    }}
                                >
                                    {resumeMutation.isPending ? (
                                        <Loader2 size={32} style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
                                    ) : (fieldStatus.resume || resumeFile) ? (
                                        <>
                                            <CheckCircle2 size={32} style={{ color: '#98C379', marginBottom: 12 }} />
                                            <div style={{ color: '#98C379', fontSize: 14 }}>{resumeFile?.name || 'resume_uploaded.pdf'}</div>
                                            <div style={{ color: '#5C6370', fontSize: 12, marginTop: 4 }}>Click to replace file</div>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud size={32} style={{ color: '#5C6370', marginBottom: 12 }} />
                                            <div style={{ color: '#ABB2BF', fontSize: 14 }}>upload_resume(file: Blob)</div>
                                            <div style={{ color: '#5C6370', fontSize: 12, marginTop: 4 }}>Drop PDF or click to browse</div>
                                        </>
                                    )}
                                    <input id="profile-resume-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileInput} style={{ display: 'none' }} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'finalize.sh' && (
                            <div style={{ color: '#ABB2BF', fontSize: 13 }}>
                                <div style={{ marginBottom: 16 }}><span style={{ color: '#98C379' }}>$</span> <span style={{ color: '#61AFEF' }}>topdev</span> status --profile</div>
                                <div style={{ paddingLeft: 20, marginBottom: 24 }}>
                                    {Object.entries(fieldStatus).map(([key, done]) => (
                                        key !== 'phone_verified' && (
                                            <div key={key} style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
                                                <span style={{ color: '#5C6370' }}>[{done ? <span style={{ color: '#98C379' }}>v</span> : <span style={{ color: '#E06C75' }}>x</span>}]</span>
                                                <span style={{ color: '#ABB2BF' }}>{key}</span>
                                                {done ? <span style={{ color: '#98C379' }}>ready</span> : <span style={{ color: '#E06C75' }}>missing_data</span>}
                                            </div>
                                        )
                                    ))}
                                </div>
                                <div><span style={{ color: '#98C379' }}>$</span> <span style={{ color: '#61AFEF' }}>topdev</span> deploy</div>
                                <div style={{ paddingLeft: 20, marginTop: 8 }}>
                                    <button 
                                        className="btn-primary" 
                                        onClick={() => saveMutation.mutate()}
                                        disabled={saveMutation.isPending}
                                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 24px', fontSize: 13 }}
                                    >
                                        {saveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                                        Initialize Deployment
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
