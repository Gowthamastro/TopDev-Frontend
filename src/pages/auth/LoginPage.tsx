import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
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
            setAuth({ id: res.data.user_id, email: data.email, fullName: res.data.full_name, role: res.data.role }, res.data.access_token, res.data.refresh_token);
            const role = res.data.role;
            navigate(role === 'admin' ? '/admin' : role === 'client' ? '/client' : '/candidate');
            toast.success(`Welcome back, ${res.data.full_name}!`);
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Login failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} className="animated-bg">
            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                        <Zap size={24} color="white" />
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }} className="gradient-text">TopDev</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: '6px 0 0', fontSize: 14 }}>Top Talent. Top Scores.</p>
                </div>

                <div className="card" style={{ padding: 32 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 24px' }}>Sign in to your account</h2>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Email</label>
                            <input {...register('email')} type="email" className="input-field" placeholder="you@company.com" autoComplete="email" />
                            {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.email.message}</p>}
                        </div>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input {...register('password')} type={showPwd ? 'text' : 'password'} className="input-field" placeholder="••••••••" style={{ paddingRight: 40 }} />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
                                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.password.message}</p>}
                        </div>
                        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px 20px' }}>
                            {isSubmitting ? 'Signing in...' : 'Sign in →'}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', margin: '20px 0 0', fontSize: 14, color: 'var(--color-text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)' }}>Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
