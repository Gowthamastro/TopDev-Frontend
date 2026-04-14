import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function UploadJDPage() {
    const [title, setTitle] = useState('');
    const [jdText, setJdText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) setFile(f);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) { toast.error('Please enter a role title'); return; }
        if (!jdText.trim() && !file) { toast.error('Please paste JD text or upload a file'); return; }
        setLoading(true);
        try {
            // Use postForm for cleaner multipart/form-data handling
            const res = await api.postForm('/api/v1/jobs/upload', {
                title,
                jd_text: jdText,
                ...(file && { file })
            });
            toast.success(`Assessment generated successfully!`);
            navigate('/client/jobs');
        } catch (err: any) {
            console.error('Upload error:', err);
            const detail = err.response?.data?.detail;
            const message = typeof detail === 'string' 
                ? detail 
                : (Array.isArray(detail) ? detail[0]?.msg : 'Upload failed');
            toast.error(message || 'Upload failed. Please ensure you are logged in.');
        } finally { setLoading(false); }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] animate-fadeInUp">
            <style>{`
                .glass-card {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
                }
                .input-glow:focus {
                    border-color: var(--color-primary);
                }
            `}</style>
            
            <div className="w-full max-w-3xl glass-card rounded-[2rem] p-10 relative overflow-hidden" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                <div className="relative z-10">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                            <span className="material-symbols-outlined text-4xl">auto_awesome</span>
                        </div>
                        <h1 className="text-3xl font-black text-primary mb-3" style={{ color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>Assessment Core</h1>
                        <p className="text-secondary text-lg max-w-md" style={{ color: 'var(--color-text-muted)' }}>Our AI parses your JD to craft precise technical benchmarks in seconds.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title Input */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold tracking-widest pl-1 uppercase" style={{ color: 'var(--color-text-muted)' }}>Role Architecture</label>
                            <input 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                className="w-full h-14 rounded-xl border px-5 outline-none transition-all input-glow"
                                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                placeholder="e.g. Senior Full-Stack Lead (TypeScript & Node.js)" 
                            />
                        </div>

                        {/* Text Area */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold tracking-widest pl-1 uppercase" style={{ color: 'var(--color-text-muted)' }}>Job Context / Raw Text</label>
                            <textarea
                                value={jdText}
                                onChange={e => setJdText(e.target.value)}
                                className="w-full rounded-xl p-5 outline-none transition-all input-glow min-h-[180px] font-mono text-sm leading-relaxed"
                                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                placeholder="Paste the technical requirements or full JD here..."
                                rows={8}
                            />
                        </div>

                        {/* File Upload */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold tracking-widest pl-1 uppercase" style={{ color: 'var(--color-text-muted)' }}>Document Ingestion (Optional)</label>
                            <div
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className={`group relative border-2 border-dashed rounded-2xl p-8 py-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                                    dragOver ? 'border-primary bg-primary-thin' : 'border-border bg-transparent hover:border-text-muted'
                                }`}
                                style={{ borderColor: dragOver ? 'var(--color-primary)' : 'var(--color-border)', background: dragOver ? 'var(--color-bg-tertiary)' : 'transparent' }}
                            >
                                {file ? (
                                    <div className="flex items-center gap-4 px-4 py-2 rounded-lg border" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-primary)' }}>
                                        <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>description</span>
                                        <span className="text-sm font-medium truncate max-w-[200px]" style={{ color: 'var(--color-text)' }}>{file.name}</span>
                                        <button 
                                            type="button" 
                                            onClick={e => { e.stopPropagation(); setFile(null); }} 
                                            className="p-1 rounded-full transition-all"
                                            style={{ color: 'var(--color-text-muted)' }}
                                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-danger)'; e.currentTarget.style.background = 'var(--color-bg-secondary)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
                                            <span className="material-symbols-outlined text-2xl">upload_file</span>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Drag & drop or <span style={{ color: 'var(--color-primary)' }} className="hover:underline">browse files</span></p>
                                            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>PDF, DOCX, or TXT (Max 10MB)</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
                        </div>

                        {/* Progress Note */}
                        <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                            <span className="material-symbols-outlined text-primary text-[20px] animate-pulse" style={{ color: 'var(--color-primary)' }}>info</span>
                            <div className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                <strong className="text-primary block mb-1" style={{ color: 'var(--color-text)' }}>AI Engine Analysis</strong>
                                Our neural parser will identify tech stacks, seniority, and soft-skill requirements to build a zero-bias evaluation sandbox.
                            </div>
                        </div>

                        {/* Submit */}
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                                loading 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:scale-[1.01] active:scale-[0.98]'
                            }`}
                            style={{ 
                                background: 'var(--color-primary)', 
                                color: 'var(--color-bg)',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
                                    <span>Synthesizing Assessment...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                                    <span>Initialize Generation</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

