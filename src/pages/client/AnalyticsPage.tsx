import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

const BADGE_COLORS: Record<string, string> = { elite: '#f59e0b', strong: '#6366f1', qualified: '#10b981', below_threshold: '#334155' };

export default function AnalyticsPage() {
    const { data } = useQuery({ queryKey: ['client-analytics'], queryFn: () => api.get('/api/v1/analytics/client').then(r => r.data) });

    const pieData = [
        { name: 'Qualified', value: data?.qualified_candidates || 0, fill: '#10b981' },
        { name: 'Not Qualified', value: (data?.total_candidates_assessed || 0) - (data?.qualified_candidates || 0), fill: '#1e1e2e' },
    ];

    const barData = [
        { name: 'Total Roles', value: data?.total_roles || 0 },
        { name: 'Total Assessed', value: data?.total_candidates_assessed || 0 },
        { name: 'Qualified', value: data?.qualified_candidates || 0 },
    ];

    const customTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload?.length) return null;
        return <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}><div style={{ fontWeight: 600 }}>{label}</div><div style={{ color: '#818cf8' }}>{payload[0].value}</div></div>;
    };

    return (
        <div style={{ padding: 32, maxWidth: 1100 }} className="animate-fadeInUp">
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>Analytics</h1>
            <p style={{ color: 'var(--color-text-muted)', margin: '0 0 28px', fontSize: 14 }}>Recruitment funnel performance metrics.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total Roles', value: data?.total_roles ?? '—' },
                    { label: 'Candidates Assessed', value: data?.total_candidates_assessed ?? '—' },
                    { label: 'Qualified', value: data?.qualified_candidates ?? '—' },
                    { label: 'Avg Score', value: data?.average_score ? `${data.average_score}` : '—' },
                ].map(d => (
                    <div key={d.label} className="stat-card">
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{d.label}</span>
                        <span style={{ fontSize: 28, fontWeight: 700 }}>{d.value}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="card">
                    <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 20px', color: 'var(--color-text-muted)' }}>Recruitment Funnel</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={barData} barSize={40}>
                            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip content={customTooltip} />
                            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 20px', color: 'var(--color-text-muted)', alignSelf: 'flex-start' }}>Qualification Rate</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                                {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ fontSize: 28, fontWeight: 700, marginTop: -20, color: '#818cf8' }}>
                        {data?.conversion_rate?.toFixed(1) || 0}%
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Conversion Rate</div>
                </div>
            </div>
        </div>
    );
}
