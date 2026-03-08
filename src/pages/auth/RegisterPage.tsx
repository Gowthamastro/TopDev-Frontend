import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Zap, Building2, User } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const schema = z.object({
    full_name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8, 'Min 8 characters'),
    role: z.enum(['client', 'candidate']),
    company_name: z.string().optional(),
}).refine(d => d.role !== 'client' || (d.company_name && d.company_name.length > 0), {
    message: 'Company name is required for clients',
    path: ['company_name'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { role: 'client' } });
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();
    const role = watch('role');

    const onSubmit = async (data: FormData) => {
        try {
            const res = await api.post('/api/v1/auth/register', data);
            setAuth({ id: res.data.user_id, email: data.email, fullName: res.data.full_name, role: res.data.role }, res.data.access_token, res.data.refresh_token);
            navigate(res.data.role === 'client' ? '/client' : '/candidate');
            toast.success('Account created! Welcome to TopDev 🚀');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} className="animated-bg">
            <div style={{ width: '100%', maxWidth: 460 }}>
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        <Zap size={24} color="white" />
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }} className="gradient-text">TopDev</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: '6px 0 0', fontSize: 14 }}>Create your account</p>
                </div>

                <div className="card" style={{ padding: 32 }}>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Role selector */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {(['client', 'candidate'] as const).map(r => (
                                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: `1px solid ${role === r ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 10, cursor: 'pointer', background: role === r ? 'rgba(99,102,241,0.08)' : 'var(--color-surface)' }}>
                                    <input type="radio" value={r} {...register('role')} style={{ display: 'none' }} />
                                    {r === 'client' ? <Building2 size={16} color={role === r ? '#818cf8' : '#64748b'} /> : <User size={16} color={role === r ? '#818cf8' : '#64748b'} />}
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: role === r ? '#818cf8' : 'var(--color-text)' }}>{r === 'client' ? 'Hiring Company' : 'Candidate'}</div>
                                        <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>{r === 'client' ? 'Find top talent' : 'Get hired'}</div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Full name</label>
                            <input {...register('full_name')} className="input-field" placeholder="Alex Johnson" />
                            {errors.full_name && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.full_name.message}</p>}
                        </div>

                        <div>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Email</label>
                            <input {...register('email')} type="email" className="input-field" placeholder="you@company.com" />
                            {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.email.message}</p>}
                        </div>

                        {role === 'client' && (
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Company name</label>
                                <input {...register('company_name')} className="input-field" placeholder="Acme Corp" />
                                {errors.company_name && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.company_name.message}</p>}
                            </div>
                        )}

                        <div>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>Password</label>
                            <input {...register('password')} type="password" className="input-field" placeholder="Min 8 characters" />
                            {errors.password && <p style={{ color: 'var(--color-danger)', fontSize: 12, margin: '4px 0 0' }}>{errors.password.message}</p>}
                        </div>

                        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}>
                            {isSubmitting ? 'Creating account...' : 'Create account →'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', margin: '20px 0 0', fontSize: 14, color: 'var(--color-text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
