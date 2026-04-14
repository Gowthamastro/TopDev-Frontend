import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle2, UploadCloud } from 'lucide-react';

const CodeSignupEditor = () => {
    const [role, setRole] = useState<'candidate' | 'client'>('candidate');
    const [isExpanded, setIsExpanded] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: 'your name ',
        email: 'your@email.com',
        password: '••••••••',
        phone: '+1 234 567 890',
        location: 'City, Country',
        currentSalary: '',
        expectedSalary: '',
        resume: null as File | null,
        // Client specific
        company: '',
        website: '',
        budget: '',
        jobRole: '',
    });

    const handleInteraction = () => {
        if (!isExpanded) setIsExpanded(true);
    };

    const handleInputChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!form.email || !form.password || !form.name) {
            toast.error('Please fill in the required fields (name, email, password)');
            return;
        }

        setIsSubmitting(true);
        try {
            // Unify all onboarding data into the primary registration call
            const registerData = {
                full_name: form.name,
                email: form.email,
                password: form.password,
                role: role,
                // Onboarding fields handled in one step
                company_name: role === 'client' ? (form.company || 'Workspace') : undefined,
                website: role === 'client' ? form.website : undefined,
                hiring_budget: role === 'client' ? (Number(form.budget) || 0) : undefined,
                phone: role === 'candidate' ? form.phone : undefined,
                location: form.location,
                current_salary: role === 'candidate' ? (Number(form.currentSalary) || 0) : undefined,
                expected_salary: role === 'candidate' ? (Number(form.expectedSalary) || 0) : undefined,
            };

            const res = await api.post('/api/v1/auth/register', registerData);
            
            setAuth(
                { id: res.data.user_id, email: form.email, fullName: res.data.full_name, role: res.data.role, isProfileComplete: true },
                res.data.access_token,
                res.data.refresh_token
            );

            // Only resume upload remains a separate step if file exists
            if (role === 'candidate' && form.resume) {
                const fd = new FormData();
                fd.append('file', form.resume);
                try {
                    await api.post('/api/v1/candidates/resume', fd);
                } catch (resumeErr) {
                    console.error("Resume upload failed but account was created", resumeErr);
                }
            }

            setIsSuccess(true);
            toast.success('Account created successfully! 🚀');
            setTimeout(() => {
                navigate(role === 'candidate' ? '/candidate' : '/client');
            }, 1500);
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStringField = (label: string, field: string, placeholder: string, type: string = 'text') => {
        const value = String((form as any)[field] || '');
        // Calculate width based on character count + a small buffer for the cursor
        const width = `${Math.max(value.length, placeholder.length)}ch`;

        return (
            <div key={field} style={{ 
                display: 'flex', 
                alignItems: 'baseline', 
                gap: 0, 
                whiteSpace: 'nowrap', 
                paddingLeft: 20,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
            }}>
                <span style={{ color: '#d4d4d4' }}>{label}</span>
                <span style={{ color: '#d4d4d4' }}>:</span>
                <span style={{ color: '#98c379', marginLeft: 8 }}>'</span>
                <input 
                    type={type}
                    value={(form as any)[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'transparent', border: 'none',
                        color: '#98c379', fontSize: 'inherit', fontFamily: 'inherit',
                        padding: 0, outline: 'none', 
                        width: width,
                        minWidth: '1ch'
                    }}
                />
                <span style={{ color: '#98c379' }}>'</span>
                <span style={{ color: '#d4d4d4' }}>,</span>
            </div>
        );
    };

    const renderNumberField = (label: string, field: string, placeholder: string) => {
        const value = String((form as any)[field] || '');
        const width = `${Math.max(value.length, placeholder.length)}ch`;

        return (
            <div key={field} style={{ 
                display: 'flex', 
                alignItems: 'baseline', 
                gap: 0, 
                whiteSpace: 'nowrap', 
                paddingLeft: 20,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
            }}>
                <span style={{ color: '#d4d4d4' }}>{label}</span>
                <span style={{ color: '#d4d4d4' }}>:</span>
                <input 
                    type="number"
                    value={(form as any)[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'transparent', border: 'none',
                        color: '#d19a66', fontSize: 'inherit', fontFamily: 'inherit',
                        padding: 0, outline: 'none', 
                        width: width,
                        minWidth: '1ch',
                        marginLeft: 8
                    }}
                />
                <span style={{ color: '#d4d4d4', marginLeft: 0 }}>,</span>
            </div>
        );
    };

    if (isSuccess) {
        return (
            <div className="lp-glass lp-editor-panel" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(var(--color-primary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={40} color="var(--color-primary)" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Compiling complete!</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>Your developer profile is ready. Redirecting...</p>
                <div className="lp-loader-bar"><div className="lp-loader-progress"></div></div>
            </div>
        );
    }

    return (
        <div className={`lp-glass lp-editor-panel ${isExpanded ? 'expanded' : ''}`} onClick={handleInteraction}>
            <div className="lp-editor-header">
                <div className="lp-editor-dots">
                    <span style={{ background: '#FF5F56' }}></span>
                    <span style={{ background: '#FFBD2E' }}></span>
                    <span style={{ background: '#27C93F' }}></span>
                </div>
                <div style={{ color: '#888', fontSize: 11, fontFamily: 'monospace' }}>topdev_match.ts</div>
                <div className="lp-editor-toggle">
                    <button className={role === 'candidate' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); setRole('candidate'); }}>I'm a Developer</button>
                    <button className={role === 'client' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); setRole('client'); }}>I'm Hiring</button>
                </div>
            </div>

            <div className="lp-editor-body">
                <div className="lp-code-line">
                    <span style={{ color: '#569cd6' }}>import</span> <span style={{ color: '#d4d4d4' }}>{'{'}</span> <span style={{ color: '#9cdcfe' }}>{role === 'candidate' ? 'Developer' : 'Recruiter'}</span> <span style={{ color: '#d4d4d4' }}>{'}'}</span> <span style={{ color: '#569cd6' }}>from</span> <span style={{ color: '#98c379' }}>'@topdev/network'</span><span style={{ color: '#d4d4d4' }}>;</span>
                </div>
                <br />
                <div className="lp-code-line">
                    <span style={{ color: '#569cd6' }}>const</span> <span style={{ color: '#9cdcfe' }}>{role === 'candidate' ? 'candidate' : 'recruiter'}</span> <span style={{ color: '#d4d4d4' }}>=</span> <span style={{ color: '#569cd6' }}>new</span> <span style={{ color: '#9cdcfe' }}>{role === 'candidate' ? 'Developer' : 'Recruiter'}</span><span style={{ color: '#d4d4d4' }}>(</span><span style={{ color: '#d4d4d4' }}>{'{'}</span>
                </div>
                
                {renderStringField(role === 'candidate' ? 'name' : 'company', role === 'candidate' ? 'name' : 'company', 'your name ')}
                {renderStringField('email', 'email', 'your@email.com', 'your@email.com')}
                {isExpanded && renderStringField('password', 'password', 'Password', 'password')}

                {isExpanded && role === 'candidate' && (
                    <>
                        {renderStringField('phone', 'phone', '+1 234 567 890')}
                        {renderStringField('location', 'location', 'City, Country')}
                        {renderNumberField('currentSalary', 'currentSalary', '100000')}
                        {renderNumberField('expectedSalary', 'expectedSalary', '150000')}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, paddingLeft: 20 }}>
                            <span style={{ color: '#d4d4d4' }}>resume</span>
                            <span style={{ color: '#d4d4d4' }}>:</span>
                            <div 
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                style={{ 
                                    background: '#333333', 
                                    padding: '4px 12px', 
                                    borderRadius: 6, 
                                    marginLeft: 12, 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    color: '#d4d4d4',
                                    fontSize: 13,
                                    border: '1px solid #444',
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span>
                                <span style={{ fontFamily: 'inherit' }}>{form.resume ? form.resume.name : 'upload_resume()'}</span>
                            </div>
                            <span style={{ color: '#d4d4d4', marginLeft: 4 }}>,</span>
                            <input type="file" ref={fileInputRef} onChange={(e) => setForm({...form, resume: e.target.files?.[0] || null})} style={{ display: 'none' }} />
                        </div>
                    </>
                )}

                {isExpanded && role === 'client' && (
                    <>
                        {renderStringField('website', 'website', 'https://topdev.io')}
                        {renderStringField('location', 'location', 'City, Country')}
                        {renderNumberField('budget', 'budget', '2400000')}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, paddingLeft: 20 }}>
                            <span style={{ color: '#d4d4d4' }}>description</span>
                            <span style={{ color: '#d4d4d4' }}>:</span>
                            <div 
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                style={{ 
                                    background: '#333333', 
                                    padding: '4px 12px', 
                                    borderRadius: 6, 
                                    marginLeft: 12, 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    color: '#d4d4d4',
                                    fontSize: 13,
                                    border: '1px solid #444',
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span>
                                <span style={{ fontFamily: 'inherit' }}>{form.resume ? form.resume.name : 'upload_jd()'}</span>
                            </div>
                            <span style={{ color: '#d4d4d4', marginLeft: 4 }}>,</span>
                            <input type="file" ref={fileInputRef} onChange={(e) => setForm({...form, resume: e.target.files?.[0] || null})} style={{ display: 'none' }} />
                        </div>
                    </>
                )}

                <div className="lp-code-line"><span style={{ color: '#d4d4d4' }}>{'}'}</span><span style={{ color: '#d4d4d4' }}>);</span></div>
            </div>

            <div className="lp-editor-bottom-bar" onClick={handleSubmit}>
                <div className="lp-submit-box">
                    <span style={{ color: '#569cd6' }}>await</span> <span style={{ color: '#9cdcfe' }}>topdev</span><span style={{ color: '#d4d4d4' }}>.</span><span style={{ color: '#dcdcaa' }}>submit</span><span style={{ color: '#d4d4d4' }}>(</span><span style={{ color: '#9cdcfe' }}>{role === 'candidate' ? 'candidate' : 'recruiter'}</span><span style={{ color: '#d4d4d4' }}>)</span><span style={{ color: '#d4d4d4' }}>;</span>
                    <span className="lp-editor-cursor"></span>
                </div>
            </div>
        </div>
    );
};

export default function LandingPage() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', position: 'relative', overflowX: 'hidden', fontFamily: "'Manrope', sans-serif" }}>
            <style>{`
                .lp-nav {
                    position: sticky; top: 0; z-index: 50;
                    background: var(--glass-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--glass-border);
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 14px 48px;
                }
                .lp-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
                .lp-logo-icon { width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .lp-logo-text { color: var(--color-text); font-size: 20px; font-weight: 800; letter-spacing: -0.5px; font-family: 'Manrope', sans-serif; }

                .lp-nav-links { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 4px; background: var(--color-bg-tertiary); padding: 6px 8px; border-radius: 999px; border: 1px solid var(--color-border-subtle); }
                .lp-nav-link { color: var(--color-text-muted); font-size: 14px; font-weight: 500; padding: 6px 16px; border-radius: 999px; text-decoration: none; transition: all 0.2s; font-family: 'Manrope', sans-serif; }
                .lp-nav-link:hover { color: var(--color-text); background: var(--color-bg-secondary); }
                .lp-nav-actions { display: flex; align-items: center; gap: 20px; }
                .lp-login { color: var(--color-text-muted); font-size: 14px; text-decoration: none; transition: color 0.2s; font-family: 'Manrope', sans-serif; }
                .lp-login:hover { color: var(--color-text); }
                .lp-btn-primary { background: var(--color-primary); border: none; color: var(--color-bg); font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 999px; text-decoration: none; transition: all 0.3s; display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; }
                .lp-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
                .lp-btn-secondary { background: var(--color-bg-secondary); border: 1px solid var(--color-border); color: var(--color-text); font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 999px; text-decoration: none; transition: all 0.2s; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; }
                .lp-btn-secondary:hover { background: var(--color-bg-tertiary); }

                .lp-theme-toggle {
                    background: none; border: none; cursor: pointer; padding: 8px; color: var(--color-text-muted);
                    display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s;
                }
                .lp-theme-toggle:hover { background: var(--color-bg-secondary); color: var(--color-text); }

                .lp-main { position: relative; z-index: 1; }
                .lp-section { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 48px; }

                /* Hero */
                .lp-hero { display: flex; align-items: center; gap: 64px; padding: 112px 48px 96px; max-width: 1200px; margin: 0 auto; }
                .lp-hero-copy { flex: 1; display: flex; flex-direction: column; gap: 28px; }
                .lp-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; border: 1px solid var(--color-border); background: var(--color-bg-secondary); width: fit-content; }
                .lp-badge-text { color: var(--color-text-muted); font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; font-family: 'Manrope', sans-serif; }
                .lp-h1 { font-size: clamp(52px, 6vw, 82px); font-weight: 900; line-height: 1.02; letter-spacing: -3px; margin: 0; color: var(--color-text); font-family: 'Manrope', sans-serif; }
                .lp-h1-dim { color: var(--color-text-subtle); }
                .lp-h1-grad { color: var(--color-text); }
                .lp-tagline { color: var(--color-text-muted); font-size: 18px; font-weight: 400; line-height: 1.7; max-width: 480px; margin: 0; }
                .lp-cta-row { display: flex; flex-wrap: wrap; gap: 16px; }
                .lp-btn-hero { font-size: 16px; padding: 16px 32px; }
                .lp-social-proof { display: flex; align-items: center; gap: 16px; }
                .lp-avatars { display: flex; }
                .lp-av { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; border: 2px solid var(--color-bg); margin-left: -8px; }
                .lp-av:first-child { margin-left: 0; }
                .lp-proof-text { color: var(--color-text-muted); font-size: 14px; }
                .lp-proof-text strong { color: var(--color-text); }

                /* Code Signup Editor */
                .lp-hero-card-wrap { flex-shrink: 0; width: 480px; position: relative; }
                .lp-glass { background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 8px; }
                
                .lp-editor-panel {
                    box-shadow: 0 24px 80px rgba(0,0,0,0.4);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    background: #1e1e1e; /* Dark IDE background */
                }
                .lp-editor-panel.expanded {
                    transform: scale(1.02);
                }
                
                .lp-editor-header {
                    padding: 12px 16px;
                    background: #252526;
                    border-bottom: 1px solid #333;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .lp-editor-dots { display: flex; gap: 6px; }
                .lp-editor-dots span { width: 10px; height: 10px; border-radius: 50%; }
                
                .lp-editor-toggle {
                    display: flex; background: #333; padding: 2px; border-radius: 6px; gap: 2px;
                }
                .lp-editor-toggle button {
                    border: none; background: none; color: #888; font-size: 11px; font-weight: 600;
                    padding: 4px 10px; border-radius: 4px; cursor: pointer; transition: all 0.2s;
                }
                .lp-editor-toggle button.active {
                    background: #555; color: #fff;
                }

                .lp-editor-body {
                    padding: 24px;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    font-size: 14px;
                    line-height: 1.8;
                    cursor: text;
                    background: #1e1e1e;
                }
                .lp-code-line { color: #ABB2BF; }
                .lp-editor-input::placeholder { color: #444; }

                .lp-editor-bottom-bar {
                    padding: 16px 20px;
                    background: #1e1e1e;
                    border-top: 1px solid #333;
                    cursor: pointer;
                }
                .lp-submit-box {
                    background: #252d38;
                    border: 1px solid #3d4a5c;
                    border-radius: 6px;
                    padding: 10px 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    font-size: 14px;
                }
                .lp-editor-cursor {
                    display: inline-block; width: 10px; height: 18px; 
                    background: #569cd6; margin-left: 2px;
                    animation: blink 1 step-end infinite;
                }
                @keyframes blink { 50% { opacity: 0; } }

                .lp-editor-actions {
                    padding: 24px;
                    border-top: 1px solid #333;
                    background: #252526;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .lp-btn-full { width: 100%; justify-content: center; }
                .lp-btn-simple {
                    background: none; border: none; color: #888; font-size: 12px; cursor: pointer;
                    text-decoration: underline; transition: color 0.2s;
                }
                .lp-btn-simple:hover { color: #fff; }

                .lp-loader-bar { width: 100%; height: 4px; background: #333; border-radius: 2px; margin-top: 20px; overflow: hidden; }
                .lp-loader-progress { height: 100%; background: var(--color-primary); width: 0; animation: progress 1.5s ease-in-out infinite; }
                @keyframes progress { 0% { width: 0; margin-left: 0; } 50% { width: 50%; margin-left: 25%; } 100% { width: 0; margin-left: 100%; } }

                /* Hide number input arrows */
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type=number] {
                  -moz-appearance: textfield;
                  appearance: textfield;
                }

                @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
                .lp-card-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--color-border-subtle); }
                .lp-card-id { display: flex; align-items: center; gap: 16px; }
                .lp-card-name { color: var(--color-text); font-weight: 700; font-size: 18px; font-family: 'Manrope', sans-serif; }
                .lp-card-role { color: var(--color-text-muted); font-size: 12px; margin-top: 2px; }
                .lp-float-badge { position: absolute; bottom: -32px; left: -24px; padding: 16px; border-radius: 4px; display: flex; align-items: center; gap: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.08); animation: floatY 7s ease-in-out infinite 1s; background: var(--color-surface); }
                .lp-float-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--color-bg-secondary); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .lp-float-title { color: var(--color-text); font-size: 14px; font-weight: 700; font-family: 'Manrope', sans-serif; }
                .lp-float-sub { color: var(--color-text-muted); font-size: 12px; margin-top: 2px; }
                .lp-float-stat { position: absolute; top: -24px; right: -16px; padding: 12px 16px; border-radius: 4px; animation: floatY 5s ease-in-out infinite 0.5s; background: var(--color-primary); }
                .lp-stat-label { color: var(--color-text-muted); opacity: 0.6; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-family: 'Manrope', sans-serif; }
                .lp-stat-val { color: var(--color-bg); font-size: 22px; font-weight: 900; font-family: 'Manrope', sans-serif; }
                .lp-stat-unit { color: var(--color-bg); opacity: 0.7; font-size: 14px; font-weight: 600; }

                /* Trusted by strip */
                .lp-trusted { border-top: 1px solid var(--color-border-subtle); border-bottom: 1px solid var(--color-border-subtle); padding: 40px 48px; background: var(--color-bg-secondary); }
                .lp-trusted-inner { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 32px; }
                .lp-trusted-label { color: var(--color-text-subtle); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.25em; font-family: 'Manrope', sans-serif; }
                .lp-logos { display: flex; flex-wrap: wrap; justify-content: center; gap: 40px; opacity: 0.4; }
                .lp-logo-item { display: flex; align-items: center; gap: 8px; color: var(--color-text); font-size: 18px; font-weight: 700; font-family: 'Manrope', sans-serif; }

                /* Problem section */
                .lp-problem { padding: 112px 48px; max-width: 1200px; margin: 0 auto; }
                .lp-section-hd { text-align: center; margin-bottom: 64px; }
                .lp-h2 { font-size: clamp(36px, 4vw, 48px); font-weight: 900; letter-spacing: -1.5px; color: var(--color-text); margin: 0 0 20px; font-family: 'Manrope', sans-serif; }
                .lp-h2-purple { color: var(--color-text-muted); }
                .lp-subtext { color: var(--color-text-muted); font-size: 18px; font-weight: 400; line-height: 1.7; max-width: 640px; margin: 0 auto; }
                .lp-cards3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
                .lp-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px; padding: 32px; transition: all 0.3s; }
                .lp-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
                .lp-card-icon { width: 56px; height: 56px; background: var(--color-bg-secondary); border: 1px solid var(--color-border-subtle); border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
                .lp-card-h { color: var(--color-text); font-size: 20px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.3px; font-family: 'Manrope', sans-serif; }
                .lp-card-p { color: var(--color-text-muted); font-size: 15px; line-height: 1.65; margin: 0; font-weight: 400; }

                /* Process section */
                .lp-process { padding: 96px 48px; max-width: 1280px; margin: 0 auto; }
                .lp-h2-grad { color: var(--color-text); }
                .lp-process-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; position: relative; margin-top: 80px; }
                .lp-proc-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px; display: flex; flex-direction: column; position: relative; z-index: 1; overflow: hidden; transition: all 0.3s; }
                .lp-proc-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
                .lp-step-num { position: absolute; top: 0; left: 0; width: 56px; height: 56px; background: var(--color-primary); border-radius: 0 0 4px 0; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; color: var(--color-bg); z-index: 2; font-family: 'Manrope', sans-serif; }
                .lp-proc-body { padding: 80px 32px 32px; display: flex; flex-direction: column; flex: 1; }
                .lp-proc-h { color: var(--color-text); font-size: 20px; font-weight: 700; margin: 0 0 12px; font-family: 'Manrope', sans-serif; }
                .lp-proc-p { color: var(--color-text-muted); font-size: 15px; line-height: 1.65; font-weight: 400; margin: 0 0 32px; }
                .lp-proc-vis { margin-top: auto; border-radius: 4px; overflow: hidden; border: 1px solid var(--color-border); }
                .lp-upload-vis { background: var(--color-bg-secondary); border: 2px dashed var(--color-border); border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; text-align: center; }
                .lp-upload-vis:hover { background: var(--color-bg-tertiary); }
                .lp-upload-label { color: var(--color-text); font-size: 13px; font-weight: 700; margin-top: 12px; font-family: 'Manrope', sans-serif; }
                .lp-upload-sub { color: var(--color-text-subtle); font-size: 12px; margin-top: 4px; }
                .lp-code-vis { background: var(--color-bg-tertiary); }
                .lp-code-titlebar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid var(--color-border-subtle); background: var(--color-bg-secondary); }
                .lp-dots { display: flex; gap: 6px; }
                .lp-dot { width: 10px; height: 10px; border-radius: 50%; }
                .lp-code-filename { color: var(--color-text-muted); font-size: 11px; font-family: monospace; flex: 1; text-align: center; }
                .lp-code-body { padding: 16px; font-family: monospace; color: var(--color-text); font-size: 11px; line-height: 1.7; white-space: pre; overflow: hidden; }
                .lp-result-vis { background: var(--color-bg-secondary); padding: 20px; }
                .lp-mini-profile { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
                .lp-mini-av { width: 36px; height: 36px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--color-bg); font-size: 13px; flex-shrink: 0; }
                .lp-mini-name { color: var(--color-text); font-size: 14px; font-weight: 700; font-family: 'Manrope', sans-serif; }
                .lp-mini-role { color: var(--color-text-muted); font-size: 11px; margin-top: 2px; }
                .lp-mini-badge { margin-left: auto; padding: 2px 8px; border-radius: 9999px; background: var(--color-bg-tertiary); color: var(--color-text); font-size: 10px; font-weight: 700; border: 1px solid var(--color-border-subtle); text-transform: uppercase; font-family: 'Manrope', sans-serif; }
                .lp-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
                .lp-feature { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--color-text-muted); }

                /* Pricing section */
                .lp-pricing { padding: 96px 48px; max-width: 1200px; margin: 0 auto; }
                .lp-plans { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; align-items: end; margin-top: 64px; max-width: 800px; margin-left: auto; margin-right: auto; }
                .lp-plan { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px; padding: 32px; display: flex; flex-direction: column; height: 510px; transition: all 0.3s; }
                .lp-plan:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
                .lp-plan-featured { border-color: var(--color-primary) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.08); height: 560px; transform: translateY(-16px); position: relative; }
                .lp-popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--color-primary); color: var(--color-bg); font-size: 10px; font-weight: 900; padding: 6px 20px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.15em; white-space: nowrap; font-family: 'Manrope', sans-serif; }
                .lp-plan-name { color: var(--color-text); font-size: 20px; font-weight: 700; margin: 0 0 8px; font-family: 'Manrope', sans-serif; }
                .lp-plan-featured .lp-plan-name { font-size: 24px; font-weight: 900; margin-top: 16px; }
                .lp-plan-desc { color: var(--color-text-muted); font-size: 14px; line-height: 1.6; margin: 0 0 32px; }
                .lp-plan-featured .lp-plan-desc { color: var(--color-text); }
                .lp-price { font-size: 48px; font-weight: 900; color: var(--color-text); font-family: 'Manrope', sans-serif; }
                .lp-price-unit { font-size: 14px; font-weight: 500; color: var(--color-text-muted); margin-left: 8px; }
                .lp-price-mb { margin-bottom: 32px; }
                .lp-plan-featured .lp-feature { color: var(--color-text); font-weight: 500; }
                .lp-plan-btn { margin-top: 32px; border-radius: 999px; height: 48px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-text); font-family: 'Manrope', sans-serif; }
                .lp-plan-btn:hover { background: var(--color-bg-secondary); }
                .lp-plan-btn-primary { height: 56px; background: var(--color-primary); border: none; color: var(--color-bg); font-weight: 700; font-size: 14px; }
                .lp-plan-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

                /* CTA */
                .lp-cta-wrap { max-width: 1000px; margin: 0 auto; padding: 0 48px 128px; }
                .lp-cta-box { background: var(--color-primary); border-radius: 4px; padding: 64px; display: flex; align-items: center; justify-content: space-between; gap: 32px; position: relative; overflow: hidden; }
                .lp-cta-copy { position: relative; z-index: 1; }
                .lp-cta-h { color: var(--color-bg); font-size: clamp(24px, 3vw, 36px); font-weight: 900; margin: 0 0 12px; font-family: 'Manrope', sans-serif; }
                .lp-cta-sub { color: var(--color-bg); opacity: 0.6; font-size: 18px; margin: 0; }
                .lp-cta-action { position: relative; z-index: 1; flex-shrink: 0; }
                .lp-btn-white { display: inline-flex; align-items: center; gap: 8px; padding: 16px 32px; border-radius: 999px; background: var(--color-bg); color: var(--color-text); font-size: 14px; font-weight: 900; text-decoration: none; white-space: nowrap; transition: all 0.2s; font-family: 'Manrope', sans-serif; }
                .lp-btn-white:hover { opacity: 0.9; transform: translateY(-1px); }

                /* Footer */
                .lp-footer { border-top: 1px solid var(--color-border-subtle); background: var(--color-bg-secondary); padding: 64px 48px 32px; }
                .lp-footer-inner { max-width: 1200px; margin: 0 auto; }
                .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 64px; }
                .lp-footer-brand p { color: var(--color-text-muted); font-size: 15px; line-height: 1.6; max-width: 280px; margin: 20px 0 0; }
                .lp-footer-col-h { color: var(--color-text); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; font-family: 'Manrope', sans-serif; }
                .lp-footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
                .lp-footer-links a { color: var(--color-text-muted); font-size: 14px; text-decoration: none; transition: color 0.2s; }
                .lp-footer-links a:hover { color: var(--color-text); }
                .lp-footer-bottom { border-top: 1px solid var(--color-border-subtle); padding-top: 32px; display: flex; align-items: center; justify-content: space-between; }
                .lp-copyright { color: var(--color-text-subtle); font-size: 14px; }
                .lp-social { display: flex; align-items: center; gap: 20px; }
                .lp-social a { color: var(--color-text-subtle); transition: color 0.2s; text-decoration: none; }
                .lp-social a:hover { color: var(--color-text); }

                @media (max-width: 1024px) {
                    .lp-hero { flex-direction: column; padding: 80px 24px 64px; }
                    .lp-hero-card-wrap { width: 100%; max-width: 420px; }
                    .lp-cards3, .lp-process-cards, .lp-plans { grid-template-columns: 1fr; }
                    .lp-plan-featured { transform: none; height: auto; }
                    .lp-footer-grid { grid-template-columns: 1fr 1fr; }
                    .lp-nav { padding: 14px 24px; }
                    .lp-nav-links { display: none; }
                    .lp-cta-box { flex-direction: column; text-align: center; }
                }
            `}</style>

            {/* ── NAVBAR ── */}
            <header className="lp-nav">
                <Link to="/" className="lp-logo">
                    <div className="lp-logo-icon">
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-bg)', fontSize: 18, lineHeight: 1 }}>bolt</span>
                    </div>
                    <span className="lp-logo-text">TopDev</span>
                </Link>
                <nav className="lp-nav-links">
                    <a href="#vision" className="lp-nav-link">Vision</a>
                </nav>
                <div className="lp-nav-actions">
                    <button className="lp-theme-toggle" onClick={toggleTheme}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                            {theme === 'light' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>
                    <Link to="/login" className="lp-login">Login</Link>
                </div>
            </header>

            <main className="lp-main">
                {/* ── HERO ── */}
                <section className="lp-hero">
                    <div className="lp-hero-copy">
                        <div className="lp-badge">
                            <span className="material-symbols-outlined" style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>how_to_reg</span>
                            <span className="lp-badge-text">Structured Candidate Data</span>
                        </div>
                        <h1 className="lp-h1">
                            Hire Faster<br />
                            With Structured<br />
                            <span className="lp-h1-grad">Candidate Data</span>
                        </h1>
                        <p className="lp-tagline">
                            Collect complete candidate profiles, post jobs, and manage applicants — all in one simple platform.
                        </p>
                        <div className="lp-cta-row">
                            <a href="#pricing" className="lp-btn-primary lp-btn-hero">View Pricing</a>
                        </div>
                        <div className="lp-social-proof">
                            <div className="lp-avatars">
                                {[['AC', 'var(--color-primary)'], ['EL', 'var(--color-text-muted)'], ['RK', 'var(--color-text-subtle)']].map(([l, c], i) => (
                                    <div key={i} className="lp-av" style={{ background: c, color: 'var(--color-bg)', zIndex: 3 - i }}>
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <span className="lp-proof-text">Trusted by <strong>500+</strong> tech teams globally</span>
                        </div>
                    </div>

                    <div className="lp-hero-card-wrap">
                        <div className="lp-badge" style={{ margin: '0 auto 16px', display: 'flex' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 16 }}>bolt</span>
                            <span className="lp-badge-text" style={{ color: 'var(--color-primary)' }}>Complete profile in 1-step</span>
                        </div>
                        <CodeSignupEditor />
                    </div>
                </section>

                {/* ── TRUSTED BY ── */}
                <div className="lp-trusted">
                    <div className="lp-trusted-inner">
                        <p className="lp-trusted-label">Trusted by 500+ tech teams</p>
                        <div className="lp-logos">
                            {[['layers', 'ACME Corp'], ['rocket_launch', 'NovaTech'], ['all_inclusive', 'Quantum'], ['bolt', 'Zenith'], ['language', 'Global.io']].map(([icon, name]) => (
                                <div key={name} className="lp-logo-item">
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                {/* ── PRICING ── */}
                <section id="pricing" className="lp-pricing">
                    <div className="lp-section-hd">
                        <h2 className="lp-h2">Simple, Transparent<br /><span style={{ color: 'var(--color-text-subtle)' }}>Pricing</span></h2>
                        <p className="lp-subtext" style={{ marginTop: 24 }}>No subscriptions, no hidden fees. Pay only for results.</p>
                    </div>
                    <div className="lp-plans">
                        {/* 15% Per Hire */}
                        <div className="lp-plan lp-plan-featured">
                            <div className="lp-popular-badge">Standard</div>
                            <div><p className="lp-plan-name">Pay Per Hire</p><p className="lp-plan-desc">Only pay when you make a successful hire. No upfront costs, no monthly commitments.</p></div>
                            <div className="lp-price-mb">
                                <span className="lp-price">15</span><span className="lp-price-unit" style={{ fontSize: 24, fontWeight: 700 }}>%</span>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 8 }}>of first-year salary, per successful hire</div>
                            </div>
                            <ul className="lp-features">
                                {['Post unlimited jobs', 'View full candidate profiles', 'Clean applicant management', 'Email support'].map(feature => (
                                    <li key={feature} className="lp-feature">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary)', fontSize: 20, flexShrink: 0 }}>check_circle</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Custom / Contact Us */}
                        <div className="lp-plan">
                            <div><p className="lp-plan-name">Custom Pricing</p><p className="lp-plan-desc">Have specific requirements or hiring at scale? We'll build a plan around your needs.</p></div>
                            <div className="lp-price-mb">
                                <span className="lp-price" style={{ fontSize: 36 }}>Contact Us</span>
                                <div style={{ color: 'var(--color-text-subtle)', fontSize: 13, marginTop: 8 }}>Tailored pricing for your organization</div>
                            </div>
                            <ul className="lp-features">
                                {['Volume hiring discounts', 'Dedicated account manager', 'SLA & priority support', 'Custom contract & invoicing'].map(feature => (
                                    <li key={feature} className="lp-feature">
                                        <span className="material-symbols-outlined" style={{ color: 'var(--color-text-subtle)', fontSize: 18, flexShrink: 0 }}>check</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── COMING SOON — PHASE 2 ── */}
                <section id="vision" className="lp-process" style={{ padding: '112px 48px', position: 'relative' }}>
                    <div className="lp-section-hd" style={{ marginBottom: 64 }}>
                        <div className="lp-badge" style={{ margin: '0 auto 24px', background: 'rgba(var(--color-primary-rgb), 0.12)', border: '1px solid rgba(var(--color-primary-rgb), 0.25)' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 14 }}>rocket_launch</span>
                            <span className="lp-badge-text" style={{ color: 'var(--color-primary)' }}>Coming Soon — Phase 2</span>
                        </div>
                        <h2 className="lp-h2">The Future of Candidate <span style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-text-subtle))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Assessment</span></h2>
                        <p className="lp-subtext" style={{ marginTop: 24 }}>Phase 2 transforms TopDev into an intelligent hiring engine — going beyond profiles to give you verified skill scores and deep candidate insights before the first interview.</p>
                    </div>

                    <div className="lp-cards3">
                        {[
                            {
                                icon: 'psychology',
                                title: 'Candidate Skill Assessments',
                                desc: 'Auto-generated, role-specific technical assessments that evaluate candidates on the skills that actually matter — directly within the platform.',
                                tag: 'Phase 2'
                            },
                            {
                                icon: 'insights',
                                title: 'Deep Performance Insights',
                                desc: 'Go beyond resumes. Get structured, data-driven performance breakdowns for every candidate — skill coverage and response quality.',
                                tag: 'Phase 2'
                            },
                            {
                                icon: 'auto_awesome',
                                title: 'AI-Powered Smart Shortlisting',
                                desc: 'Let AI rank your applicants against your specific job requirements, so your team spends time only on the candidates who are truly ready.',
                                tag: 'Phase 2'
                            },
                        ].map(({ icon, title, desc, tag }) => (
                            <div key={title} className="lp-card" style={{ borderStyle: 'dashed', borderColor: 'rgba(var(--color-primary-rgb), 0.2)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 12, right: 12, padding: '3px 10px', borderRadius: 999, background: 'rgba(var(--color-primary-rgb), 0.12)', color: 'var(--color-primary)', fontSize: 10, fontWeight: 700, border: '1px solid rgba(var(--color-primary-rgb), 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{tag}</div>
                                <div className="lp-card-icon" style={{ background: 'rgba(var(--color-primary-rgb), 0.06)', border: '1px solid rgba(var(--color-primary-rgb), 0.15)' }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 26 }}>{icon}</span>
                                </div>
                                <h3 className="lp-card-h" style={{ color: 'var(--color-text)' }}>{title}</h3>
                                <p className="lp-card-p">{desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 80, padding: '40px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(var(--color-primary-rgb),0.1),rgba(var(--color-primary-rgb),0.05))', border: '1px solid rgba(var(--color-primary-rgb),0.3)', textAlign: 'center', maxWidth: 800, margin: '80px auto 0' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 32, display: 'block', marginBottom: 16 }}>notifications_active</span>
                        <h3 style={{ color: 'white', fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>Be First in Line for Phase 2</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 16, lineHeight: 1.7, margin: '0 0 32px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>Phase 2 is actively in development. Sign up today and get early access to assessments and AI matchmaking the moment they launch.</p>
                        <Link to="/" className="lp-btn-primary" style={{ display: 'inline-flex', padding: '16px 40px' }}>
                            Join the Waitlist (Sign up above)
                        </Link>
                    </div>
                </section>


            </main>

            {/* ── FOOTER ── */}
            <footer className="lp-footer">
                <div className="lp-footer-inner">
                    <div className="lp-footer-grid">
                        <div className="lp-footer-brand">
                            <div className="lp-logo">
                                <div className="lp-logo-icon">
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-bg)', fontSize: 18, lineHeight: 1 }}>bolt</span>
                                </div>
                                <span className="lp-logo-text">TopDev</span>
                            </div>
                            <p>The efficient platform connecting the world's best engineers with top tech companies through structured data.</p>
                        </div>
                        <div>
                            <div className="lp-footer-col-h">Product</div>
                            <ul className="lp-footer-links">
                                {[
                                    { name: 'For Recruiters', link: '#features' },
                                    { name: 'For Candidates', link: '#features' },
                                    { name: 'How It Works', link: '#how-it-works' },
                                    { name: 'Pricing', link: '#pricing' },
                                    { name: 'Roadmap', link: '#roadmap' }
                                ].map(l => <li key={l.name}><a href={l.link}>{l.name}</a></li>)}
                            </ul>
                        </div>
                        <div>
                            <div className="lp-footer-col-h">Company</div>
                            <ul className="lp-footer-links">
                                {['About Us', 'Blog', 'Careers', 'Press Kit', 'Contact'].map(l => <li key={l}><a href="#">{l}</a></li>)}
                            </ul>
                        </div>
                        <div>
                            <div className="lp-footer-col-h">Legal</div>
                            <ul className="lp-footer-links">
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map(l => <li key={l}><a href="#">{l}</a></li>)}
                            </ul>
                        </div>
                    </div>
                <div className="lp-footer-bottom">
                    <span className="lp-copyright">© 2026 TopDev. All rights reserved.</span>
                    <div className="lp-social">
                        <a href="#" aria-label="Twitter"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>share</span></a>
                        <a href="#" aria-label="LinkedIn"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>group</span></a>
                        <a href="#" aria-label="GitHub"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>code</span></a>
                    </div>
                </div>
                </div>
            </footer>
        </div>
    );
}
