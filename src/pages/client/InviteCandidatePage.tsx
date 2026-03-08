import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Send, UserPlus, Mail, ArrowLeft, Link as LinkIcon, Copy, Check } from 'lucide-react';
import api from '../../services/api';

export default function InviteCandidatePage() {
    const { jdId } = useParams<{ jdId: string }>();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const { data: job } = useQuery({
        queryKey: ['job', jdId],
        queryFn: () => api.get(`/api/v1/jobs/${jdId}`).then(r => r.data),
        enabled: !!jdId,
    });

    const { data: attempts } = useQuery({
        queryKey: ['attempts', jdId],
        queryFn: () => api.get(`/api/v1/assessments/job/${jdId}/attempts`).then(r => r.data),
        enabled: !!jdId,
    });

    const inviteMutation = useMutation({
        mutationFn: () => api.post('/api/v1/assessments/invite', {
            job_description_id: Number(jdId),
            candidate_email: email,
            candidate_name: name,
        }),
        onSuccess: (res) => {
            toast.success(`Invite sent to ${email}!`);
            setEmail('');
            setName('');
        },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Invite failed'),
    });

    const handleCopy = (link: string, id: string) => {
        navigator.clipboard.writeText(link);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const statusColors: Record<string, string> = {
        invited: '#f59e0b',
        started: '#6366f1',
        submitted: '#10b981',
        scored: '#8b5cf6',
        expired: '#64748b',
    };

    return (
        <div style={{ padding: 32, maxWidth: 900 }} className="animate-fadeInUp">
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <button onClick={() => navigate(`/client/jobs/${jdId}/candidates`)}
                    className="btn-secondary" style={{ padding: '7px 14px', fontSize: 13, marginBottom: 16 }}>
                    <ArrowLeft size={14} /> Back to Candidates
                </button>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Invite Candidates</h1>
                <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: 14 }}>
                    {job?.title} — Send secure test links to candidates
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Invite form */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <div style={{ width: 36, height: 36, background: 'rgba(99,102,241,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserPlus size={18} color="#818cf8" />
                        </div>
                        <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Send Invite</h2>
                    </div>

                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                            Candidate name
                        </label>
                        <input
                            className="input-field"
                            placeholder="Alex Johnson"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                            Email address
                        </label>
                        <input
                            className="input-field"
                            type="email"
                            placeholder="candidate@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && inviteMutation.mutate()}
                        />
                    </div>

                    <div style={{ padding: '12px 14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: '#818cf8', fontWeight: 500 }}>
                            <Mail size={13} /> What happens next
                        </div>
                        A secure test link (expires in 48h) will be emailed to the candidate. Their answers will be auto-scored by AI and added to your ranked list.
                    </div>

                    <button
                        className="btn-primary"
                        onClick={() => inviteMutation.mutate()}
                        disabled={inviteMutation.isPending || !email.trim() || !name.trim()}
                        style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                    >
                        {inviteMutation.isPending ? 'Sending...' : <><Send size={15} /> Send Invite</>}
                    </button>
                </div>

                {/* Existing attempts */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
                        <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Sent Invites</h2>
                    </div>
                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                        {(attempts || []).length === 0 ? (
                            <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
                                No invites sent yet.
                            </div>
                        ) : (
                            (attempts || []).map((a: any) => {
                                const testLink = `${window.location.origin}/test/${a.token}`;
                                return (
                                    <div key={a.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>{a.candidate_name}</div>
                                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.candidate_email}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                            <span style={{
                                                fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 600, textTransform: 'capitalize',
                                                background: `${statusColors[a.status] || '#64748b'}18`,
                                                color: statusColors[a.status] || '#64748b'
                                            }}>{a.status}</span>
                                            {a.status === 'invited' && (
                                                <button
                                                    onClick={() => handleCopy(testLink, String(a.id))}
                                                    title="Copy test link"
                                                    style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: copied === String(a.id) ? '#10b981' : 'var(--color-text-muted)' }}
                                                >
                                                    {copied === String(a.id) ? <Check size={13} /> : <Copy size={13} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
