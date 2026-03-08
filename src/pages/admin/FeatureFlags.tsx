import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../services/api';

export default function AdminFeatureFlags() {
    const qc = useQueryClient();
    const { data: flags } = useQuery({ queryKey: ['feature-flags'], queryFn: () => api.get('/api/v1/admin/feature-flags').then(r => r.data) });
    const mutation = useMutation({
        mutationFn: ({ name, is_enabled }: { name: string; is_enabled: boolean }) =>
            api.put(`/api/v1/admin/feature-flags/${name}`, { is_enabled }),
        onSuccess: (_, { name, is_enabled }) => { toast.success(`${name} ${is_enabled ? 'enabled' : 'disabled'}`); qc.invalidateQueries({ queryKey: ['feature-flags'] }); },
        onError: () => toast.error('Failed to update flag'),
    });

    return (
        <div style={{ padding: 32, maxWidth: 700 }} className="animate-fadeInUp">
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Feature Flags</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: 14 }}>Enable or disable platform features without code deployments.</p>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden' }}>
                {(flags || []).map((flag: any, i: number) => (
                    <div key={flag.flag_name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: i < flags.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{flag.flag_name.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</div>
                            {flag.description && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{flag.description}</div>}
                        </div>
                        <button
                            onClick={() => mutation.mutate({ name: flag.flag_name, is_enabled: !flag.is_enabled })}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: flag.is_enabled ? '#10b981' : 'var(--color-text-subtle)', transition: 'color 0.2s' }}
                            disabled={mutation.isPending}
                        >
                            {flag.is_enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
