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
        invited: '#f59e0b',
        started: '#6366f1',
        submitted: '#10b981',
        scored: '#8b5cf6',
        expired: '#64748b',
    };

    return (
        <div className="max-w-5xl mx-auto p-8 animate-fadeInUp font-['Inter']">
             <style>{`
                .glass-card {
                    background: rgba(19, 19, 22, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .label-text {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #475569;
                    margin-bottom: 8px;
                    display: block;
                }
                .input-glow:focus {
                    border-color: rgba(13, 89, 242, 0.4);
                    box-shadow: 0 0 20px rgba(13, 89, 242, 0.1);
                    background: rgba(255, 255, 255, 0.03);
                }
            `}</style>

            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button onClick={() => navigate(`/client/jobs/${jdId}/candidates`)}
                        className="flex items-center gap-2 text-[#475569] hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Pipeline
                    </button>
                    <h1 className="text-3xl font-black text-white glow-text-primary">Invite Candidates</h1>
                    <p className="text-slate-400 mt-2 text-sm font-medium">
                        {job?.title} — Dispatch secure assessment links directly to top talent.
                    </p>
                </div>
                <button onClick={() => navigate(`/client/jobs/${jdId}/assessment`)} className="h-10 px-4 rounded-xl border border-white/5 bg-white/5 text-slate-300 text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
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
                            <div className="w-12 h-12 bg-[#0d59f2]/10 rounded-2xl flex items-center justify-center border border-[#0d59f2]/20">
                                <span className="material-symbols-outlined text-[#0d59f2] text-2xl">mail</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white leading-tight">Send Digital Invite</h2>
                                <p className="text-xs text-slate-500 font-medium">Secure & Personalized</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="label-text">Candidate Name</label>
                                <input
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-slate-600 outline-none transition-all input-glow"
                                    placeholder="e.g. Alex Johnson"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label-text">Work Email Address</label>
                                <input
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-slate-600 outline-none transition-all input-glow"
                                    type="email"
                                    placeholder="candidate@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && email.trim() && name.trim() && inviteMutation.mutate()}
                                />
                            </div>

                            <div className="p-4 bg-[#0d59f2]/5 border border-[#0d59f2]/10 rounded-2xl">
                                <div className="flex items-center gap-2 text-[#0d59f2] font-black text-[10px] uppercase tracking-widest mb-2">
                                    <span className="material-symbols-outlined text-[16px]">info</span>
                                    Link Security
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    A unique link will be generated. Once the candidate starts, they'll have 90 minutes to complete the evaluation.
                                </p>
                            </div>

                            <button
                                className="w-full h-14 bg-[#0d59f2] hover:bg-[#1a67f5] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                                onClick={() => inviteMutation.mutate()}
                                disabled={inviteMutation.isPending || !email.trim() || !name.trim()}
                            >
                                {inviteMutation.isPending ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
                    <div className="glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col h-full min-h-[500px] shadow-xl">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#475569] text-[20px]">history</span>
                                Outbound Invitations
                            </h2>
                            <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-[#475569] font-black uppercase">
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
                                <div className="divide-y divide-white/5">
                                    {(attempts || []).map((a: any) => {
                                        const testLink = `${window.location.origin}/test/${a.token}`;
                                        const status = a.status?.toLowerCase() || 'invited';
                                        
                                        return (
                                            <div key={a.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#475569] font-bold group-hover:text-white transition-colors">
                                                        {a.candidate_name?.charAt(0) || 'C'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-bold text-white truncate">{a.candidate_name}</div>
                                                        <div className="text-[11px] text-slate-500 font-medium truncate">{a.candidate_email}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-white/5 bg-white/5 text-[#8b94a5]" style={{
                                                        backgroundColor: `${statusColors[status] || '#64748b'}15`,
                                                        color: statusColors[status] || '#64748b',
                                                        borderColor: `${statusColors[status] || '#64748b'}30`
                                                    }}>
                                                        {status}
                                                    </span>
                                                    
                                                    {status === 'invited' && (
                                                        <button
                                                            onClick={() => handleCopy(testLink, String(a.id))}
                                                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                                                copied === String(a.id) 
                                                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                                                : 'bg-white/5 text-slate-500 border border-white/5 hover:border-white/10 hover:text-white'
                                                            }`}
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
