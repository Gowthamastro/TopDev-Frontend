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
                    background: rgba(19, 19, 22, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
                }
                .input-glow:focus {
                    box-shadow: 0 0 15px rgba(13, 89, 242, 0.3);
                    border-color: rgba(13, 89, 242, 0.5);
                }
                .glow-text-primary {
                    text-shadow: 0 0 12px rgba(13, 89, 242, 0.4);
                }
            `}</style>
            
            <div className="w-full max-w-3xl glass-card rounded-[2rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0d59f2]/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] -ml-24 -mb-24"></div>

                <div className="relative z-10">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#0d59f2]/10 border border-[#0d59f2]/20 flex items-center justify-center text-[#0d59f2] mb-6 shadow-[0_0_20px_rgba(13,89,242,0.2)]">
                            <span className="material-symbols-outlined text-4xl">auto_awesome</span>
                        </div>
                        <h1 className="text-3xl font-black text-white glow-text-primary mb-3">Assessment Core</h1>
                        <p className="text-[#8b94a5] text-lg max-w-md">Our AI parses your JD to craft precise technical benchmarks in seconds.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title Input */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest pl-1">Role Architecture</label>
                            <input 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                className="w-full h-14 bg-[#131316]/80 rounded-xl border border-[#232328] px-5 text-white placeholder-[#475569] outline-none transition-all input-glow"
                                placeholder="e.g. Senior Full-Stack Lead (TypeScript & Node.js)" 
                            />
                        </div>

                        {/* Text Area */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest pl-1">Job Context / Raw Text</label>
                            <textarea
                                value={jdText}
                                onChange={e => setJdText(e.target.value)}
                                className="w-full bg-[#131316]/80 rounded-xl border border-[#232328] p-5 text-white placeholder-[#475569] outline-none transition-all input-glow min-h-[180px] font-mono text-sm leading-relaxed"
                                placeholder="Paste the technical requirements or full JD here..."
                                rows={8}
                            />
                        </div>

                        {/* File Upload */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest pl-1">Document Ingestion (Optional)</label>
                            <div
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className={`group relative border-2 border-dashed rounded-2xl p-8 py-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                                    dragOver ? 'border-[#0d59f2] bg-[#0d59f2]/5 shadow-[0_0_20px_rgba(13,89,242,0.1)]' : 'border-[#232328] bg-[#131316]/40 hover:border-[#475569] hover:bg-[#131316]/60'
                                }`}
                            >
                                {file ? (
                                    <div className="flex items-center gap-4 px-4 py-2 bg-[#0d59f2]/10 rounded-lg border border-[#0d59f2]/30">
                                        <span className="material-symbols-outlined text-[#0d59f2]">description</span>
                                        <span className="text-sm text-white font-medium truncate max-w-[200px]">{file.name}</span>
                                        <button 
                                            type="button" 
                                            onClick={e => { e.stopPropagation(); setFile(null); }} 
                                            className="p-1 hover:bg-[#0d59f2]/20 rounded-full text-[#8b94a5] hover:text-[#0d59f2] transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-[#1f2633] flex items-center justify-center text-[#8b94a5] group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-2xl">upload_file</span>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-slate-300 font-medium">Drag & drop or <span className="text-[#0d59f2] group-hover:underline">browse files</span></p>
                                            <p className="text-xs text-[#475569] mt-1">PDF, DOCX, or TXT (Max 10MB)</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
                        </div>

                        {/* Progress Note */}
                        <div className="flex items-start gap-4 p-5 bg-[#0d59f2]/5 border border-[#0d59f2]/10 rounded-2xl">
                            <span className="material-symbols-outlined text-[#0d59f2] text-[20px] animate-pulse">info</span>
                            <div className="text-xs leading-relaxed text-[#8b94a5]">
                                <strong className="text-slate-100 block mb-1">AI Engine Analysis</strong>
                                Our neural parser will identify tech stacks, seniority, and soft-skill requirements to build a zero-bias evaluation sandbox.
                            </div>
                        </div>

                        {/* Submit */}
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                                loading 
                                ? 'bg-[#1f2633] text-[#475569]' 
                                : 'bg-[#0d59f2] text-white hover:bg-[#1a67f5] shadow-[0_4px_20px_rgba(13,89,242,0.4)] active:scale-[0.98]'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[#475569] border-t-white rounded-full animate-spin"></div>
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

