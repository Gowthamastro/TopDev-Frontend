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
            <div className="flex items-center justify-center min-h-[400px]" style={{ color: 'var(--color-text-muted)' }}>
                <div className="w-6 h-6 border-2 border-transparent border-t-current rounded-full animate-spin mr-3" style={{ color: 'var(--color-primary)' }}></div>
                Loading assessment blueprint...
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 glass-card rounded-2xl mx-auto max-w-lg mt-12">
                <span className="material-symbols-outlined text-5xl mb-4" style={{ color: 'var(--color-danger)' }}>error</span>
                <p className="mb-6" style={{ color: 'var(--color-text-subtle)' }}>Assessment not found or could not be retrieved.</p>
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
            <div className="glass-card rounded-2xl p-6 mb-6 transition-all group">
                <div className="flex items-start gap-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all border" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-primary)', borderColor: 'var(--color-border)' }}>
                                <span className="material-symbols-outlined text-[14px]">{IconName}</span>
                                {q.type}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-subtle)', borderColor: 'var(--color-border)' }}>
                                {q.difficulty}
                            </span>
                        </div>

                        <div className="text-lg font-medium leading-relaxed mb-6 whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>
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
                                        <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all`} style={{
                                            background: isCorrect ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                                            borderColor: isCorrect ? 'var(--color-success)' : 'var(--color-border)',
                                            color: isCorrect ? 'var(--color-success)' : 'var(--color-text-muted)'
                                        }}>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors`} style={{
                                                borderColor: isCorrect ? 'var(--color-success)' : 'var(--color-border-subtle)',
                                                background: isCorrect ? 'var(--color-success)' : 'transparent'
                                            }}>
                                                {isCorrect && <span className="material-symbols-outlined text-white text-[14px] font-black" style={{ color: 'var(--color-bg)' }}>check</span>}
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
                            <div className="p-5 rounded-r-xl mt-4 animate-fadeIn" style={{ background: 'var(--color-bg-tertiary)', borderLeft: '4px solid var(--color-success)' }}>
                                <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--color-success)' }}>
                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                    AI Logic & Validated Answer
                                </div>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-muted)' }}>
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
                    background: var(--color-bg);
                    border: 1px solid var(--color-border);
                }
            `}</style>
            
            {/* Header Area */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 transition-colors mb-6 text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Pipeline
                    </button>
                    <h1 className="text-3xl font-black" style={{ color: 'var(--color-text)' }}>
                        {typeof assessment.title === 'string' ? assessment.title : (assessment.title?.text || 'Technical Assessment')}
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-subtle)', borderColor: 'var(--color-border)' }}>
                            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                            {assessment.time_limit_minutes || 0} Minutes
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-subtle)', borderColor: 'var(--color-border)' }}>
                            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                            {assessment.questions?.length || 0} Questions
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowAnswers(!showAnswers)} 
                        className={`h-11 px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all border`}
                        style={{
                            background: showAnswers ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
                            borderColor: showAnswers ? 'var(--color-success)' : 'var(--color-border)',
                            color: showAnswers ? 'var(--color-success)' : 'var(--color-text-muted)'
                        }}
                    >
                        <span className="material-symbols-outlined text-[20px]">{showAnswers ? 'visibility_off' : 'visibility'}</span>
                        {showAnswers ? 'Hide Answer Key' : 'Reveal Answer Key'}
                    </button>
                    <button 
                        onClick={() => navigate(`/client/jobs/${jdId}/invite`)} 
                        className="btn-primary h-11 px-6 shadow-none"
                    >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        Invite Candidates
                    </button>
                </div>
            </div>

            <div className="w-full h-px mb-10" style={{ background: 'var(--color-border)' }}></div>

            <div className="space-y-2">
                {assessment.questions?.map((q: any, i: number) => (
                    <QuestionCard key={q.id || i} q={q} index={i} />
                ))}

                {(!assessment.questions || assessment.questions.length === 0) && (
                    <div className="p-12 text-center glass-card rounded-2xl border border-dashed" style={{ borderColor: 'var(--color-border)' }}>
                        <span className="material-symbols-outlined text-4xl mb-4" style={{ color: 'var(--color-text-subtle)' }}>analytics</span>
                        <p style={{ color: 'var(--color-text-muted)' }}>No questions found for this blueprint.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
