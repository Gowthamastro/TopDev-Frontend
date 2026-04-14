import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { Clock, Code2, FileText, Presentation, CheckCircle2, ChevronLeft, ChevronRight, Shield, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import useProctoringMonitor from '../../hooks/useProctoringMonitor';
import ProctoringConsent from '../../components/ProctoringConsent';

export default function TestPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    // Proctoring state
    const [showConsent, setShowConsent] = useState(true);
    const [proctoringEnabled, setProctoringEnabled] = useState(false);
    const { isMonitoring, totalViolations } = useProctoringMonitor(token, proctoringEnabled);

    // Fetch assessment
    const { data: testData, isLoading, error } = useQuery({
        queryKey: ['test', token],
        queryFn: async () => {
            const res = await api.get(`/api/v1/assessments/test/${token}`);
            return res.data;
        },
        retry: 0,
        refetchOnWindowFocus: false,
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const questions = testData?.questions || [];
    const activeQuestion = questions[activeIndex];

    // Handle consent
    const handleAcceptProctoring = async () => {
        setProctoringEnabled(true);
        setShowConsent(false);
        try {
            await api.post(`/api/v1/proctor/${token}/consent`, { consented: true });
        } catch { /* non-critical */ }
    };

    const handleDeclineProctoring = async () => {
        setProctoringEnabled(false);
        setShowConsent(false);
        try {
            await api.post(`/api/v1/proctor/${token}/consent`, { consented: false });
        } catch { /* non-critical */ }
        toast('You declined monitoring. Your submission will be flagged as unmonitored.', {
            icon: '⚠️',
            duration: 5000,
            style: { background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' },
        });
    };

    // Initialize timer
    useEffect(() => {
        if (testData?.time_limit_minutes && timeLeft === null) {
            setTimeLeft(testData.time_limit_minutes * 60);
        }
    }, [testData]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null || prev <= 1) {
                    clearInterval(timerId);
                    if (prev === 1) handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const submitMutation = useMutation({
        mutationFn: async (payload: { answers: Record<string, string> }) => {
            const res = await api.post(`/api/v1/candidates/test/${token}/submit`, payload);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success('Assessment submitted! Calculating your score…');
            if (data?.attempt_id) {
                navigate(`/candidate/results/${data.attempt_id}`);
            } else {
                navigate('/candidate');
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.detail || 'Failed to submit test');
        }
    });

    const handleAutoSubmit = () => {
        toast.error("Time's up! Auto-submitting assessment...", { duration: 5000 });
        submitMutation.mutate({ answers });
    };

    const handleSubmit = () => {
        if (!window.confirm("Are you sure you want to submit? You cannot change your answers after this.")) return;
        submitMutation.mutate({ answers });
    };

    const handleAnswerChange = (val: string) => {
        if (!activeQuestion) return;
        setAnswers(prev => ({ ...prev, [activeQuestion.id]: val }));
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>Loading Assessment...</div>;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4" style={{ background: 'var(--color-bg)' }}>
            <div className="text-red-400 text-lg">{(error as any).response?.data?.detail || "Invalid or expired test link."}</div>
            <button onClick={() => navigate('/')} className="btn-secondary">Return Home</button>
        </div>
    );

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const overallProgress = Math.round((Object.keys(answers).length / questions.length) * 100) || 0;

    const getIcon = (type: string) => {
        if (type === 'coding') return <Code2 size={16} />;
        if (type === 'scenario') return <Presentation size={16} />;
        return <FileText size={16} />;
    };

    return (
        <div className="bg-[var(--color-bg)] text-[var(--color-text)] font-display min-h-screen antialiased flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Proctoring Consent Modal */}
            {showConsent && !isLoading && !error && (
                <ProctoringConsent
                    onAccept={handleAcceptProctoring}
                    onDecline={handleDeclineProctoring}
                    candidateName={testData?.candidate_name}
                />
            )}

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-[var(--color-bg-secondary)]/95 backdrop-blur-md px-6 py-4" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[28px]" style={{ color: 'var(--color-primary)' }}>code_blocks</span>
                    <div className="hidden sm:block">
                        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{testData.assessment_title}</h2>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Candidate: {testData.candidate_name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Proctoring Indicator */}
                    {isMonitoring ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium" style={{ borderColor: 'rgba(var(--color-success-rgb), 0.2)', background: 'rgba(var(--color-success-rgb), 0.05)', color: 'var(--color-success)' }}>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--color-success)' }}></span>
                                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--color-success)' }}></span>
                            </span>
                            <Shield size={13} />
                            Monitored
                        </div>
                    ) : !showConsent && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium" style={{ borderColor: 'rgba(var(--color-warning-rgb), 0.2)', background: 'rgba(var(--color-warning-rgb), 0.05)', color: 'var(--color-warning)' }}>
                            <AlertTriangle size={13} />
                            Unmonitored
                        </div>
                    )}
 
                    {/* Violation counter */}
                    {isMonitoring && totalViolations > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono" style={{ borderColor: 'rgba(var(--color-danger-rgb), 0.2)', background: 'rgba(var(--color-danger-rgb), 0.05)', color: 'var(--color-danger)' }}>
                            <AlertTriangle size={12} />
                            {totalViolations}
                        </div>
                    )}

                    {/* Timer */}
                    {timeLeft !== null && (
                        <div className={`flex items-center gap-2 border rounded-full px-4 py-1.5 transition-colors`} 
                             style={{ 
                                borderColor: timeLeft < 300 ? 'rgba(var(--color-danger-rgb), 0.3)' : 'var(--color-border)', 
                                background: timeLeft < 300 ? 'rgba(var(--color-danger-rgb), 0.1)' : 'var(--color-bg-tertiary)',
                                color: timeLeft < 300 ? 'var(--color-danger)' : 'var(--color-text)' 
                             }}>
                            <Clock size={16} />
                            <span className="font-mono font-bold tracking-wider">{formatTime(timeLeft)}</span>
                        </div>
                    )}
                    <button onClick={handleSubmit} disabled={submitMutation.isPending} className="btn-primary py-2 px-6 flex items-center gap-2">
                        {submitMutation.isPending ? 'Submitting...' : 'Submit Session'}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar Layout (Navigation) */}
                <div className="w-64 border-r flex flex-col hidden lg:flex" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                    <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Progress</span>
                            <span className="text-xs font-mono" style={{ color: 'var(--color-text)' }}>{overallProgress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${overallProgress}%`, background: 'var(--color-primary)' }}></div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-2">
                        {questions.map((q: any, i: number) => {
                            const isAnswered = !!answers[q.id];
                            const isActive = activeIndex === i;
                            
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setActiveIndex(i)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2
                                        ${isActive ? 'border-[var(--color-primary)]' : 'border-transparent hover:bg-[var(--color-bg-tertiary)]'}
                                    `}
                                    style={{ background: isActive ? 'var(--color-bg-tertiary)' : '' }}
                                >
                                    <div className="relative">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors`}
                                             style={{ 
                                                 background: isAnswered ? 'var(--color-text-success)' : isActive ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
                                                 color: isAnswered || isActive ? 'var(--color-bg)' : 'var(--color-text-subtle)'
                                             }}>
                                            {isAnswered ? <CheckCircle2 size={16} /> : i + 1}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm truncate ${isActive ? 'font-bold' : ''}`} style={{ color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                                            {q.type.toUpperCase()}
                                        </div>
                                        <div className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>{q.max_score} pts</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-y-auto relative" style={{ background: 'var(--color-bg)' }}>
                    {activeQuestion ? (
                        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-6 lg:p-10 pb-32">
                            
                            {/* Question Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-2.5 py-1 rounded text-xs font-semibold tracking-wider uppercase border flex items-center gap-2"
                                          style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
                                        {getIcon(activeQuestion.type)} {activeQuestion.type}
                                    </span>
                                    <span className="px-2.5 py-1 rounded text-xs font-medium border capitalize"
                                          style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
                                        {activeQuestion.difficulty}
                                    </span>
                                    <span className="px-2.5 py-1 rounded text-xs font-medium border"
                                          style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
                                        {activeQuestion.max_score} pts
                                    </span>
                                </div>
                                <h1 className="text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>
                                    {activeQuestion.text}
                                </h1>
                            </div>

                            {/* MCQ */}
                            {activeQuestion.type === 'mcq' && (
                                <div className="space-y-4 max-w-3xl">
                                    {activeQuestion.options?.map((opt: any, i: number) => {
                                        const optText = typeof opt === 'object' ? opt.text : String(opt);
                                        const optVal = typeof opt === 'object' ? opt.label || String(optText) : String(opt);
                                        const isSelected = answers[activeQuestion.id] === optVal;
                                        
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => handleAnswerChange(optVal)}
                                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 
                                                    ${isSelected ? 'border-[var(--color-primary)] bg-[var(--color-bg-tertiary)]' : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-text-subtle)]'}
                                                `}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[var(--color-primary)]' : 'border-[var(--color-text-subtle)]'}`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full" />}
                                                </div>
                                                <span className={`text-base leading-relaxed ${isSelected ? 'font-bold' : ''}`} style={{ color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                                                    {optText}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Text / Scenario */}
                            {activeQuestion.type === 'scenario' && (
                                <div className="flex-1 min-h-[400px] flex flex-col">
                                    <textarea
                                        value={answers[activeQuestion.id] || ''}
                                        onChange={e => handleAnswerChange(e.target.value)}
                                        placeholder="Write your detailed response here..."
                                        className="flex-1 w-full p-4 font-normal leading-relaxed transition-colors resize-none"
                                        style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 16, color: 'var(--color-text)' }}
                                    />
                                </div>
                            )}

                            {/* Coding Challenge */}
                            {activeQuestion.type === 'coding' && (
                                <div className="flex-1 min-h-[500px] rounded-xl overflow-hidden border bg-[var(--color-bg-secondary)] shadow-xl flex flex-col" style={{ borderColor: 'var(--color-border)' }}>
                                    <div className="flex items-center justify-between px-4 py-2 border-b bg-[var(--color-bg-tertiary)]" style={{ borderColor: 'var(--color-border)' }}>
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full opacity-40" style={{ background: 'var(--color-text-muted)' }}></div>
                                            <div className="w-3 h-3 rounded-full opacity-40" style={{ background: 'var(--color-text-muted)' }}></div>
                                            <div className="w-3 h-3 rounded-full opacity-40" style={{ background: 'var(--color-text-muted)' }}></div>
                                        </div>
                                        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>solution.js</span>
                                        <div className="w-4"></div>
                                    </div>
                                    <Editor
                                        height="100%"
                                        defaultLanguage="javascript"
                                        theme="vs-dark"
                                        value={answers[activeQuestion.id] || '// Write your solution here...\n'}
                                        onChange={(val) => handleAnswerChange(val || '')}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
                                            lineHeight: 1.6,
                                            padding: { top: 16 },
                                            scrollBeyondLastLine: false,
                                        }}
                                    />
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500">
                            No questions found in this assessment.
                        </div>
                    )}
                    
                    {/* Bottom Floating Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 backdrop-blur border-t p-4 flex justify-between items-center z-10" style={{ background: 'var(--glass-bg)', borderColor: 'var(--color-border)' }}>
                        <button 
                            disabled={activeIndex === 0}
                            onClick={() => setActiveIndex(activeIndex - 1)}
                            className="btn-secondary py-2 flex items-center gap-2 disabled:opacity-50"
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        
                        <div className="text-sm font-medium block lg:hidden" style={{ color: 'var(--color-text-muted)' }}>
                            {activeIndex + 1} of {questions.length}
                        </div>

                        {activeIndex === questions.length - 1 ? (
                            <button onClick={handleSubmit} disabled={submitMutation.isPending} className="btn-primary py-2 px-6 flex items-center gap-2">
                                Submit Assessment <CheckCircle2 size={16} />
                            </button>
                        ) : (
                            <button 
                                onClick={() => setActiveIndex(activeIndex + 1)}
                                className="btn-secondary py-2 flex items-center gap-2"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
