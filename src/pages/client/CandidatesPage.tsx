import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, Download, UserPlus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

function ScoreBar({ value }: { value: number }) {
    return (
        <div className="score-bar-track" style={{ width: 80 }}>
            <div className="score-bar-fill" style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
    );
}

function Badge({ badge }: { badge: string }) {
    const cls: Record<string, string> = {
        elite: 'badge-elite', strong: 'badge-strong',
        qualified: 'badge-qualified', below_threshold: 'badge-below',
    };
    const labels: Record<string, string> = {
        elite: '⭐ Elite', strong: '🔹 Strong',
        qualified: '✅ Qualified', below_threshold: '—',
    };
    return (
        <span className={cls[badge] || 'badge-below'} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
            {labels[badge] || badge}
        </span>
    );
}

export default function ClientCandidatesPage() {
    const { jdId } = useParams<{ jdId: string }>();
    const [minScore, setMinScore] = useState('');
    const [selectedBadge, setSelectedBadge] = useState('');
    const [expanded, setExpanded] = useState<number | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['candidates', jdId, minScore, selectedBadge],
        queryFn: () => {
            const params = new URLSearchParams();
            if (minScore) params.append('min_score', minScore);
            if (selectedBadge) params.append('badge', selectedBadge);
            return api.get(`/api/v1/clients/jobs/${jdId}/candidates?${params}`).then(r => r.data);
        },
        enabled: !!jdId,
    });

    const handleDownloadResume = (url: string, name: string) => {
        if (!url) { toast.error('No resume available'); return; }
        const a = document.createElement('a');
        a.href = url; a.download = `${name}-resume.pdf`; a.click();
    };

    const { data: breakdown, refetch: fetchBreakdown } = useQuery({
        queryKey: ['breakdown', expanded],
        queryFn: () => expanded ? api.get(`/api/v1/clients/candidates/${expanded}/breakdown`).then(r => r.data) : null,
        enabled: !!expanded,
    });

    if (isLoading) return <div style={{ padding: 32, color: 'var(--color-text-muted)' }}>Loading candidates...</div>;

    return (
        <div style={{ padding: 32 }} className="animate-fadeInUp">

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Candidates — {data?.job_title}</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: 14 }}>
                        Only qualified candidates are shown. Ranked by score.
                    </p>
                </div>
                <Link to={`/client/jobs/${jdId}/invite`} className="btn-primary" style={{ textDecoration: 'none' }}>
                    <UserPlus size={15} /> Invite Candidates
                </Link>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 14px' }}>
                    <Filter size={14} color="var(--color-text-muted)" />
                    <input
                        type="number" value={minScore} onChange={e => setMinScore(e.target.value)}
                        placeholder="Min score" min={0} max={100}
                        style={{ background: 'none', border: 'none', color: 'var(--color-text)', outline: 'none', width: 80, fontSize: 13 }}
                    />
                </div>
                <select
                    value={selectedBadge} onChange={e => setSelectedBadge(e.target.value)}
                    style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 14px', color: 'var(--color-text)', fontSize: 13 }}
                >
                    <option value="">All badges</option>
                    <option value="elite">Elite</option>
                    <option value="strong">Strong</option>
                    <option value="qualified">Qualified</option>
                </select>
            </div>

            {/* Candidates table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Total Score</th>
                            <th>Technical</th>
                            <th>Coding</th>
                            <th>Problem Solving</th>
                            <th>Badge</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data?.candidates || []).map((c: any) => (
                            <>
                                <tr
                                    key={c.attempt_id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setExpanded(expanded === c.attempt_id ? null : c.attempt_id);
                                        if (expanded !== c.attempt_id) fetchBreakdown();
                                    }}
                                >
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                                                {c.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontWeight: 700, fontSize: 18, color: c.total_score >= 75 ? '#818cf8' : 'var(--color-text)' }}>
                                                {c.total_score?.toFixed(1)}
                                            </span>
                                            <ScoreBar value={c.total_score} />
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--color-text-muted)' }}>{c.technical_score?.toFixed(1)}</td>
                                    <td style={{ color: 'var(--color-text-muted)' }}>{c.coding_score?.toFixed(1)}</td>
                                    <td style={{ color: 'var(--color-text-muted)' }}>{c.problem_solving_score?.toFixed(1)}</td>
                                    <td><Badge badge={c.rating_badge} /></td>
                                    <td>
                                        <button
                                            className="btn-secondary"
                                            style={{ padding: '6px 12px', fontSize: 12 }}
                                            onClick={e => { e.stopPropagation(); handleDownloadResume(c.resume_url, c.name); }}
                                        >
                                            <Download size={12} /> Resume
                                        </button>
                                    </td>
                                </tr>
                                {expanded === c.attempt_id && breakdown && (
                                    <tr key={`${c.attempt_id}-breakdown`}>
                                        <td colSpan={7} style={{ background: 'rgba(99,102,241,0.04)', padding: '16px 20px' }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#818cf8', marginBottom: 10 }}>Score Breakdown</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
                                                {(breakdown.score_breakdown || []).map((q: any, qi: number) => (
                                                    <div key={qi} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'var(--color-card)', borderRadius: 8 }}>
                                                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', width: 80, flexShrink: 0 }}>{q.category}</div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                                <span style={{ fontSize: 12 }}>{q.feedback}</span>
                                                                <span style={{ fontSize: 12, fontWeight: 600, color: '#818cf8' }}>{q.score}/{q.max_score}</span>
                                                            </div>
                                                            <div className="score-bar-track">
                                                                <div className="score-bar-fill" style={{ width: `${(q.score / q.max_score) * 100}%` }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                        {(!data?.candidates || data.candidates.length === 0) && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-muted)' }}>
                                    No qualified candidates yet.{' '}
                                    <Link to={`/client/jobs/${jdId}/invite`} style={{ color: 'var(--color-primary)' }}>
                                        Invite candidates →
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
