import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { CheckCircle2, TrendingUp, Clock, Award, ArrowLeft, Loader2 } from 'lucide-react';

function ScoreCircle({ score, animated }: { score: number; animated: boolean }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 90 ? '#f59e0b' : score >= 75 ? '#a78bfa' : score >= 60 ? '#10b981' : '#6b7280';

    return (
        <div style={{ position: 'relative', width: 144, height: 144, margin: '0 auto' }}>
            <svg width="144" height="144" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="72" cy="72" r={radius} fill="none" stroke="#1e2433" strokeWidth="10" />
                <circle
                    cx="72" cy="72" r={radius}
                    fill="none" stroke={color} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={animated ? offset : circumference}
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 8px ${color}60)` }}
                />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{score}</span>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>/ 100</span>
            </div>
        </div>
    );
}

function ScoreBreakdownBar({ label, value, color }: { label: string; value: number | null; color: string }) {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setWidth(value ?? 0), 300);
        return () => clearTimeout(t);
    }, [value]);

    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifycontent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                    {value != null ? `${value}%` : '—'}
                </span>
            </div>
            <div className="score-bar-track">
                <div style={{ height: '100%', borderRadius: 99, background: color, width: `${width}%`, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
        </div>
    );
}

function getBadgeConfig(badge: string | null) {
    const map: Record<string, { icon: string; label: string; color: string; bg: string; desc: string }> = {
        elite:           { icon: '🏆', label: 'Top Tier',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', desc: 'Top 10% of candidates — exceptional performance!' },
        strong:          { icon: '⚡', label: 'Strong',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', desc: 'Above average — strong technical fundamentals.' },
        qualified:       { icon: '✅', label: 'Qualified', color: '#10b981', bg: 'rgba(16,185,129,0.12)', desc: 'Meets the bar — solid candidate for this role.' },
        below_threshold: { icon: '📈', label: 'Keep Going', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', desc: 'Below threshold — but every attempt sharpens your skills.' },
    };
    return badge ? (map[badge] || null) : null;
}

export default function ResultsPage() {
    const { attemptId } = useParams<{ attemptId: string }>();
    const navigate = useNavigate();
    const [animated, setAnimated] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['results', attemptId],
        queryFn: async () => {
            const res = await api.get(`/api/v1/candidates/results/${attemptId}`);
            return res.data;
        },
        // Poll every 4s until scored
        refetchInterval: (query) => {
            const d = query.state.data as any;
            if (d?.status === 'scored') return false;
            return 4000;
        },
        retry: 2,
    });

    useEffect(() => {
        if (data?.status === 'scored') {
            const t = setTimeout(() => setAnimated(true), 200);
            return () => clearTimeout(t);
        }
    }, [data?.status]);

    const isScored = data?.status === 'scored';
    const isSubmitted = data?.status === 'submitted';
    const badge = getBadgeConfig(data?.rating_badge);

    if (isLoading) return (
        <div style={{ minHeight: '100vh', background: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <Loader2 size={40} color="#0d59f2" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#94a3b8', fontSize: 15 }}>Loading your results…</p>
        </div>
    );

    if (error) return (
        <div style={{ minHeight: '100vh', background: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#f85149', fontSize: 15 }}>Could not load results. The attempt may not exist.</p>
            <button className="btn-secondary" onClick={() => navigate('/candidate')}>Go to Dashboard</button>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#0a0c10', color: '#f1f5f9', fontFamily: "'Inter', sans-serif", padding: '0 20px 60px' }}>
            {/* Header */}
            <header style={{ borderBottom: '1px solid #1e2433', background: 'rgba(13,16,22,0.95)', backdropFilter: 'blur(12px)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
                <button
                    onClick={() => navigate('/candidate')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, padding: '6px 12px', borderRadius: 8, transition: 'all 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#f1f5f9'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'}
                >
                    <ArrowLeft size={16} /> Dashboard
                </button>
                <div style={{ width: 1, height: 20, background: '#1e2433' }} />
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#0d59f2' }}>code_blocks</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>Assessment Results</span>
            </header>

            <div style={{ maxWidth: 720, margin: '48px auto 0' }}>
                {/* Scoring in progress */}
                {isSubmitted && (
                    <div className="card" style={{ padding: 48, textAlign: 'center', marginBottom: 24 }}>
                        <div style={{ width: 56, height: 56, border: '4px solid #1e2433', borderTopColor: '#0d59f2', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: '#f1f5f9' }}>AI is scoring your submission</h2>
                        <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: 14 }}>
                            This usually takes 15–30 seconds. This page will update automatically.
                        </p>
                    </div>
                )}

                {/* Submitted confirmation always shown */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 64, height: 64,
                        background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
                        borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                    }}>
                        <CheckCircle2 size={28} color="#10b981" />
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px' }}>
                        {isScored ? 'Your results are in!' : 'Assessment submitted!'}
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 15, margin: 0 }}>
                        {isScored
                            ? 'Here\'s how you performed on this assessment.'
                            : 'Your answers have been received. Scoring in progress…'}
                    </p>
                </div>

                {/* Score (only when scored) */}
                {isScored && (
                    <>
                        {/* Badge */}
                        {badge && (
                            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 24px', borderRadius: 40, background: badge.bg, border: `1px solid ${badge.color}30` }}>
                                    <span style={{ fontSize: 22 }}>{badge.icon}</span>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: badge.color }}>{badge.label}</div>
                                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{badge.desc}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Score Circle */}
                        <div className="card" style={{ padding: 40, textAlign: 'center', marginBottom: 20 }}>
                            <ScoreCircle score={Math.round(data.total_score ?? 0)} animated={animated} />
                            <div style={{ marginTop: 20 }}>
                                <div style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 4 }}>Overall Score</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>
                                    {Math.round(data.total_score ?? 0)}%
                                </div>
                                {data.is_qualified && (
                                    <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20 }}>
                                        <CheckCircle2 size={14} color="#10b981" />
                                        <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>Qualified for this role</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="card" style={{ padding: 32, marginBottom: 20 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <TrendingUp size={17} color="#0d59f2" /> Performance Breakdown
                            </h2>
                            <ScoreBreakdownBar label="Technical Skills" value={data.technical_score != null ? Math.round(data.technical_score) : null} color="#0d59f2" />
                            <ScoreBreakdownBar label="Communication" value={data.communication_score != null ? Math.round(data.communication_score) : null} color="#a78bfa" />
                            <ScoreBreakdownBar label="Cultural Fit" value={data.cultural_fit_score != null ? Math.round(data.cultural_fit_score) : null} color="#10b981" />
                        </div>

                        {/* AI Feedback */}
                        {data.ai_feedback && (
                            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
                                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Award size={17} color="#f59e0b" /> AI Feedback
                                </h2>
                                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                                    {data.ai_feedback}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* CTA */}
                <div style={{ display: 'flex', justifycontent: 'center', gap: 12 }}>
                    <button className="btn-primary" onClick={() => navigate('/candidate')} style={{ padding: '12px 28px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
