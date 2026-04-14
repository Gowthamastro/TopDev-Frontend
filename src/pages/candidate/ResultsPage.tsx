import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { CheckCircle2, TrendingUp, Award, ArrowLeft, Loader2 } from 'lucide-react';

function ScoreCircle({ score, animated }: { score: number; animated: boolean }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 90 ? '#000' : score >= 75 ? '#333' : score >= 60 ? '#666' : '#999';

    return (
        <div style={{ position: 'relative', width: 144, height: 144, margin: '0 auto' }}>
            <svg width="144" height="144" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="72" cy="72" r={radius} fill="none" stroke="#F0F0F0" strokeWidth="10" />
                <circle
                    cx="72" cy="72" r={radius}
                    fill="none" stroke={color} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={animated ? offset : circumference}
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: '#000', lineHeight: 1, fontFamily: "'Manrope', sans-serif" }}>{score}</span>
                <span style={{ fontSize: 13, color: '#999', fontWeight: 500 }}>/ 100</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>
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
        elite:           { icon: '🏆', label: 'Top Tier',   color: '#000', bg: 'rgba(0,0,0,0.04)', desc: 'Top 10% of candidates — exceptional performance!' },
        strong:          { icon: '⚡', label: 'Strong',  color: '#333', bg: 'rgba(0,0,0,0.03)', desc: 'Above average — strong technical fundamentals.' },
        qualified:       { icon: '✅', label: 'Qualified', color: '#666', bg: 'rgba(0,0,0,0.02)', desc: 'Meets the bar — solid candidate for this role.' },
        below_threshold: { icon: '📈', label: 'Keep Going', color: '#999', bg: 'rgba(0,0,0,0.015)', desc: 'Below threshold — but every attempt sharpens your skills.' },
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
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <Loader2 size={40} color="#000" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#666', fontSize: 15 }}>Loading your results…</p>
        </div>
    );

    if (error) return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#dc2626', fontSize: 15 }}>Could not load results. The attempt may not exist.</p>
            <button className="btn-secondary" onClick={() => navigate('/candidate')}>Go to Dashboard</button>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#000', fontFamily: "'Inter', sans-serif", padding: '0 20px 60px' }}>
            {/* Header */}
            <header style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
                <button
                    onClick={() => navigate('/candidate')}
                    style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, padding: '6px 12px', borderRadius: 8, transition: 'all 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#000'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#666'}
                >
                    <ArrowLeft size={16} /> Dashboard
                </button>
                <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.08)' }} />
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#000' }}>code_blocks</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#000', fontFamily: "'Manrope', sans-serif" }}>Assessment Results</span>
            </header>

            <div style={{ maxWidth: 720, margin: '48px auto 0' }}>
                {/* Scoring in progress */}
                {isSubmitted && (
                    <div className="card float-card" style={{ padding: 48, textAlign: 'center', marginBottom: 24 }}>
                        <div style={{ width: 56, height: 56, border: '4px solid #F0F0F0', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: '#000', fontFamily: "'Manrope', sans-serif" }}>AI is scoring your submission</h2>
                        <p style={{ color: '#666', margin: 0, fontSize: 14 }}>
                            This usually takes 15–30 seconds. This page will update automatically.
                        </p>
                    </div>
                )}

                {/* Submitted confirmation always shown */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 64, height: 64,
                        background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                    }}>
                        <CheckCircle2 size={28} color="#000" />
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px', fontFamily: "'Manrope', sans-serif" }}>
                        {isScored ? 'Your results are in!' : 'Assessment submitted!'}
                    </h1>
                    <p style={{ color: '#666', fontSize: 15, margin: 0 }}>
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
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 24px', borderRadius: 9999, background: badge.bg, border: `1px solid rgba(0,0,0,0.08)` }}>
                                    <span style={{ fontSize: 22 }}>{badge.icon}</span>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: 16, fontWeight: 800, color: badge.color, fontFamily: "'Manrope', sans-serif" }}>{badge.label}</div>
                                        <div style={{ fontSize: 12, color: '#666' }}>{badge.desc}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Score Circle */}
                        <div className="card float-card" style={{ padding: 40, textAlign: 'center', marginBottom: 20 }}>
                            <ScoreCircle score={Math.round(data.total_score ?? 0)} animated={animated} />
                            <div style={{ marginTop: 20 }}>
                                <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Overall Score</div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: '#000', fontFamily: "'Manrope', sans-serif" }}>
                                    {Math.round(data.total_score ?? 0)}%
                                </div>
                                {data.is_qualified && (
                                    <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 9999 }}>
                                        <CheckCircle2 size={14} color="#000" />
                                        <span style={{ fontSize: 13, color: '#000', fontWeight: 600 }}>Qualified for this role</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="card" style={{ padding: 32, marginBottom: 20 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#000', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Manrope', sans-serif" }}>
                                <TrendingUp size={17} color="#000" /> Performance Breakdown
                            </h2>
                            <ScoreBreakdownBar label="Technical Skills" value={data.technical_score != null ? Math.round(data.technical_score) : null} color="#000" />
                            <ScoreBreakdownBar label="Communication" value={data.communication_score != null ? Math.round(data.communication_score) : null} color="#666" />
                            <ScoreBreakdownBar label="Cultural Fit" value={data.cultural_fit_score != null ? Math.round(data.cultural_fit_score) : null} color="#999" />
                        </div>

                        {/* AI Feedback */}
                        {data.ai_feedback && (
                            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
                                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#000', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Manrope', sans-serif" }}>
                                    <Award size={17} color="#000" /> AI Feedback
                                </h2>
                                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                                    {data.ai_feedback}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* CTA */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                    <button className="btn-primary" onClick={() => navigate('/candidate')} style={{ padding: '12px 28px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
