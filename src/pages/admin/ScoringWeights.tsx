import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminScoringWeights() {
    const qc = useQueryClient();
    const { data: weights } = useQuery({ queryKey: ['scoring-weights'], queryFn: () => api.get('/api/v1/admin/scoring-weights').then(r => r.data) });
    const defaultWeights = weights?.[0];
    const [tech, setTech] = useState<string>('');
    const [coding, setCoding] = useState<string>('');
    const [ps, setPs] = useState<string>('');
    const [threshold, setThreshold] = useState<string>('');

    const current = {
        tech: tech !== '' ? parseFloat(tech) : (defaultWeights?.technical_weight * 100 || 40),
        coding: coding !== '' ? parseFloat(coding) : (defaultWeights?.coding_weight * 100 || 40),
        ps: ps !== '' ? parseFloat(ps) : (defaultWeights?.problem_solving_weight * 100 || 20),
        threshold: threshold !== '' ? parseFloat(threshold) : (defaultWeights?.qualification_threshold || 60),
    };
    const total = current.tech + current.coding + current.ps;

    const mutation = useMutation({
        mutationFn: (v: any) => api.put(`/api/v1/admin/scoring-weights/${defaultWeights?.id}`, v),
        onSuccess: () => { toast.success('Scoring weights updated!'); qc.invalidateQueries({ queryKey: ['scoring-weights'] }); },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed to save'),
    });

    const handleSave = () => {
        if (Math.abs(total - 100) > 0.5) { toast.error(`Weights must sum to 100. Currently: ${total.toFixed(1)}`); return; }
        mutation.mutate({ technical_weight: current.tech / 100, coding_weight: current.coding / 100, problem_solving_weight: current.ps / 100, qualification_threshold: current.threshold });
    };

    const segments = [
        { label: 'Technical Knowledge', key: 'tech', value: current.tech, color: '#6366f1', setter: setTech },
        { label: 'Coding Accuracy', key: 'coding', value: current.coding, color: '#8b5cf6', setter: setCoding },
        { label: 'Problem Solving', key: 'ps', value: current.ps, color: '#06b6d4', setter: setPs },
    ];

    return (
        <div style={{ padding: 32, maxWidth: 700 }} className="animate-fadeInUp">
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Scoring Weights</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 28, fontSize: 14 }}>Adjust scoring percentages without touching code. Weights must sum to 100%.</p>

            <div className="card" style={{ marginBottom: 20 }}>
                {/* Visual weight bar */}
                <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 12, marginBottom: 24 }}>
                    {segments.map(s => <div key={s.key} style={{ width: `${s.value}%`, background: s.color, transition: 'width 0.3s' }} />)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {segments.map(s => (
                        <div key={s.key}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <label style={{ fontSize: 14, fontWeight: 500 }}>{s.label}</label>
                                <span style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value.toFixed(0)}%</span>
                            </div>
                            <input
                                type="range" min={0} max={100} step={5} value={s.value}
                                onChange={e => s.setter(e.target.value)}
                                style={{ width: '100%', accentColor: s.color }}
                            />
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 20, padding: '12px 16px', background: Math.abs(total - 100) > 0.5 ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Total</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: Math.abs(total - 100) > 0.5 ? '#ef4444' : '#10b981' }}>{total.toFixed(0)}%</span>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>Qualification Threshold</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Candidates below this score are hidden from clients</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="number" min={0} max={100} value={current.threshold} onChange={e => setThreshold(e.target.value)}
                            style={{ width: 64, textAlign: 'center', fontSize: 20, fontWeight: 700, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, color: '#818cf8', padding: '8px 0', outline: 'none' }}
                        />
                        <span style={{ color: 'var(--color-text-muted)' }}>/100</span>
                    </div>
                </div>
            </div>

            <button className="btn-primary" onClick={handleSave} disabled={mutation.isPending} style={{ padding: '11px 28px' }}>
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
}
