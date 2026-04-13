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
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeInUp">
            <div className="bg-[#0d1016] border border-[#1e2433] rounded-2xl max-w-lg w-full shadow-2xl shadow-black/40 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0d59f2]/20 to-emerald-500/10 px-8 pt-8 pb-6 border-b border-[#1e2433]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#0d59f2]/20 border border-[#0d59f2]/30 flex items-center justify-center">
                            <Shield className="text-[#0d59f2]" size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Assessment Integrity</h2>
                            <p className="text-sm text-slate-400">Fair assessment monitoring</p>
                        </div>
                    </div>
                    {candidateName && (
                        <p className="text-sm text-slate-300">
                            Welcome, <span className="text-white font-medium">{candidateName}</span>. Before you begin, please review our assessment monitoring policy.
                        </p>
                    )}
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-5">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        To ensure fairness for all candidates, this assessment includes optional behavioral monitoring. Here's what we track:
                    </p>

                    <div className="space-y-3">
                        {[
                            { icon: <MonitorX size={18} />, label: 'Tab & Window Switches', desc: 'When you navigate away from the test window' },
                            { icon: <Clipboard size={18} />, label: 'Copy & Paste Activity', desc: 'Large text copied from external sources' },
                            { icon: <Eye size={18} />, label: 'Focus Tracking', desc: 'When the browser window loses or regains focus' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                <div className="mt-0.5 text-[#0d59f2]">{item.icon}</div>
                                <div>
                                    <p className="text-sm font-medium text-white">{item.label}</p>
                                    <p className="text-xs text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                        <p className="text-xs text-amber-300/90 leading-relaxed">
                            <strong>Your choice matters:</strong> You may decline monitoring and still take the assessment. However, your submission will be flagged as "unmonitored" for the recruiter's review.
                        </p>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={acknowledged}
                            onChange={(e) => setAcknowledged(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-slate-600 bg-[#11141c] text-[#0d59f2] focus:ring-[#0d59f2] focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                            I understand that behavioral data may be collected to ensure assessment integrity.
                        </span>
                    </label>
                </div>

                {/* Actions */}
                <div className="px-8 pb-8 flex gap-3">
                    <button
                        onClick={onDecline}
                        className="flex-1 py-3 px-4 rounded-xl text-sm font-medium border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <XCircle size={16} />
                        Decline & Continue
                    </button>
                    <button
                        onClick={onAccept}
                        disabled={!acknowledged}
                        className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-[#0d59f2] text-white hover:bg-[#1a67f5] transition-all shadow-[0_0_20px_rgba(13,89,242,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 size={16} />
                        Accept & Start
                    </button>
                </div>
            </div>
        </div>
    );
}
