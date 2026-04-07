import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Zap, Mail, Lock } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

// Block clearly fake email patterns: TLD must be 2+ real letters only
const emailSchema = z.string()
    .email('Enter a valid email address')
    .refine(v => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v), 'Enter a valid email address')
    .refine(v => !/\d{2,}/.test(v.split('@')[1]?.split('.')[0] ?? ''), 'Please use a real email domain');

const schema = z.object({
    email: emailSchema,
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();
    const [showPwd, setShowPwd] = useState(false);

    const onSubmit = async (data: FormData) => {
        try {
            const res = await api.post('/api/v1/auth/login', data);
            setAuth(
                { id: res.data.user_id, email: data.email, fullName: res.data.full_name, role: res.data.role },
                res.data.access_token,
                res.data.refresh_token
            );
            const role = res.data.role;
            navigate(role === 'admin' ? '/admin' : role === 'client' ? '/client' : '/candidate');
            toast.success(`Welcome back, ${res.data.full_name}!`);
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Invalid email or password');
        }
    };

    return (
        <div
            className="animated-bg"
            style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 52, height: 52,
                        background: 'linear-gradient(135deg, #0d59f2, #6366f1)',
                        borderRadius: 14,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 16,
                        boxShadow: '0 0 24px rgba(13, 89, 242, 0.3)'
                    }}>
                        <Zap size={26} color="white" fill="white" />
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }} className="gradient-text">TopDev</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: '6px 0 0', fontSize: 14 }}>Top Talent. Top Scores.</p>
                </div>

                <div className="card" style={{ padding: 32 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px', color: '#f1f5f9' }}>Sign in to your account</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '0 0 24px' }}>Enter your credentials to continue</p>

                    {/* Google Sign-In */}
                    <button
                        type="button"
                        className="btn-google"
                        style={{ marginBottom: 16 }}
                        onClick={() => toast('Google Sign-In coming soon! Use email & password for now.', { icon: '🔔' })}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.208 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>

                    <div className="auth-divider">or continue with email</div>

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                                <input
                                    {...register('email')}
                                    type="email"
                                    id="login-email"
                                    className="input-field"
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                    style={{ paddingLeft: 38 }}
                                />
                            </div>
                            {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.email.message}</p>}
                        </div>

                        <div>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                                <input
                                    {...register('password')}
                                    type={showPwd ? 'text' : 'password'}
                                    id="login-password"
                                    className="input-field"
                                    placeholder="••••••••"
                                    style={{ paddingLeft: 38, paddingRight: 40 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}
                                >
                                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.password.message}</p>}
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                            style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '12px 20px', fontSize: 15 }}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in →'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', margin: '20px 0 0', fontSize: 14, color: 'var(--color-text-muted)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#60a5fa', fontWeight: 500, textDecoration: 'none' }}>Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
