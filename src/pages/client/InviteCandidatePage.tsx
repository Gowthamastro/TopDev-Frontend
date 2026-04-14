import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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

    const { data: attempts, refetch } = useQuery({
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
        onSuccess: () => {
            toast.success(`Invite sent to ${email}!`);
            setEmail('');
            setName('');
            refetch();
        },
        onError: (e: any) => {
            const detail = e.response?.data?.detail;
            const message = Array.isArray(detail) 
                ? detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ') 
                : (typeof detail === 'string' ? detail : 'Invite failed');
            toast.error(message);
        },
    });

    const handleCopy = (link: string, id: string) => {
        navigator.clipboard.writeText(link);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const statusColors: Record<string, string> = {
        invited: 'var(--color-warning)',
        started: 'var(--color-primary)',
        submitted: 'var(--color-success)',
        scored: 'var(--color-text)',
        expired: 'var(--color-text-subtle)',
    };

    return (
        <div className="max-w-5xl mx-auto p-8 animate-fadeInUp font-['Inter']">
             <style>{`
                .glass-card {
                    background: var(--color-bg);
                    border: 1px solid var(--color-border);
                }
                .label-text {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--color-text-subtle);
                    margin-bottom: 8px;
                    display: block;
                }
                .input-glow:focus {
                    border-color: var(--color-primary);
                    background: var(--color-bg-secondary);
                }
            `}</style>

            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button onClick={() => navigate(`/client/jobs/${jdId}/candidates`)}
                        className="flex items-center gap-2 transition-colors mb-6 text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Pipeline
                    </button>
                    <h1 className="text-3xl font-black" style={{ color: 'var(--color-text)' }}>Invite Candidates</h1>
                    <p className="mt-2 text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        {job?.title} — Dispatch secure assessment links directly to top talent.
                    </p>
                </div>
                <button onClick={() => navigate(`/client/jobs/${jdId}/assessment`)} className="btn-secondary h-10 px-4 text-xs font-bold transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">quiz</span>
                    Preview Assessment
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Invite Form */}
                <div className="lg:col-span-5">
                    <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <span className="material-symbols-outlined text-9xl">person_add</span>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}>
                                <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)' }}>mail</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold leading-tight" style={{ color: 'var(--color-text)' }}>Send Digital Invite</h2>
                                <p className="text-xs font-medium" style={{ color: 'var(--color-text-subtle)' }}>Secure & Personalized</p>
                            </div>
                        </div>
 
                        <div className="space-y-6">
                            <div>
                                <label className="label-text">Candidate Name</label>
                                <input
                                    className="w-full h-12 rounded-xl px-4 outline-none transition-all input-glow"
                                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    placeholder="e.g. Alex Johnson"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label-text">Work Email Address</label>
                                <input
                                    className="w-full h-12 rounded-xl px-4 outline-none transition-all input-glow"
                                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    type="email"
                                    placeholder="candidate@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && email.trim() && name.trim() && inviteMutation.mutate()}
                                />
                            </div>

                            <div className="p-4 rounded-2xl border" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}>
                                <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)' }}>
                                    <span className="material-symbols-outlined text-[16px]">info</span>
                                    Link Security
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                    A unique link will be generated. Once the candidate starts, they'll have 90 minutes to complete the evaluation.
                                </p>
                            </div>

                            <button
                                className="w-full h-14 btn-primary rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all"
                                onClick={() => inviteMutation.mutate()}
                                disabled={inviteMutation.isPending || !email.trim() || !name.trim()}
                            >
                                {inviteMutation.isPending ? (
                                    <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">send</span>
                                        Send Official Invite
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Sent Invites Table */}
                <div className="lg:col-span-7">
                    <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-full min-h-[500px]">
                        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--color-text-subtle)' }}>history</span>
                                Outbound Invitations
                            </h2>
                            <span className="text-[10px] px-2 py-1 rounded-md font-black uppercase" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-subtle)' }}>
                                Total: {(attempts || []).length}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {(attempts || []).length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-40">
                                    <span className="material-symbols-outlined text-5xl mb-4">mail_outline</span>
                                    <p className="text-sm font-medium">No candidates invited yet.</p>
                                </div>
                            ) : (
                                <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                                    {(attempts || []).map((a: any) => {
                                        const testLink = `${window.location.origin}/test/${a.token}`;
                                        const status = a.status?.toLowerCase() || 'invited';
                                        
                                        return (
                                            <div key={a.id} className="p-5 flex items-center justify-between transition-colors group">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-subtle)' }}>
                                                        {a.candidate_name?.charAt(0) || 'C'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-bold truncate" style={{ color: 'var(--color-text)' }}>{a.candidate_name}</div>
                                                        <div className="text-[11px] font-medium truncate" style={{ color: 'var(--color-text-muted)' }}>{a.candidate_email}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full border" style={{
                                                        backgroundColor: 'var(--color-bg-tertiary)',
                                                        color: statusColors[status] || 'var(--color-text-subtle)',
                                                        borderColor: 'var(--color-border)'
                                                    }}>
                                                        {status}
                                                    </span>
                                                    
                                                    {status === 'invited' && (
                                                        <button
                                                            onClick={() => handleCopy(testLink, String(a.id))}
                                                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border`}
                                                            style={{
                                                                background: copied === String(a.id) ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                                                                color: copied === String(a.id) ? 'var(--color-success)' : 'var(--color-text-subtle)',
                                                                borderColor: copied === String(a.id) ? 'var(--color-success)' : 'var(--color-border)'
                                                            }}
                                                            title="Copy assessment link"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">
                                                                {copied === String(a.id) ? 'check' : 'content_copy'}
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
