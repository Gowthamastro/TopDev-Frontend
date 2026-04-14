import { useState } from 'react';
import { Shield, Eye, Clipboard, MonitorX, CheckCircle2, XCircle } from 'lucide-react';

interface ProctoringConsentProps {
    onAccept: () => void;
    onDecline: () => void;
    candidateName?: string;
}

export default function ProctoringConsent({ onAccept, onDecline, candidateName }: ProctoringConsentProps) {
    const [acknowledged, setAcknowledged] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeInUp">
            <div className="rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center border" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}>
                            <Shield style={{ color: 'var(--color-primary)' }} size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>Assessment Integrity</h2>
                            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Fair assessment monitoring</p>
                        </div>
                    </div>
                    {candidateName && (
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            Welcome, <span style={{ color: 'var(--color-text)', fontBold: 'bold' }}>{candidateName}</span>. Before you begin, please review our assessment monitoring policy.
                        </p>
                    )}
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-5">
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                        To ensure fairness for all candidates, this assessment includes optional behavioral monitoring. Here's what we track:
                    </p>

                    <div className="space-y-3">
                        {[
                            { icon: <MonitorX size={18} />, label: 'Tab & Window Switches', desc: 'When you navigate away from the test window' },
                            { icon: <Clipboard size={18} />, label: 'Copy & Paste Activity', desc: 'Large text copied from external sources' },
                            { icon: <Eye size={18} />, label: 'Focus Tracking', desc: 'When the browser window loses or regains focus' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}>
                                <div className="mt-0.5" style={{ color: 'var(--color-primary)' }}>{item.icon}</div>
                                <div>
                                    <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{item.label}</p>
                                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border rounded-xl p-4" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                            <strong>Your choice matters:</strong> You may decline monitoring and still take the assessment. However, your submission will be flagged as "unmonitored" for the recruiter's review.
                        </p>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={acknowledged}
                            onChange={(e) => setAcknowledged(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded"
                            style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', accentColor: 'var(--color-primary)' }}
                        />
                        <span className="text-sm transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                            I understand that behavioral data may be collected to ensure assessment integrity.
                        </span>
                    </label>
                </div>

                {/* Actions */}
                <div className="px-8 pb-8 flex gap-3">
                    <button
                        onClick={onDecline}
                        className="btn-secondary flex-1 py-3 px-4 flex items-center justify-center gap-2"
                    >
                        <XCircle size={16} />
                        Decline
                    </button>
                    <button
                        onClick={onAccept}
                        disabled={!acknowledged}
                        className="btn-primary flex-1 py-3 px-4 flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 size={16} />
                        Accept & Start
                    </button>
                </div>
            </div>
        </div>
    );
}
