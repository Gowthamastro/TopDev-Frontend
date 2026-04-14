import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { Zap, Building2, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

// Strict email: no numeric-only domains, 2+ char TLD required
const emailSchema = z.string()
    .email('Enter a valid email address')
    .refine(v => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v), 'Enter a valid email address')
    .refine(v => !/\d{2,}/.test(v.split('@')[1]?.split('.')[0] ?? ''), 'Please use a real email domain');

const schema = z.object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: emailSchema,
    password: z.string()
        .min(8, 'Minimum 8 characters')
        .regex(/[A-Z]/, 'Must include an uppercase letter')
        .regex(/[0-9]/, 'Must include a number'),
    role: z.enum(['client', 'candidate']),
    company_name: z.string().optional(),
}).refine(d => d.role !== 'client' || (d.company_name && d.company_name.length > 0), {
    message: 'Company name is required for clients',
    path: ['company_name'],
});

type FormData = z.infer<typeof schema>;

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (pwd.length >= 12) score++;
    if (score <= 1) return { score, label: 'Weak', color: 'var(--color-danger)' };
    if (score <= 2) return { score, label: 'Fair', color: 'var(--color-warning)' };
    if (score <= 3) return { score, label: 'Good', color: 'var(--color-text-muted)' };
    return { score, label: 'Strong', color: 'var(--color-text)' };
}

export default function RegisterPage() {
    const [searchParams] = useSearchParams();
    const initialRole = (searchParams.get('role') === 'client' || searchParams.get('role') === 'candidate') 
        ? searchParams.get('role') as 'client' | 'candidate' 
        : 'candidate';

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { role: initialRole }
    });
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();
    const role = watch('role');
    const pwd = watch('password') || '';
    const [showPwd, setShowPwd] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const strength = getPasswordStrength(pwd);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsGoogleLoading(true);
            try {
                const selectedRole = role || 'candidate';
                const res = await api.post('/api/v1/auth/google', {
                    access_token: tokenResponse.access_token,
                    role: selectedRole
                });
                
                setAuth(
                    { id: res.data.user_id, email: res.data.email, fullName: res.data.full_name, role: res.data.role, isProfileComplete: res.data.is_profile_complete ?? false },
                    res.data.access_token,
                    res.data.refresh_token
                );
                if (res.data.role === 'candidate') {
                    navigate('/complete-profile');
                } else {
                    navigate(res.data.role === 'admin' ? '/admin' : '/client');
                }
                toast.success('Google sign in successful! 🚀');
            } catch (err: any) {
                toast.error(err.response?.data?.detail || 'Google sign in failed');
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: () => {
            toast.error('Google sign in was cancelled or failed');
        }
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await api.post('/api/v1/auth/register', data);
            setAuth(
                { id: res.data.user_id, email: data.email, fullName: res.data.full_name, role: res.data.role, isProfileComplete: res.data.is_profile_complete ?? false },
                res.data.access_token,
                res.data.refresh_token
            );
            if (res.data.role === 'candidate') {
                navigate('/complete-profile');
            } else {
                navigate(res.data.role === 'client' ? '/client' : '/admin');
            }
            toast.success('Account created! Welcome to TopDev 🚀');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--color-bg)' }}>
            <div style={{ width: '100%', maxWidth: 460 }}>
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{
                        width: 52, height: 52, background: 'var(--color-primary)', borderRadius: 14,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                    }}>
                        <Zap size={26} color="var(--color-bg)" fill="var(--color-bg)" />
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>TopDev</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: '6px 0 0', fontSize: 14 }}>Create your account</p>
                </div>

                <div className="card" style={{ padding: 32, borderRadius: 4 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px', color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>Get started</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '0 0 24px' }}>Join the platform and connect with top opportunities</p>

                    {/* Google Sign-In */}
                    <button type="button" className="btn-google" style={{ marginBottom: 16 }} onClick={() => googleLogin()} disabled={isGoogleLoading}>
                        {isGoogleLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.208 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                                <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                            </svg>
                        )}
                        {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                    </button>

                    <div className="auth-divider">or register with email</div>

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                        {/* Role selector */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {(['candidate', 'client'] as const).map(r => (
                                <label key={r} style={{
                                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                                    border: `1px solid ${role === r ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                    borderRadius: 4, cursor: 'pointer',
                                    background: role === r ? 'var(--color-bg-tertiary)' : 'var(--color-bg)',
                                    transition: 'all 0.2s'
                                }}>
                                    <input type="radio" value={r} {...register('role')} style={{ display: 'none' }} />
                                    {r === 'client' ? <Building2 size={16} color={role === r ? 'var(--color-text)' : 'var(--color-text-subtle)'} /> : <User size={16} color={role === r ? 'var(--color-text)' : 'var(--color-text-subtle)'} />}
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: role === r ? 'var(--color-text)' : 'var(--color-text-muted)', fontFamily: "'Manrope', sans-serif" }}>
                                            {r === 'client' ? 'Hiring Company' : 'Candidate'}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>
                                            {r === 'client' ? 'Find top talent' : 'Get hired'}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', display: 'block', marginBottom: 6, fontFamily: "'Manrope', sans-serif" }}>Full name</label>
                            <input id="register-name" {...register('full_name')} className="input-field" placeholder="Alex Johnson" />
                            {errors.full_name && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.full_name.message}</p>}
                        </div>

                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', display: 'block', marginBottom: 6, fontFamily: "'Manrope', sans-serif" }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                                <input id="register-email" {...register('email')} type="email" className="input-field" placeholder="you@company.com" style={{ paddingLeft: 38 }} />
                            </div>
                            {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.email.message}</p>}
                        </div>

                        {role === 'client' && (
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', display: 'block', marginBottom: 6, fontFamily: "'Manrope', sans-serif" }}>Company name</label>
                                <input id="register-company" {...register('company_name')} className="input-field" placeholder="Acme Corp" />
                                {errors.company_name && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.company_name.message}</p>}
                            </div>
                        )}

                        <div>
                            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', display: 'block', marginBottom: 6, fontFamily: "'Manrope', sans-serif" }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                                <input
                                    id="register-password"
                                    {...register('password')}
                                    type={showPwd ? 'text' : 'password'}
                                    className="input-field"
                                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                                    style={{ paddingLeft: 38, paddingRight: 40 }}
                                />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer', padding: 0 }}>
                                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {pwd.length > 0 && (
                                <div style={{ marginTop: 8 }}>
                                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="pwd-strength-bar" style={{ flex: 1, width: '100%', background: i <= strength.score ? strength.color : 'var(--color-bg-tertiary)' }} />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 11, color: strength.color, margin: 0 }}>{strength.label} password</p>
                                </div>
                            )}
                            {errors.password && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.password.message}</p>}
                        </div>

                        <button
                            id="register-submit"
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4, fontSize: 15 }}
                        >
                            {isSubmitting ? 'Creating account...' : 'Create account →'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', margin: '20px 0 0', fontSize: 14, color: 'var(--color-text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--color-text)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
