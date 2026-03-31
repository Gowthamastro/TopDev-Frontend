import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function AssessmentViewPage() {
    const [showAnswers, setShowAnswers] = useState(false);
    const { jdId } = useParams<{ jdId: string }>();
    const navigate = useNavigate();

    const { data: assessment, isLoading } = useQuery({
        queryKey: ['assessment-details', jdId],
        queryFn: () => api.get(`/api/v1/assessments/job/${jdId}/details`).then(r => r.data),
        enabled: !!jdId,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-[#475569]">
                <div className="w-6 h-6 border-2 border-[#0d59f2]/20 border-t-[#0d59f2] rounded-full animate-spin mr-3"></div>
                Loading assessment blueprint...
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 glass-card rounded-2xl mx-auto max-w-lg mt-12">
                <span className="material-symbols-outlined text-5xl text-[#ef4444] mb-4">error</span>
                <p className="text-[#8b94a5] mb-6">Assessment not found or could not be retrieved.</p>
                <button onClick={() => navigate('/client/jobs')} className="btn-secondary">Back to Dashboard</button>
            </div>
        );
    }

    const QuestionCard = ({ q, index }: { q: any, index: number }) => {
        const icons: Record<string, string> = { mcq: 'quiz', coding: 'code', scenario: 'psychology' };

        const safeText = (val: any): string => {
            if (val === null || val === undefined) return '';
            if (typeof val === 'string' || typeof val === 'number') return String(val);
            if (typeof val === 'object') return val.text || val.label || JSON.stringify(val);
            return String(val);
        };

        const IconName = icons[safeText(q.type).toLowerCase()] || 'help_outline';
        const qText = safeText(q.text || q.question_text);
        const qCorrect = safeText(q.correct_answer);
        const qExplanation = safeText(q.explanation);

        return (
            <div className="glass-card rounded-2xl p-6 mb-6 border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-start gap-5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-bold text-[#8b94a5] group-hover:bg-[#0d59f2]/10 group-hover:text-[#0d59f2] transition-colors border border-white/5">
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0d59f2]/10 text-[#0d59f2] text-[10px] font-black uppercase tracking-wider border border-[#0d59f2]/20">
                                <span className="material-symbols-outlined text-[14px]">{IconName}</span>
                                {q.type}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#475569] text-[10px] font-bold uppercase border border-white/10">
                                {q.difficulty}
                            </span>
                        </div>

                        <div className="text-white text-lg font-medium leading-relaxed mb-6 whitespace-pre-wrap">
                            {qText}
                        </div>

                        {/* MCQ Options */}
                        {q.type === 'mcq' && Array.isArray(q.options) && (
                            <div className="grid gap-3 mb-6">
                                {q.options.map((opt: any, i: number) => {
                                    const optText = safeText(opt);
                                    const optLabel = typeof opt === 'object' ? opt.label : null;
                                    const isCorrect = showAnswers && (qCorrect.trim() === optText.trim() || (optLabel && qCorrect.trim() === String(optLabel).trim()));

                                    return (
                                        <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                            isCorrect 
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                            : 'bg-white/5 border-white/5 text-slate-300'
                                        }`}>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                                isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-[#475569]'
                                            }`}>
                                                {isCorrect && <span className="material-symbols-outlined text-white text-[14px] font-black">check</span>}
                                            </div>
                                            <span className="text-sm font-medium">
                                                {optLabel && <strong className="mr-2">{optLabel}.</strong>}
                                                {optText}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Explanation (Togglable) */}
                        {showAnswers && (
                            <div className="bg-emerald-500/5 border-l-4 border-emerald-500 p-5 rounded-r-xl mt-4 animate-fadeIn">
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                    AI Logic & Validated Answer
                                </div>
                                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {qExplanation || qCorrect || 'No rubric provided.'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-8 animate-fadeInUp">
            <style>{`
                .glass-card {
                    background: rgba(19, 19, 22, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
            `}</style>
            
            {/* Header Area */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#475569] hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Pipeline
                    </button>
                    <h1 className="text-3xl font-black text-white glow-text-primary">
                        {typeof assessment.title === 'string' ? assessment.title : (assessment.title?.text || 'Technical Assessment')}
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[#8b94a5] text-xs font-bold border border-white/10">
                            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                            {assessment.time_limit_minutes || 0} Minutes
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[#8b94a5] text-xs font-bold border border-white/10">
                            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                            {assessment.questions?.length || 0} Questions
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowAnswers(!showAnswers)} 
                        className={`h-11 px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all border ${
                            showAnswers 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">{showAnswers ? 'visibility_off' : 'visibility'}</span>
                        {showAnswers ? 'Hide Answer Key' : 'Reveal Answer Key'}
                    </button>
                    <button 
                        onClick={() => navigate(`/client/jobs/${jdId}/invite`)} 
                        className="h-11 px-6 bg-[#0d59f2] hover:bg-[#1a67f5] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(13,89,242,0.4)] active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        Invite Candidates
                    </button>
                </div>
            </div>

            <div className="w-full h-px bg-white/5 mb-10"></div>

            <div className="space-y-2">
                {assessment.questions?.map((q: any, i: number) => (
                    <QuestionCard key={q.id || i} q={q} index={i} />
                ))}

                {(!assessment.questions || assessment.questions.length === 0) && (
                    <div className="p-12 text-center glass-card rounded-2xl border border-dashed border-white/10">
                        <span className="material-symbols-outlined text-4xl text-[#475569] mb-4">analytics</span>
                        <p className="text-[#8b94a5]">No questions found for this blueprint.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
