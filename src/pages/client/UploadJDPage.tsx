import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Upload, FileText, Sparkles, X } from 'lucide-react';
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
            const fd = new FormData();
            fd.append('title', title);
            fd.append('jd_text', jdText);
            if (file) fd.append('file', file);
            const res = await api.post('/api/v1/jobs/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success(`Assessment generated with ${res.data.questions_generated} questions!`);
            navigate('/client/jobs');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Upload failed');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ padding: 32, maxWidth: 800 }} className="animate-fadeInUp">
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Post a New Role</h1>
                <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: 14 }}>Upload your job description — AI will parse it and generate a custom technical assessment automatically.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="card">
                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 8 }}>Role Title *</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} className="input-field" placeholder="e.g. Senior Backend Engineer (Python)" />
                </div>

                <div className="card">
                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 8 }}>Job Description</label>
                    <textarea
                        value={jdText}
                        onChange={e => setJdText(e.target.value)}
                        className="input-field"
                        placeholder="Paste the full job description here..."
                        rows={10}
                        style={{ resize: 'vertical', fontFamily: 'inherit', minHeight: 200 }}
                    />
                </div>

                <div className="card">
                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 12 }}>Or upload JD file (PDF / DOCX)</label>
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        style={{
                            border: `2px dashed ${dragOver ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            borderRadius: 10, padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
                            background: dragOver ? 'rgba(99,102,241,0.06)' : 'var(--color-surface)',
                            transition: 'all 0.2s',
                        }}
                    >
                        {file ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                <FileText size={20} color="#818cf8" />
                                <span style={{ fontSize: 14, color: 'var(--color-text)' }}>{file.name}</span>
                                <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Upload size={28} color="var(--color-text-subtle)" style={{ marginBottom: 8 }} />
                                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>Drag & drop or click to upload</p>
                                <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', margin: '4px 0 0' }}>PDF, DOC, DOCX up to 10MB</p>
                            </>
                        )}
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" onChange={e => setFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
                </div>

                {/* AI note */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10 }}>
                    <Sparkles size={16} color="#818cf8" style={{ marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
                        <strong style={{ color: '#818cf8' }}>AI-powered parsing:</strong> The system will auto-extract skills, experience requirements, and seniority, then generate a custom assessment with MCQ, coding, and scenario questions.
                    </p>
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
                    {loading ? '⚡ Generating assessment...' : '✨ Upload & Generate Assessment'}
                </button>
            </form>
        </div>
    );
}
