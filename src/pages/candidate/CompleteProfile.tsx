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
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');

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
            if (profile.phone_verified) setOtpSent(false);
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

    // --- OTP ---
    const sendOtpMutation = useMutation({
        mutationFn: () => api.post('/api/v1/otp/send', { phone: form.phone }),
        onSuccess: () => { setOtpSent(true); toast.success('OTP sent to your phone!'); },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to send OTP'),
    });

    const verifyOtpMutation = useMutation({
        mutationFn: () => api.post('/api/v1/otp/verify', { phone: form.phone, otp: otpCode }),
        onSuccess: () => { toast.success('Phone verified ✓'); refetchStatus(); },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Invalid OTP'),
    });

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
        width: '100%', padding: '12px 16px', background: '#0d1016', border: '1px solid #1e2433',
        borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 13, fontWeight: 500, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
    };

    return (
        <div className="animated-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #0d59f2, #6366f1)', borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 0 20px rgba(13,89,242,0.3)' }}>
                    <User size={24} color="white" />
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#f1f5f9' }}>Complete your profile to continue</h1>
                <p style={{ color: '#94a3b8', margin: '6px 0 0', fontSize: 14 }}>High-quality profiles connect you with the best opportunities</p>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', maxWidth: 560, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                    <span style={{ color: '#94a3b8', fontWeight: 600 }}>Profile Completion</span>
                    <span style={{ color: completionPercent >= 100 ? '#10b981' : '#0d59f2', fontWeight: 700 }}>{completionPercent}%</span>
                </div>
                <div style={{ width: '100%', height: 8, background: '#1e2433', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{
                        width: `${completionPercent}%`, height: '100%', borderRadius: 8, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                        background: completionPercent >= 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #0d59f2, #6366f1)',
                        boxShadow: `0 0 12px ${completionPercent >= 100 ? 'rgba(16,185,129,0.4)' : 'rgba(13,89,242,0.4)'}`,
                    }} />
                </div>
            </div>

            {/* Step Indicator */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, width: '100%', maxWidth: 560 }}>
                {STEPS.map((s, i) => (
                    <button key={s} onClick={() => setStep(i)} style={{
                        flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: i === step ? 'rgba(13,89,242,0.15)' : '#0d1016',
                        color: i === step ? '#60a5fa' : '#4b5563', fontSize: 12, fontWeight: 600,
                        borderBottom: i === step ? '2px solid #0d59f2' : '2px solid transparent',
                        transition: 'all 0.2s',
                    }}>
                        {i < step ? <CheckCircle2 size={13} style={{ marginRight: 4, verticalAlign: -2 }} /> : null}
                        {s}
                    </button>
                ))}
            </div>

            {/* Card */}
            <div className="card animate-fadeInUp" style={{ width: '100%', maxWidth: 560, padding: 36, overflow: 'hidden' }}>

                {/* Step 0 — Contact */}
                {step === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Phone size={18} color="#0d59f2" /> Contact Information
                        </h2>

                        <div>
                            <label style={labelStyle}>Full Name {fieldStatus.full_name && <CheckCircle2 size={13} color="#10b981" />}</label>
                            <input style={inputStyle} value={user?.fullName || ''} disabled placeholder="Your full name" />
                            <p style={{ fontSize: 11, color: '#4b5563', margin: '4px 0 0' }}>Set during registration</p>
                        </div>

                        <div>
                            <label style={labelStyle}>Email {fieldStatus.email && <CheckCircle2 size={13} color="#10b981" />}</label>
                            <input style={inputStyle} value={user?.email || ''} disabled placeholder="your@email.com" />
                        </div>

                        <div>
                            <label style={labelStyle}>
                                Phone Number <span style={{ color: '#ef4444', fontSize: 11 }}>* OTP required</span>
                                {fieldStatus.phone_verified && <CheckCircle2 size={13} color="#10b981" />}
                            </label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    style={{ ...inputStyle, flex: 1 }}
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    disabled={fieldStatus.phone_verified}
                                />
                                {!fieldStatus.phone_verified && (
                                    <button
                                        onClick={() => sendOtpMutation.mutate()}
                                        disabled={sendOtpMutation.isPending || form.phone.length < 10}
                                        style={{
                                            padding: '10px 18px', background: '#0d59f2', color: 'white', border: 'none',
                                            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                                            opacity: form.phone.length < 10 ? 0.5 : 1,
                                        }}
                                    >
                                        {sendOtpMutation.isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : otpSent ? 'Resend OTP' : 'Send OTP'}
                                    </button>
                                )}
                            </div>

                            {otpSent && !fieldStatus.phone_verified && (
                                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                    <input
                                        style={{ ...inputStyle, flex: 1, letterSpacing: 6, textAlign: 'center', fontSize: 18, fontWeight: 700 }}
                                        value={otpCode}
                                        onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={() => verifyOtpMutation.mutate()}
                                        disabled={verifyOtpMutation.isPending || otpCode.length !== 6}
                                        style={{
                                            padding: '10px 18px', background: '#10b981', color: 'white', border: 'none',
                                            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                            opacity: otpCode.length !== 6 ? 0.5 : 1,
                                        }}
                                    >
                                        {verifyOtpMutation.isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <><ShieldCheck size={14} /> Verify</>}
                                    </button>
                                </div>
                            )}

                            {fieldStatus.phone_verified && (
                                <p style={{ color: '#10b981', fontSize: 12, margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <ShieldCheck size={13} /> Phone verified
                                </p>
                            )}
                        </div>

                        <div>
                            <label style={labelStyle}>Location</label>
                            <input style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Mumbai, India" />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                            <button className="btn-primary" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 1 — Resume */}
                {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FileText size={18} color="#0d59f2" /> Resume Upload
                            <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 500 }}>* Required</span>
                        </h2>

                        <div
                            onClick={() => document.getElementById('profile-resume-upload')?.click()}
                            style={{
                                border: `2px dashed ${fieldStatus.resume ? '#10b981' : '#1e2433'}`,
                                borderRadius: 14, padding: '48px 24px', textAlign: 'center',
                                cursor: 'pointer', background: '#0d1016', transition: 'all 0.2s',
                            }}
                        >
                            {resumeMutation.isPending ? (
                                <>
                                    <Loader2 size={40} color="#0d59f2" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                                    <p style={{ color: '#60a5fa', fontWeight: 500, margin: 0 }}>Uploading…</p>
                                </>
                            ) : fieldStatus.resume || resumeFile ? (
                                <>
                                    <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
                                    <p style={{ color: '#10b981', fontWeight: 500, margin: 0 }}>{resumeFile?.name || 'Resume uploaded'}</p>
                                    <p style={{ color: '#4b5563', fontSize: 13, margin: '4px 0 0' }}>Click to replace</p>
                                </>
                            ) : (
                                <>
                                    <UploadCloud size={40} color="#4b5563" style={{ margin: '0 auto 12px' }} />
                                    <p style={{ color: '#e2e8f0', fontWeight: 500, margin: 0 }}>Drop your resume here or click to browse</p>
                                    <p style={{ color: '#4b5563', fontSize: 13, margin: '6px 0 0' }}>PDF or DOC • Max 10MB</p>
                                </>
                            )}
                            <input id="profile-resume-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileInput} style={{ display: 'none' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <button className="btn-secondary" onClick={() => setStep(0)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ChevronLeft size={16} /> Back</button>
                            <button className="btn-primary" onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Next <ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}

                {/* Step 2 — Experience & Salary */}
                {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Briefcase size={18} color="#0d59f2" /> Experience & Salary
                        </h2>

                        <div>
                            <label style={labelStyle}>Professional Headline</label>
                            <input style={inputStyle} value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Senior Frontend Engineer" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={labelStyle}>
                                    Years of Experience <span style={{ color: '#ef4444' }}>*</span>
                                    {fieldStatus.years_of_experience && <CheckCircle2 size={13} color="#10b981" />}
                                </label>
                                <input type="number" min={0} max={50} style={inputStyle} value={form.years_of_experience}
                                    onChange={e => setForm({ ...form, years_of_experience: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Experience Level</label>
                                <select style={{ ...inputStyle, appearance: 'auto' as any }} value={form.experience_level}
                                    onChange={e => setForm({ ...form, experience_level: e.target.value })}>
                                    <option value="junior">Junior (0–2 yrs)</option>
                                    <option value="mid">Mid (3–5 yrs)</option>
                                    <option value="senior">Senior (6+ yrs)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={labelStyle}>
                                    <DollarSign size={13} /> Current Salary (₹/yr) <span style={{ color: '#ef4444' }}>*</span>
                                    {fieldStatus.current_salary && <CheckCircle2 size={13} color="#10b981" />}
                                </label>
                                <input type="number" style={inputStyle} value={form.current_salary}
                                    onChange={e => setForm({ ...form, current_salary: e.target.value })} placeholder="e.g. 1200000" />
                            </div>
                            <div>
                                <label style={labelStyle}>
                                    <DollarSign size={13} /> Expected Salary (₹/yr) <span style={{ color: '#ef4444' }}>*</span>
                                    {fieldStatus.expected_salary && <CheckCircle2 size={13} color="#10b981" />}
                                </label>
                                <input type="number" style={inputStyle} value={form.expected_salary}
                                    onChange={e => setForm({ ...form, expected_salary: e.target.value })} placeholder="e.g. 1800000" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <button className="btn-secondary" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ChevronLeft size={16} /> Back</button>
                            <button className="btn-primary" onClick={() => setStep(3)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Next <ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}

                {/* Step 3 — Review & Submit */}
                {step === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircle2 size={18} color="#10b981" /> Review & Complete
                        </h2>

                        <div style={{ background: '#0d1016', borderRadius: 12, padding: 20, border: '1px solid #1e2433' }}>
                            {Object.entries(fieldStatus).map(([key, done]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e2433' }}>
                                    <span style={{ fontSize: 13, color: '#94a3b8', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                                    {done ? (
                                        <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <CheckCircle2 size={13} /> Done
                                        </span>
                                    ) : (
                                        <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <X size={13} /> Missing
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <button className="btn-secondary" onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => saveMutation.mutate()}
                                disabled={saveMutation.isPending}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 28px', fontSize: 15 }}
                            >
                                {saveMutation.isPending ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <>Save & Continue <ChevronRight size={16} /></>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
