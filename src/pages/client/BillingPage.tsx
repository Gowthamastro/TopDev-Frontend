import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CreditCard, Zap, TrendingUp, Building2, Check } from 'lucide-react';
import api from '../../services/api';

const PLANS = [
    { key: 'starter', name: 'Starter', price: '$49/mo', roles: '5 roles/month', icon: Zap, color: '#6366f1', features: ['AI-generated assessments', 'Candidate ranking', 'Email notifications', 'Score breakdown'] },
    { key: 'growth', name: 'Growth', price: '$149/mo', roles: '20 roles/month', icon: TrendingUp, color: '#8b5cf6', features: ['Everything in Starter', 'Priority AI scoring', 'Advanced analytics', 'Custom email templates', 'Webhook notifications'] },
    { key: 'enterprise', name: 'Enterprise', price: 'Custom', roles: 'Unlimited roles', icon: Building2, color: '#06b6d4', features: ['Everything in Growth', 'Dedicated support', 'Custom AI prompts', 'SSO integration', 'SLA guarantee'] },
];

export default function BillingPage() {
    const { data: sub } = useQuery({ queryKey: ['subscription'], queryFn: () => api.get('/api/v1/payments/subscription').then(r => r.data) });
    const qc = useQueryClient();
    const checkout = useMutation({
        mutationFn: (plan: string) => api.post('/api/v1/payments/checkout', { plan, success_url: `${window.location.origin}/client/billing?success=1`, cancel_url: `${window.location.origin}/client/billing` }).then(r => r.data),
        onSuccess: (data) => { window.location.href = data.checkout_url; },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to create checkout'),
    });

    const currentPlan = sub?.plan || 'free';

    return (
        <div style={{ padding: 32, maxWidth: 960 }} className="animate-fadeInUp">
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Billing & Subscription</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 28, fontSize: 14 }}>
                Current plan: <span style={{ color: '#818cf8', fontWeight: 600, textTransform: 'capitalize' }}>{currentPlan}</span>
                {sub?.roles_used !== undefined && ` · ${sub.roles_used} roles used this month`}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                {PLANS.map(plan => {
                    const active = currentPlan === plan.key;
                    return (
                        <div key={plan.key} className="card" style={{ border: active ? `2px solid ${plan.color}` : '1px solid var(--color-border)', position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {active && <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, background: plan.color, color: 'white', padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>Current</div>}
                            <div style={{ width: 40, height: 40, background: `${plan.color}18`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <plan.icon size={18} color={plan.color} />
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 700 }}>{plan.name}</div>
                                <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 2px' }}>{plan.price}</div>
                                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{plan.roles}</div>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                                {plan.features.map(f => (
                                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>
                                        <Check size={14} color="#10b981" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={active ? 'btn-secondary' : 'btn-primary'}
                                disabled={active || checkout.isPending}
                                onClick={() => checkout.mutate(plan.key)}
                                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                            >
                                {active ? 'Current plan' : plan.key === 'enterprise' ? 'Contact sales' : `Upgrade to ${plan.name}`}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
