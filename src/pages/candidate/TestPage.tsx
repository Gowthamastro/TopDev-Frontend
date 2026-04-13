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
    const { eventCounts, isMonitoring, totalViolations } = useProctoringMonitor(token, proctoringEnabled);

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
            style: { background: '#1a1520', color: '#fbbf24', border: '1px solid #78350f' },
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

    if (isLoading) return <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-slate-400">Loading Assessment...</div>;
    if (error) return (
        <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center flex-col gap-4">
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
        <div className="dark bg-[#0a0c10] text-slate-100 font-display min-h-screen antialiased flex flex-col font-['Inter']">
            
            {/* Proctoring Consent Modal */}
            {showConsent && !isLoading && !error && (
                <ProctoringConsent
                    onAccept={handleAcceptProctoring}
                    onDecline={handleDeclineProctoring}
                    candidateName={testData?.candidate_name}
                />
            )}

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#1e2433] bg-[#0d1016]/95 backdrop-blur-md px-6 py-4">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[28px] text-[#0d59f2]">code_blocks</span>
                    <div className="hidden sm:block">
                        <h2 className="text-white text-lg font-bold">{testData.assessment_title}</h2>
                        <p className="text-xs text-slate-400">Candidate: {testData.candidate_name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Proctoring Indicator */}
                    {isMonitoring ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <Shield size={13} />
                            Monitored
                        </div>
                    ) : !showConsent && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-medium">
                            <AlertTriangle size={13} />
                            Unmonitored
                        </div>
                    )}

                    {/* Violation counter (subtle, only if issues) */}
                    {isMonitoring && totalViolations > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-mono">
                            <AlertTriangle size={12} />
                            {totalViolations}
                        </div>
                    )}

                    {/* Timer */}
                    {timeLeft !== null && (
                        <div className={`flex items-center gap-2 border rounded-full px-4 py-1.5 ${timeLeft < 300 ? 'border-[#f85149]/30 bg-[#f85149]/10 shadow-[0_0_15px_rgba(248,81,73,0.15)] text-[#f85149]' : 'border-[#1e2433] bg-[#11141c] text-emerald-400'}`}>
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
                <div className="w-64 border-r border-[#1e2433] bg-[#0d1016] flex flex-col hidden lg:flex">
                    <div className="p-4 border-b border-[#1e2433]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
                            <span className="text-xs font-mono text-white">{overallProgress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#1e2433] overflow-hidden">
                            <div className="h-full rounded-full bg-[#0d59f2] transition-all duration-300" style={{ width: `${overallProgress}%` }}></div>
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
                                        ${isActive ? 'bg-[#1e2433]/50 border-[#0d59f2]' : 'border-transparent hover:bg-white/[0.02]'}
                                    `}
                                >
                                    <div className="relative">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isAnswered ? 'bg-[#10b981]/20 text-[#10b981]' : isActive ? 'bg-[#0d59f2]/20 text-[#0d59f2]' : 'bg-[#1e2433] text-slate-400'}`}>
                                            {isAnswered ? <CheckCircle2 size={16} /> : i + 1}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm truncate ${isActive ? 'text-white font-medium' : 'text-slate-300'}`}>
                                            {q.type.toUpperCase()}
                                        </div>
                                        <div className="text-xs text-slate-500">{q.max_score} pts</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-y-auto bg-[#0a0c10] relative">
                    {activeQuestion ? (
                        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-6 lg:p-10 pb-32">
                            
                            {/* Question Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-2.5 py-1 rounded bg-[#0d59f2]/10 text-[#0d59f2] text-xs font-semibold tracking-wider uppercase border border-[#0d59f2]/20 flex items-center gap-2">
                                        {getIcon(activeQuestion.type)} {activeQuestion.type}
                                    </span>
                                    <span className="px-2.5 py-1 rounded bg-[#11141c] text-slate-400 text-xs font-medium border border-[#1e2433] capitalize">
                                        {activeQuestion.difficulty}
                                    </span>
                                    <span className="px-2.5 py-1 rounded bg-[#11141c] text-slate-400 text-xs font-medium border border-[#1e2433]">
                                        {activeQuestion.max_score} pts
                                    </span>
                                </div>
                                <h1 className="text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-wrap text-white">
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
                                                    ${isSelected ? 'border-[#0d59f2] bg-[#0d59f2]/5 shadow-[0_0_15px_rgba(13,89,242,0.1)]' : 'border-[#1e2433] bg-[#11141c] hover:border-slate-600'}
                                                `}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[#0d59f2]' : 'border-slate-600'}`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 bg-[#0d59f2] rounded-full" />}
                                                </div>
                                                <span className={`text-base leading-relaxed ${isSelected ? 'text-white' : 'text-slate-300'}`}>
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
                                        className="flex-1 w-full bg-[#11141c] border border-[#1e2433] rounded-xl p-4 text-slate-200 font-normal leading-relaxed focus:border-[#0d59f2] focus:ring-1 focus:ring-[#0d59f2] transition-colors resize-none shadow-inner"
                                    />
                                </div>
                            )}

                            {/* Coding Challenge */}
                            {activeQuestion.type === 'coding' && (
                                <div className="flex-1 min-h-[500px] rounded-xl overflow-hidden border border-[#1e2433] bg-[#0d1117] shadow-xl flex flex-col">
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2433] bg-[#010409]">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-[#f85149]/40"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#e3b341]/40"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#3fb950]/40"></div>
                                        </div>
                                        <span className="text-xs font-mono text-slate-400">solution.js</span>
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
                    <div className="absolute bottom-0 left-0 right-0 bg-[#0d1016]/90 backdrop-blur border-t border-[#1e2433] p-4 flex justify-between items-center z-10">
                        <button 
                            disabled={activeIndex === 0}
                            onClick={() => setActiveIndex(activeIndex - 1)}
                            className="btn-secondary py-2 flex items-center gap-2 disabled:opacity-50"
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        
                        <div className="text-sm font-medium text-slate-400 block lg:hidden">
                            {activeIndex + 1} of {questions.length}
                        </div>

                        {activeIndex === questions.length - 1 ? (
                            <button onClick={handleSubmit} disabled={submitMutation.isPending} className="btn-primary py-2 px-6 flex items-center gap-2 shadow-[0_0_15px_rgba(13,89,242,0.3)]">
                                Submit Assessment <CheckCircle2 size={16} />
                            </button>
                        ) : (
                            <button 
                                onClick={() => setActiveIndex(activeIndex + 1)}
                                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-[#11141c] hover:bg-[#1e2433] border border-[#1e2433] text-slate-300 hover:text-white transition-all text-sm font-medium flex items-center gap-2"
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
