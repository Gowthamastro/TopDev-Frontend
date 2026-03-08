import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Save, Info } from 'lucide-react';
import api from '../../services/api';

const SETTING_CATEGORIES = ['general', 'testing', 'scoring', 'ai'];

export default function AdminSettings() {
    const qc = useQueryClient();
    const { data: settings } = useQuery({ queryKey: ['platform-settings'], queryFn: () => api.get('/api/v1/admin/settings').then(r => r.data) });
    const [edits, setEdits] = useState<Record<string, string>>({});

    const mutation = useMutation({
        mutationFn: ({ key, value }: { key: string; value: string }) => api.put(`/api/v1/admin/settings/${key}`, { value }),
        onSuccess: (_, { key }) => { toast.success(`Setting "${key}" saved`); qc.invalidateQueries({ queryKey: ['platform-settings'] }); },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Save failed'),
    });

    const grouped = SETTING_CATEGORIES.reduce((acc: Record<string, any[]>, cat) => {
        acc[cat] = (settings || []).filter((s: any) => s.category === cat);
        return acc;
    }, {});

    const getValue = (s: any) => edits[s.key] !== undefined ? edits[s.key] : s.value;

    return (
        <div style={{ padding: 32, maxWidth: 800 }} className="animate-fadeInUp">
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Platform Settings</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 28, fontSize: 14 }}>Manage all platform behavior without code changes.</p>

            {SETTING_CATEGORIES.map(cat => {
                const catSettings = grouped[cat] || [];
                if (!catSettings.length) return null;
                return (
                    <div key={cat} style={{ marginBottom: 28 }}>
                        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', margin: '0 0 12px', textTransform: 'capitalize', letterSpacing: '0.05em' }}>{cat === 'ai' ? 'AI Prompts' : cat}</h2>
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden' }}>
                            {catSettings.map((s: any, i: number) => (
                                <div key={s.key} style={{ padding: '16px 20px', borderBottom: i < catSettings.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</div>
                                                {s.description && (
                                                    <div title={s.description} style={{ color: 'var(--color-text-subtle)', cursor: 'help' }}><Info size={12} /></div>
                                                )}
                                            </div>
                                            {s.key.includes('prompt') ? (
                                                <textarea
                                                    value={getValue(s)}
                                                    onChange={e => setEdits(prev => ({ ...prev, [s.key]: e.target.value }))}
                                                    className="input-field"
                                                    rows={5}
                                                    placeholder="Leave blank to use system default"
                                                    style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, resize: 'vertical' }}
                                                />
                                            ) : (
                                                <input
                                                    value={getValue(s)}
                                                    onChange={e => setEdits(prev => ({ ...prev, [s.key]: e.target.value }))}
                                                    className="input-field"
                                                    style={{ maxWidth: 400 }}
                                                />
                                            )}
                                            {s.description && <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', margin: '6px 0 0' }}>{s.description}</p>}
                                        </div>
                                        <button
                                            className="btn-primary"
                                            style={{ padding: '8px 16px', fontSize: 12, flexShrink: 0, marginTop: 22 }}
                                            onClick={() => mutation.mutate({ key: s.key, value: getValue(s) })}
                                            disabled={mutation.isPending}
                                        >
                                            <Save size={12} /> Save
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
