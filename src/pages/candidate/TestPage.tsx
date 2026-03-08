import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Code2, BookOpen } from 'lucide-react';
import api from '../../services/api';

export default function TestPage() {
    const { token } = useParams<{ token: string }>();
    const [started, setStarted] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentQ, setCurrentQ] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['test', token],
        queryFn: () => api.get(`/api/v1/candidates/test/${token}`).then(r => r.data),
        enabled: !!token,
    });

    const startMutation = useMutation({
        mutationFn: () => api.post(`/api/v1/candidates/test/${token}/start`),
        onSuccess: () => {
            setStarted(true);
            const total = (data?.assessment?.time_limit_minutes || 90) * 60;
            setTimeLeft(total);
        },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed to start test'),
    });

    const submitMutation = useMutation({
        mutationFn: () => api.post(`/api/v1/candidates/test/${token}/submit`, { answers }),
        onSuccess: () => setSubmitted(true),
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Submission failed'),
    });

    useEffect(() => {
        if (started && timeLeft !== null && timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(t => (t || 1) - 1), 1000);
        }
        if (started && timeLeft === 0) submitMutation.mutate();
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [started, timeLeft]);

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    if (isLoading) return <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>Loading assessment...</div>;
    if (error) return <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>Invalid or expired test link.</div>;

    // Submitted success screen
    if (submitted) return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }} className="animated-bg">
            <div style={{ width: 72, height: 72, background: 'rgba(16,185,129,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={36} color="#10b981" />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Assessment Submitted!</h1>
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: 400, fontSize: 15 }}>
                Your answers have been submitted and are being scored by AI. You'll receive your results shortly.
            </p>
        </div>
    );

    const questions = data?.questions || [];
    const q = questions[currentQ];
    const total = questions.length;
    const answeredCount = Object.keys(answers).length;

    // Start screen
    if (!started) return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} className="animated-bg">
            <div style={{ maxWidth: 560, width: '100%' }}>
                <div className="card" style={{ textAlign: 'center', padding: 40 }}>
                    <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                        <BookOpen size={26} color="white" />
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{data?.assessment?.title}</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 28, fontSize: 14 }}>Role: <strong>{data?.role}</strong></p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
                        {[
                            { label: 'Questions', value: total },
                            { label: 'Time Limit', value: `${data?.assessment?.time_limit_minutes || 90}m` },
                            { label: 'Answerd', value: `${answeredCount}/${total}` },
                        ].map(d => (
                            <div key={d.label} style={{ background: 'var(--color-surface)', borderRadius: 10, padding: '14px 12px' }}>
                                <div style={{ fontSize: 20, fontWeight: 700 }}>{d.value}</div>
                                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{d.label}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: '14px 16px', marginBottom: 24, fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'left' }}>
                        📋 Once started, the timer begins. Ensure you are in a quiet environment. Questions include MCQ, coding, and scenario types.
                    </div>
                    <button className="btn-primary" onClick={() => startMutation.mutate()} disabled={startMutation.isPending} style={{ padding: '13px 36px', fontSize: 15 }}>
                        {startMutation.isPending ? 'Starting...' : '🚀 Start Assessment'}
                    </button>
                </div>
            </div>
        </div>
    );

    // Test-taking screen
    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
            {/* Top bar */}
            <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{data?.assessment?.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{answeredCount}/{total} answered</div>
                    {timeLeft !== null && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 15, color: timeLeft < 300 ? '#ef4444' : 'var(--color-text)', fontFamily: 'monospace' }}>
                            <Clock size={16} /> {formatTime(timeLeft)}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', maxWidth: 900, margin: '0 auto', padding: '32px 24px', width: '100%', gap: 24 }}>
                {/* Question list sidebar */}
                <div style={{ width: 200, flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Questions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {questions.map((_: any, i: number) => (
                            <button key={i} onClick={() => setCurrentQ(i)} style={{
                                padding: '8px 12px', borderRadius: 8, border: '1px solid', textAlign: 'left', cursor: 'pointer', fontSize: 13, fontWeight: currentQ === i ? 600 : 400,
                                borderColor: currentQ === i ? 'var(--color-primary)' : answers[String(questions[i]?.id)] ? 'rgba(16,185,129,0.3)' : 'var(--color-border)',
                                background: currentQ === i ? 'rgba(99,102,241,0.12)' : answers[String(questions[i]?.id)] ? 'rgba(16,185,129,0.05)' : 'var(--color-surface)',
                                color: currentQ === i ? '#818cf8' : answers[String(questions[i]?.id)] ? '#10b981' : 'var(--color-text-muted)',
                            }}>
                                Q{i + 1} <span style={{ fontSize: 10, opacity: 0.7, textTransform: 'capitalize' }}>{questions[i]?.type}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Current question */}
                {q && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <span style={{ fontSize: 12, padding: '4px 10px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: 20, fontWeight: 600, textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {q.type === 'coding' ? <Code2 size={12} /> : <BookOpen size={12} />} {q.type}
                                </span>
                                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Question {currentQ + 1} of {total}</span>
                            </div>
                            <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{q.text}</p>
                        </div>

                        {/* MCQ options */}
                        {q.type === 'mcq' && q.options && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {q.options.map((opt: any) => {
                                    const selected = answers[String(q.id)] === opt.label;
                                    return (
                                        <button key={opt.label} onClick={() => setAnswers(prev => ({ ...prev, [String(q.id)]: opt.label }))}
                                            style={{ textAlign: 'left', padding: '14px 18px', borderRadius: 10, border: `1px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`, background: selected ? 'rgba(99,102,241,0.1)' : 'var(--color-card)', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start', transition: 'all 0.15s' }}>
                                            <span style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${selected ? '#818cf8' : 'var(--color-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: selected ? '#818cf8' : 'var(--color-text-muted)', flexShrink: 0, background: selected ? 'rgba(99,102,241,0.15)' : 'transparent' }}>{opt.label}</span>
                                            <span style={{ fontSize: 14, color: selected ? 'var(--color-text)' : 'var(--color-text-muted)', lineHeight: 1.5 }}>{opt.text}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Coding / open answer */}
                        {(q.type === 'coding' || q.type === 'open' || q.type === 'scenario') && (
                            <textarea
                                value={answers[String(q.id)] || ''}
                                onChange={e => setAnswers(prev => ({ ...prev, [String(q.id)]: e.target.value }))}
                                placeholder={q.type === 'coding' ? 'Write your solution here...' : 'Write your answer here...'}
                                className="input-field"
                                rows={16}
                                style={{ fontFamily: q.type === 'coding' ? 'JetBrains Mono, monospace' : 'inherit', fontSize: q.type === 'coding' ? 13 : 14, resize: 'vertical' }}
                            />
                        )}

                        {/* Nav */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <button className="btn-secondary" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
                                <ChevronLeft size={16} /> Previous
                            </button>
                            {currentQ === total - 1 ? (
                                <button className="btn-primary" onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending} style={{ padding: '10px 24px' }}>
                                    {submitMutation.isPending ? 'Submitting...' : '✅ Submit Assessment'}
                                </button>
                            ) : (
                                <button className="btn-primary" onClick={() => setCurrentQ(Math.min(total - 1, currentQ + 1))}>
                                    Next <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
