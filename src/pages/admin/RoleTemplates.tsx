import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminRoleTemplates() {
    const qc = useQueryClient();
    const { data: templates } = useQuery({ queryKey: ['role-templates'], queryFn: () => api.get('/api/v1/admin/role-templates').then(r => r.data) });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', mcq_count: '10', coding_count: '2', scenario_count: '3', time_limit_minutes: '90', has_coding_round: true, difficulty: 'intermediate' });

    const createMutation = useMutation({
        mutationFn: (data: any) => api.post('/api/v1/admin/role-templates', data),
        onSuccess: () => { toast.success('Template created!'); qc.invalidateQueries({ queryKey: ['role-templates'] }); setShowForm(false); },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed'),
    });
    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/api/v1/admin/role-templates/${id}`),
        onSuccess: () => { toast.success('Template deleted'); qc.invalidateQueries({ queryKey: ['role-templates'] }); },
    });

    const handleCreate = () => createMutation.mutate({ ...form, mcq_count: +form.mcq_count, coding_count: +form.coding_count, scenario_count: +form.scenario_count, time_limit_minutes: +form.time_limit_minutes });

    return (
        <div style={{ padding: 32, maxWidth: 900 }} className="animate-fadeInUp">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Role Templates</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: 14 }}>Reusable test structure templates for common job roles.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={16} /> New Template</button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>Create Template</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        {[
                            ['name', 'Template Name', 'text'],
                            ['description', 'Description', 'text'],
                            ['mcq_count', 'MCQ Questions', 'number'],
                            ['coding_count', 'Coding Questions', 'number'],
                            ['scenario_count', 'Scenario Questions', 'number'],
                            ['time_limit_minutes', 'Time Limit (mins)', 'number'],
                        ].map(([key, label, type]) => (
                            <div key={key}>
                                <label style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>{label}</label>
                                <input type={type} value={(form as any)[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} className="input-field" />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <select value={form.difficulty} onChange={e => setForm(prev => ({ ...prev, difficulty: e.target.value }))} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '10px 14px', color: 'var(--color-text)', fontSize: 14 }}>
                            <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
                        </select>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.has_coding_round} onChange={e => setForm(prev => ({ ...prev, has_coding_round: e.target.checked }))} /> Coding Round
                        </label>
                        <button className="btn-primary" onClick={handleCreate} disabled={createMutation.isPending}>Create</button>
                        <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
                {(templates || []).map((t: any) => (
                    <div key={t.id} className="card" style={{ position: 'relative' }}>
                        <button onClick={() => deleteMutation.mutate(t.id)} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer', padding: 4 }}>
                            <Trash2 size={14} />
                        </button>
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{t.name}</div>
                        {t.description && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>{t.description}</div>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                            <span style={{ padding: '3px 8px', background: 'rgba(99,102,241,0.08)', borderRadius: 4, color: '#818cf8' }}>{t.mcq_count} MCQ</span>
                            <span style={{ padding: '3px 8px', background: 'rgba(139,92,246,0.08)', borderRadius: 4, color: '#a78bfa' }}>{t.coding_count} Coding</span>
                            <span style={{ padding: '3px 8px', background: 'rgba(6,182,212,0.08)', borderRadius: 4, color: '#22d3ee' }}>{t.scenario_count} Scenario</span>
                            <span style={{ padding: '3px 8px', background: 'rgba(100,116,139,0.08)', borderRadius: 4 }}>{t.time_limit_minutes}m</span>
                            <span style={{ padding: '3px 8px', background: 'rgba(100,116,139,0.08)', borderRadius: 4, textTransform: 'capitalize' }}>{t.difficulty}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
