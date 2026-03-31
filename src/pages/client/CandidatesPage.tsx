import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Radar as RechartsRadar } from 'recharts';

export default function ClientCandidatesPage() {
    const { jdId } = useParams<{ jdId: string }>();
    const navigate = useNavigate();

    const { data: candidates = [], isLoading } = useQuery({
        queryKey: ['candidates', jdId],
        queryFn: () => api.get(`/api/v1/assessments/job/${jdId}/attempts`).then(r => r.data),
        enabled: !!jdId,
    });

    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        if (!selectedId && candidates.length > 0) {
            setSelectedId(candidates[0].id || candidates[0].attempt_id);
        }
    }, [candidates, selectedId]);

    const activeCandidate = candidates.find((c: any) => (c.id || c.attempt_id) === selectedId) || null;

    // Compute progress ring stroke length based on score (max 282.7)
    const scoreOffset = Math.max(0, 282.7 - (282.7 * (activeCandidate?.total_score || 0)) / 100);

    const avatars = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDSlNvj4CTfZyAHNuVk5jS4rx-T4UcPgQ_0mUHMi71FIsbmSD1_1ck9gmpGFDnIKMoBFcH-xNaOJ7c_Ea2q4-Ht0XMox6XF_LSaNbfWVJCSFYa1DzGi1iWgSSGusF_Ah-wx3haJ3enBXBh8u384ddcKK6Rfgk3wk5EESjUDKn6c-oii1Jpl1FsUILD3bo19rlX8UsZK1S7-vjB1kr1F7P_ADp0UkrtD4HYBxBbKgaJIQ32naUkb04oL0ilVS9WyZXgcWt3jOxJBKTc",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAI0q76lMfT9jXSRlnl2T3aEqTmsGdx2xm-RWXQtZiN4R5BYZFWOs6tbxrdsKrJglHgRz53AECPvrCAXAlTJP023xNZzb2PQnfi1RuZYK_00liKl8lFPf0PlroSAIW-lctxQFIHdT70TzkrDxt5K8JHxDBsDXsCzq_wH2rB-PI6lnYFTWrzQjK7tbyR8nrUmYPrfqveiFJPK_RYwvedUcSLnmBSx_1oHvfAUG-N7ik3WNY4I7BDUYmfaY4VYDIsCmqGwpy8wsfkwtE",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCtAT38rlWB_m32YHPO6LmGoH_dRmN5iZFlJdlirF3wFCnvmhNcFs0mb5xjOV_OBy002k6xc2WV-sg5talgwDhmDxoiwPj6umaI3oVaHtiz6aZLQ2hj-PgUBx4WACs1CJkVkndWGgnbCO4SgUiCFrqAjLJCDl9aosh3JV0MxUEzAKgt8rOO8hmNAZRUFQDKJ46Id6LVz9e-qD7IYobWgmMFwIwqb3lKLsazwiaRDW_3Pju0C7hlSHqK-MX2sK2LZo1qhV4Q0so0-kk"
    ];

    if (isLoading) {
        return <div className="h-screen bg-[#0B0F14] flex items-center justify-center text-slate-400">Loading candidate data...</div>;
    }

    return (
        <div className="dark bg-[#0B0F14] text-slate-100 font-display h-screen flex overflow-hidden antialiased selection:bg-[#0d59f2]/30 w-full font-['Inter'] animate-fadeInUp">
            
            {/* Left Panel: Candidate List */}
            <aside className="w-[400px] flex-shrink-0 border-r border-white/10 flex flex-col bg-white/[0.01] backdrop-blur-xl relative z-10">
                <div className="p-6 border-b border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                        <button onClick={() => navigate('/client/jobs')} className="text-slate-400 hover:text-white transition-colors mr-2">
                             <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        </button>
                        <h1 className="text-xl font-semibold tracking-tight text-white flex-1">Candidates</h1>
                        <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-1 text-xs font-medium bg-[#0d59f2]/10 text-[#0d59f2] rounded-full">{candidates.length} Matches</span>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
                        </div>
                        <input type="text" className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-black/20 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] sm:text-sm transition-all" placeholder="Search by name or skills..." />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {candidates.map((c: any, index: number) => {
                        const id = c.id || c.attempt_id;
                        const isSelected = selectedId === id;
                        const scoreColorClass = c.total_score >= 90 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : c.total_score >= 80 ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20";

                        return (
                            <button key={id} onClick={() => setSelectedId(id)} className={`w-full text-left p-4 rounded-xl transition-all group relative overflow-hidden ${isSelected ? 'bg-white/10 border border-white/20 shadow-sm' : 'bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10'}`}>
                                {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-[#0d59f2]/10 to-transparent opacity-50"></div>}
                                <div className="relative flex items-center space-x-4">
                                    <div className="relative">
                                        <img alt="Avatar" className={`w-12 h-12 rounded-full object-cover ${isSelected ? 'ring-2 ring-[#0d59f2]/30' : 'opacity-80 group-hover:opacity-100'}`} src={avatars[index % avatars.length]} />
                                        {isSelected && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0B0F14]"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{c.candidate_name || c.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{c.role || "Candidate"}</p>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${scoreColorClass}`}>{Math.round(c.total_score || 0)} AI Match</span>
                                        </div>
                                    </div>
                                </div>
                            </button >
                        );
                    })}

                    {candidates.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center mt-10 opacity-60">
                            <span className="material-symbols-outlined text-4xl mb-3">person_search</span>
                            <p className="text-sm text-slate-400">No candidates have started the assessment yet.</p>
                            <button onClick={() => navigate(`/client/jobs/${jdId}/invite`)} className="mt-4 px-4 py-2 bg-[#0d59f2]/10 text-[#0d59f2] rounded-lg text-xs font-bold hover:bg-[#0d59f2]/20 transition-all border border-[#0d59f2]/20">
                                Invite Now
                            </button>
                        </div>
                    )}
                </div >
            </aside >

            {/* Right Panel: Profile Preview */}
            <main className="flex-1 relative overflow-y-auto bg-transparent" >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#0d59f2]/5 blur-[120px] rounded-full pointer-events-none" ></div >

                <div className="max-w-5xl mx-auto p-8 lg:p-12 relative z-10">
                    {activeCandidate ? (
                        <>
                            <div className="flex justify-end items-center mb-8">
                                <div className="flex space-x-3">
                                    <button className="px-4 py-2 rounded-lg text-sm font-medium border border-white/10 text-slate-300 hover:bg-white/5">Reject</button>
                                    <Link to={`/client/jobs/${jdId}/assessment`} className="inline-block px-4 py-2 rounded-lg text-sm font-medium bg-[#0d59f2] text-white hover:bg-[#0d59f2]/90 transition-colors shadow-[0_0_20px_rgba(13,89,242,0.3)]">View Questions</Link>
                                </div>
                            </div>

                            <div className="bg-[#121822]/80 backdrop-blur-2xl rounded-2xl border border-white/10 p-8 shadow-xl shadow-black/5">
                                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-[#0d59f2] rounded-full blur opacity-30"></div>
                                            <img alt="Profile" className="relative w-28 h-28 rounded-full object-cover border-2 border-[#0B0F14]" src={avatars[0]} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold tracking-tight text-white mb-1">{activeCandidate.candidate_name || activeCandidate.name}</h2>
                                            <p className="text-lg text-slate-400 mb-3">{activeCandidate.role || "Candidate"}</p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">location_on</span> Global Remote</span>
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">work</span> Senior Level</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 flex flex-col items-center">
                                        <div className="relative w-32 h-32">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                <circle className="stroke-white/5" cx="50" cy="50" fill="none" r="45" strokeWidth="6"></circle>
                                                <circle className={`${activeCandidate.total_score >= 90 ? 'stroke-emerald-500' : activeCandidate.total_score >= 80 ? 'stroke-blue-500' : 'stroke-amber-500'}`} cx="50" cy="50" fill="none" r="45" strokeDasharray="282.7" strokeDashoffset={scoreOffset} strokeLinecap="round" strokeWidth="6"></circle>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-bold text-white leading-none">{Math.round(activeCandidate.total_score || 0)}</span>
                                                <span className={`text-[10px] font-medium uppercase tracking-wider mt-1 ${activeCandidate.total_score >= 90 ? 'text-emerald-500' : activeCandidate.total_score >= 80 ? 'text-blue-500' : 'text-amber-500'}`}>Match</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <section>
                                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px] text-[#0d59f2]">auto_awesome</span>
                                            AI Analysis
                                        </h3>
                                        <div className="bg-[#0d59f2]/10 border border-[#0d59f2]/20 rounded-xl p-6 relative overflow-hidden">
                                            <p className="text-sm text-slate-300 leading-relaxed relative z-10 whitespace-pre-wrap">
                                                {activeCandidate.ai_feedback || "Candidate demonstrates strong alignment with technical requirements. Analysis complete."}
                                            </p>
                                        </div>
                                    </section>
                                    
                                    <section>
                                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Core Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {(activeCandidate.skills || ["Communication", "Technicals", "Culture"]).map((skill: string, i: number) => (
                                                <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-slate-200">
                                                    <span className={`w-2 h-2 rounded-full mr-2 ${i % 3 === 0 ? 'bg-emerald-500' : i % 3 === 1 ? 'bg-blue-500' : 'bg-amber-500'}`}></span> {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h4 className="text-sm font-medium text-white mb-4">Competency Map</h4>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                                    { subject: 'Tech', A: activeCandidate.technical_score || 0 },
                                                    { subject: 'Comm', A: activeCandidate.communication_score || 0 },
                                                    { subject: 'Culture', A: activeCandidate.cultural_fit_score || 0 },
                                                    { subject: 'Speed', A: activeCandidate.speed_score || 80 },
                                                    { subject: 'Lead', A: activeCandidate.leadership_score || 70 }
                                                ]}>
                                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                                                    <RechartsRadar name="Candidate" dataKey="A" stroke="#0d59f2" fill="#0d59f2" fillOpacity={0.4} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center glass-panel rounded-3xl p-12 border border-white/5">
                            <div className="w-20 h-20 bg-[#0d59f2]/10 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl text-[#0d59f2]">person_add</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Build Your Pipeline</h2>
                            <p className="text-slate-400 max-w-md mx-auto mb-8">
                                Invite candidates to take your technical assessment. Once they submit, their AI-scored profiles will appear here.
                            </p>
                            <button onClick={() => navigate(`/client/jobs/${jdId}/invite`)} className="px-8 py-3 bg-[#0d59f2] text-white rounded-xl font-bold shadow-lg hover:bg-[#1a67f5] transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">send</span>
                                Invite Your First Candidate
                            </button>
                        </div>
                    )}
                </div >
            </main >
        </div >
    );
}
