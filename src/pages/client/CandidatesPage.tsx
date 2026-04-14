import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RechartsRadar } from 'recharts';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, MonitorX, Clipboard, Eye, MousePointer, AlertTriangle } from 'lucide-react';

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

    // Integrity ring
    const intScore = activeCandidate?.integrity_score ?? null;
    const intOffset = intScore !== null ? Math.max(0, 282.7 - (282.7 * intScore) / 100) : 282.7;
    const intColor = intScore === null ? 'var(--color-text-subtle)' : intScore >= 80 ? 'var(--color-success)' : intScore >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';
    const intLabel = intScore === null ? 'Pending' : intScore >= 80 ? 'Clean' : intScore >= 50 ? 'Flagged' : 'Suspicious';

    const avatars = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDSlNvj4CTfZyAHNuVk5jS4rx-T4UcPgQ_0mUHMi71FIsbmSD1_1ck9gmpGFDnIKMoBFcH-xNaOJ7c_Ea2q4-Ht0XMox6XF_LSaNbfWVJCSFYa1DzGi1iWgSSGusF_Ah-wx3haJ3enBXBh8u384ddcKK6Rfgk3wk5EESjUDKn6c-oii1Jpl1FsUILD3bo19rlX8UsZK1S7-vjB1kr1F7P_ADp0UkrtD4HYBxBbKgaJIQ32naUkb04oL0ilVS9WyZXgcWt3jOxJBKTc",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAI0q76lMfT9jXSRlnl2T3aEqTmsGdx2xm-RWXQtZiN4R5BYZFWOs6tbxrdsKrJglHgRz53AECPvrCAXAlTJP023xNZzb2PQnfi1RuZYK_00liKl8lFPf0PlroSAIW-lctxQFIHdT70TzkrDxt5K8JHxDBsDXsCzq_wH2rB-PI6lnYFTWrzQjK7tbyR8nrUmYPrfqveiFJPK_RYwvedUcSLnmBSx_1oHvfAUG-N7ik3WNY4I7BDUYmfaY4VYDIsCmqGwpy8wsfkwtE",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCtAT38rlWB_m32YHPO6LmGoH_dRmN5iZFlJdlirF3wFCnvmhNcFs0mb5xjOV_OBy002k6xc2WV-sg5talgwDhmDxoiwPj6umaI3oVaHtiz6aZLQ2hj-PgUBx4WACs1CJkVkndWGgnbCO4SgUiCFrqAjLJCDl9aosh3JV0MxUEzAKgt8rOO8hmNAZRUFQDKJ46Id6LVz9e-qD7IYobWgmMFwIwqb3lKLsazwiaRDW_3Pju0C7hlSHqK-MX2sK2LZo1qhV4Q0so0-kk"
    ];

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>Loading candidate data...</div>;
    }

    const flags = activeCandidate?.integrity_flags || {};

    return (
        <div className="h-screen flex overflow-hidden antialiased w-full animate-fadeInUp" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: "'Inter', sans-serif" }}>
            
            {/* Left Panel: Candidate List */}
            <aside className="w-[400px] flex-shrink-0 border-r flex flex-col relative z-10" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
                <div className="p-6 border-b space-y-4" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center justify-between">
                        <button onClick={() => navigate('/client/jobs')} className="transition-colors mr-2" style={{ color: 'var(--color-text-muted)' }}>
                             <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        </button>
                        <h1 className="text-xl font-semibold tracking-tight flex-1" style={{ color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>Candidates</h1>
                        <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)' }}>{candidates.length} Matches</span>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-text-subtle)' }}>search</span>
                        </div>
                        <input 
                            type="text" 
                            className="block w-full pl-10 pr-3 py-2 rounded-lg outline-none transition-all sm:text-sm" 
                            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                            placeholder="Search by name or skills..." 
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {candidates.map((c: any, index: number) => {
                        const id = c.id || c.attempt_id;
                        const isSelected = selectedId === id;
                        
                        const integrityColor = c.integrity_score === null || c.integrity_score === undefined
                            ? "var(--color-text-subtle)"
                            : c.integrity_score >= 80 ? "var(--color-success)" : c.integrity_score >= 50 ? "var(--color-warning)" : "var(--color-danger)";

                        return (
                            <button 
                                key={id} 
                                onClick={() => setSelectedId(id)} 
                                className={`w-full text-left p-4 rounded-xl transition-all group relative overflow-hidden border ${
                                    isSelected ? 'shadow-sm' : 'border-transparent'
                                }`}
                                style={{ 
                                    background: isSelected ? 'var(--color-bg-tertiary)' : 'transparent',
                                    borderColor: isSelected ? 'var(--color-border)' : 'transparent'
                                }}
                            >
                                <div className="relative flex items-center space-x-4">
                                    <div className="relative">
                                        <img alt="Avatar" className={`w-12 h-12 rounded-full object-cover ${isSelected ? 'ring-2' : 'opacity-80 group-hover:opacity-100'}`} style={{ boxShadow: isSelected ? '0 0 0 2px var(--color-primary)' : 'none' }} src={avatars[index % avatars.length]} />
                                        {isSelected && <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2" style={{ background: 'var(--color-success)', borderColor: 'var(--color-bg)' }}></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'group-hover:text-white'}`} style={{ color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{c.candidate_name || c.name}</p>
                                        <p className="text-xs truncate" style={{ color: 'var(--color-text-subtle)' }}>{c.role || "Candidate"}</p>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}>{Math.round(c.total_score || 0)} AI Match</span>
                                            {/* Integrity badge in list */}
                                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1" style={{ color: integrityColor }}>
                                                <Shield size={9} />
                                                {c.integrity_score != null ? Math.round(c.integrity_score) : '—'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {candidates.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center mt-10 opacity-60">
                            <span className="material-symbols-outlined text-4xl mb-3" style={{ color: 'var(--color-text-subtle)' }}>person_search</span>
                            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No candidates have started the assessment yet.</p>
                            <button onClick={() => navigate(`/client/jobs/${jdId}/invite`)} className="mt-4 px-4 py-2 rounded-lg text-xs font-bold transition-all border" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
                                Invite Now
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Right Panel: Profile Preview */}
            <main className="flex-1 relative overflow-y-auto bg-transparent">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] blur-[120px] rounded-full pointer-events-none" style={{ background: 'var(--color-bg-tertiary)', opacity: 0.3 }}></div>

                <div className="max-w-5xl mx-auto p-8 lg:p-12 relative z-10">
                    {activeCandidate ? (
                        <>
                            <div className="flex justify-end items-center mb-8">
                                <div className="flex space-x-3">
                                    <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-all" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>Reject</button>
                                    <Link to={`/client/jobs/${jdId}/assessment`} className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>View Questions</Link>
                                </div>
                            </div>

                            {/* Candidate Header Card */}
                            <div className="rounded-2xl border p-8 shadow-sm" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="relative">
                                            <img alt="Profile" className="relative w-28 h-28 rounded-full object-cover border-2" style={{ borderColor: 'var(--color-bg-tertiary)' }} src={avatars[0]} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold tracking-tight mb-1" style={{ color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>{activeCandidate.candidate_name || activeCandidate.name}</h2>
                                            <p className="text-lg mb-3" style={{ color: 'var(--color-text-muted)' }}>{activeCandidate.role || "Candidate"}</p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--color-text-subtle)' }}>
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">location_on</span>Global Remote</span>
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">work</span>Senior Level</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score + Integrity Rings */}
                                    <div className="flex-shrink-0 flex gap-6">
                                        {/* AI Score Ring */}
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-28 h-28">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" fill="none" r="45" strokeWidth="6" style={{ stroke: 'var(--color-bg-tertiary)' }}></circle>
                                                    <circle cx="50" cy="50" fill="none" r="45" strokeDasharray="282.7" strokeDashoffset={scoreOffset} strokeLinecap="round" strokeWidth="6" style={{ stroke: 'var(--color-primary)' }}></circle>
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-bold leading-none" style={{ color: 'var(--color-text)' }}>{Math.round(activeCandidate.total_score || 0)}</span>
                                                    <span className="text-[9px] font-medium uppercase tracking-wider mt-1" style={{ color: 'var(--color-text-muted)' }}>Score</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Integrity Ring */}
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-28 h-28">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" fill="none" r="45" strokeWidth="6" style={{ stroke: 'var(--color-bg-tertiary)' }}></circle>
                                                    <circle cx="50" cy="50" fill="none" r="45" strokeDasharray="282.7" strokeDashoffset={intOffset} strokeLinecap="round" strokeWidth="6" style={{ stroke: intScore !== null ? (intScore >= 80 ? 'var(--color-success)' : intScore >= 50 ? 'var(--color-warning)' : 'var(--color-danger)') : 'var(--color-text-subtle)' }}></circle>
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    {intScore !== null ? (
                                                        <>
                                                            <span className="text-2xl font-bold leading-none" style={{ color: 'var(--color-text)' }}>{Math.round(intScore)}</span>
                                                            <span className="text-[9px] font-medium uppercase tracking-wider mt-1" style={{ color: intScore >= 80 ? 'var(--color-success)' : intScore >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>{intLabel}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Shield size={20} style={{ color: 'var(--color-text-subtle)', marginBottom: 4 }} />
                                                            <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>Pending</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    {/* AI Analysis */}
                                    <section>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-primary)' }}>auto_awesome</span>
                                            AI Analysis
                                        </h3>
                                        <div className="rounded-xl p-6 border transition-all" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-muted)' }}>
                                                {activeCandidate.ai_feedback || "Candidate demonstrates strong alignment with technical requirements. Analysis complete."}
                                            </p>
                                        </div>
                                    </section>

                                    {/* ═══════ INTEGRITY / PROCTORING SECTION ═══════ */}
                                    <section>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                            {intScore !== null && intScore >= 80 ? (
                                                <ShieldCheck size={18} style={{ color: 'var(--color-success)' }} />
                                            ) : intScore !== null && intScore >= 50 ? (
                                                <ShieldAlert size={18} style={{ color: 'var(--color-warning)' }} />
                                            ) : intScore !== null ? (
                                                <ShieldX size={18} style={{ color: 'var(--color-danger)' }} />
                                            ) : (
                                                <Shield size={18} style={{ color: 'var(--color-text-subtle)' }} />
                                            )}
                                            Assessment Integrity
                                        </h3>

                                        {/* Consent Status */}
                                        {activeCandidate.proctoring_consented === false && (
                                            <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ 
                                                background: 'rgba(var(--color-warning-rgb), 0.1)', 
                                                color: 'var(--color-text)',
                                                borderColor: 'rgba(var(--color-warning-rgb), 0.2)'
                                            }}>
                                                <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} className="flex-shrink-0" />
                                                <p className="text-xs">Candidate declined proctoring consent. Submission is flagged as <strong>unmonitored</strong>.</p>
                                            </div>
                                        )}

                                        {/* Proctor Summary */}
                                        {activeCandidate.proctor_summary && (
                                            <div className={`rounded-xl p-5 border mb-4`} style={{ 
                                                background: 'var(--color-bg-secondary)', 
                                                border: `1px solid ${intScore !== null && intScore >= 80 ? 'rgba(var(--color-success-rgb), 0.2)' : intScore !== null && intScore >= 50 ? 'rgba(var(--color-warning-rgb), 0.2)' : 'rgba(var(--color-danger-rgb), 0.2)'}`
                                            }}>
                                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{activeCandidate.proctor_summary}</p>
                                            </div>
                                        )}

                                        {/* Event Chips */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { icon: <MonitorX size={16} />, label: 'Tab Switches', value: flags.tab_switches || 0, warn: (flags.tab_switches || 0) > 3 },
                                                { icon: <Clipboard size={16} />, label: 'Pastes', value: flags.pastes || 0, warn: (flags.pastes || 0) > 0 },
                                                { icon: <Eye size={16} />, label: 'Focus Lost', value: flags.focus_lost || 0, warn: (flags.focus_lost || 0) > 5 },
                                                { icon: <MousePointer size={16} />, label: 'Right Clicks', value: flags.right_clicks || 0, warn: (flags.right_clicks || 0) > 3 },
                                            ].map((item, i) => (
                                                <div key={i} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all`} style={{
                                                    background: item.warn ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                                                    borderColor: item.warn ? 'var(--color-warning)' : 'var(--color-border)',
                                                }}>
                                                    <div style={{ color: item.warn ? 'var(--color-warning)' : 'var(--color-text-subtle)' }}>
                                                        {item.icon}
                                                    </div>
                                                    <span className={`text-2xl font-bold`} style={{ color: item.warn ? 'var(--color-warning)' : 'var(--color-text)' }}>
                                                        {item.value}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-subtle)' }}>{item.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Plagiarism Flags */}
                                        {flags.plagiarism_results && flags.plagiarism_results.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">AI Plagiarism Analysis</h4>
                                                {flags.plagiarism_results.map((pr: any, i: number) => {
                                                    const hasFlag = pr.flags && !pr.flags.includes('none');
                                                    return (
                                                        <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border`} style={{
                                                            background: hasFlag ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                                                            borderColor: hasFlag ? 'var(--color-danger)' : 'var(--color-border)',
                                                        }}>
                                                            <div className={`mt-0.5`} style={{ color: hasFlag ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                                                {hasFlag ? <ShieldX size={14} /> : <ShieldCheck size={14} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>Q#{pr.question_id}</span>
                                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium`} style={{
                                                                        background: 'var(--color-bg-tertiary)',
                                                                        color: pr.originality_score >= 70 ? 'var(--color-success)' : pr.originality_score >= 40 ? 'var(--color-warning)' : 'var(--color-danger)'
                                                                    }}>
                                                                        {pr.originality_score}% Original
                                                                    </span>
                                                                    {hasFlag && pr.flags.map((f: string, fi: number) => (
                                                                        <span key={fi} className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-danger)' }}>
                                                                            {f.replace(/_/g, ' ')}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <p className="text-xs truncate" style={{ color: 'var(--color-text-subtle)' }}>{pr.explanation}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </section>

                                    {/* Core Skills */}
                                    <section>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text)' }}>Core Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {(activeCandidate.skills || ["Communication", "Technicals", "Culture"]).map((skill: string, i: number) => (
                                                <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                                                    <span className="w-2 h-2 rounded-full mr-2" style={{ background: i % 3 === 0 ? 'var(--color-success)' : i % 3 === 1 ? 'var(--color-primary)' : 'var(--color-warning)' }}></span> {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-6">
                                    {/* Competency Map */}
                                    <div className="border rounded-xl p-6" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                                        <h4 className="text-sm font-medium mb-4" style={{ color: 'var(--color-text)' }}>Competency Map</h4>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                                    { subject: 'Tech', A: activeCandidate.technical_score || 0 },
                                                    { subject: 'Comm', A: activeCandidate.communication_score || 0 },
                                                    { subject: 'Culture', A: activeCandidate.cultural_fit_score || 0 },
                                                    { subject: 'Speed', A: activeCandidate.speed_score || 80 },
                                                    { subject: 'Integrity', A: intScore ?? 0 }
                                                ]}>
                                                    <PolarGrid stroke="var(--color-border)" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-subtle)', fontSize: 10 }} />
                                                    <RechartsRadar name="Candidate" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.4} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center rounded-3xl p-12 border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--color-bg-tertiary)' }}>
                                <span className="material-symbols-outlined text-4xl" style={{ color: 'var(--color-primary)' }}>person_add</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Build Your Pipeline</h2>
                            <p className="max-w-md mx-auto mb-8" style={{ color: 'var(--color-text-muted)' }}>
                                Invite candidates to take your technical assessment. Once they submit, their AI-scored profiles will appear here.
                            </p>
                            <button onClick={() => navigate(`/client/jobs/${jdId}/invite`)} className="btn-primary" style={{ padding: '12px 32px', fontSize: 16 }}>
                                <span className="material-symbols-outlined text-[20px]">send</span>
                                Invite Your First Candidate
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
