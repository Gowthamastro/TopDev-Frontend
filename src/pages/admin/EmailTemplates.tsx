import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import api from '../../services/api';

export default function AdminEmailTemplates() {
    const qc = useQueryClient();
    const { data: templates } = useQuery({ queryKey: ['email-templates'], queryFn: () => api.get('/api/v1/admin/email-templates').then(r => r.data) });
    const [selected, setSelected] = useState(0);
    const [edits, setEdits] = useState<Record<string, { subject: string; html_body: string }>>({});

    const mutation = useMutation({
        mutationFn: ({ slug, data }: { slug: string; data: any }) => api.put(`/api/v1/admin/email-templates/${slug}`, data),
        onSuccess: () => { toast.success('Template saved!'); qc.invalidateQueries({ queryKey: ['email-templates'] }); },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Save failed'),
    });

    const t = (templates || [])[selected];
    const getEdit = (slug: string, field: 'subject' | 'html_body', fallback: string) =>
        edits[slug]?.[field] !== undefined ? edits[slug][field] : fallback;

    const setField = (slug: string, field: 'subject' | 'html_body', value: string) =>
        setEdits(prev => ({ ...prev, [slug]: { ...prev[slug], subject: t?.subject, html_body: t?.html_body, ...prev[slug], [field]: value } }));

    if (!templates?.length) return <div style={{ padding: 32, color: 'var(--color-text-muted)' }}>Loading templates...</div>;

    return (
        <div style={{ padding: 32, maxWidth: 1000 }} className="animate-fadeInUp">
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Email Templates</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: 14 }}>Edit transactional email templates. Use {`{{variable}}`} syntax for dynamic content.</p>

            <div style={{ display: 'inline-flex', gap: 0, marginBottom: 24, background: 'var(--color-surface)', borderRadius: 8, padding: 4, border: '1px solid var(--color-border)' }}>
                {templates.map((tp: any, i: number) => (
                    <button key={tp.slug} onClick={() => setSelected(i)} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: selected === i ? 'var(--color-card)' : 'transparent', color: selected === i ? 'var(--color-text)' : 'var(--color-text-muted)', borderColor: selected === i ? 'var(--color-border)' : 'transparent' }}>
                        {tp.name}
                    </button>
                ))}
            </div>

            {t && (
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 8 }}>Subject line</label>
                        <input value={getEdit(t.slug, 'subject', t.subject)} onChange={e => setField(t.slug, 'subject', e.target.value)} className="input-field" />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-muted)' }}>HTML Body</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {(t.variables || []).map((v: string) => (
                                    <span key={v} style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: 4, fontFamily: 'monospace', cursor: 'pointer' }}
                                        onClick={() => { const el = document.getElementById('html-editor') as HTMLTextAreaElement; if (el) { const pos = el.selectionStart; const val = getEdit(t.slug, 'html_body', t.html_body); setField(t.slug, 'html_body', val.slice(0, pos) + `{{${v}}}` + val.slice(pos)); } }}
                                    >{`{{${v}}}`}</span>
                                ))}
                            </div>
                        </div>
                        <textarea
                            id="html-editor"
                            value={getEdit(t.slug, 'html_body', t.html_body)}
                            onChange={e => setField(t.slug, 'html_body', e.target.value)}
                            className="input-field"
                            rows={18}
                            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <button className="btn-primary" onClick={() => mutation.mutate({ slug: t.slug, data: { subject: getEdit(t.slug, 'subject', t.subject), html_body: getEdit(t.slug, 'html_body', t.html_body) } })} disabled={mutation.isPending}>
                            <Save size={14} /> {mutation.isPending ? 'Saving...' : 'Save Template'}
                        </button>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>Click a variable tag above to insert it at cursor position</p>
                    </div>
                </div>
            )}
        </div>
    );
}
