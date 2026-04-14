import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
    const { data } = useQuery({ queryKey: ['client-analytics'], queryFn: () => api.get('/api/v1/analytics/client').then(r => r.data) });

    const kpis = data?.kpis || { total_candidates: 0, active_interviews: 0, offers_extended: 0, acceptance_rate: 0 };
    const totalCandidates = kpis.total_candidates;
    const activeInterviews = kpis.active_interviews;
    const offersExtended = kpis.offers_extended;
    const conversionRate = kpis.acceptance_rate;

    const growthVelocity = data?.growth_velocity || [];

    const funnel = data?.funnel || [
        { stage: 'Sourced', count: 0 },
        { stage: 'Applied', count: 0 },
        { stage: 'Screened', count: 0 },
        { stage: 'Interview', count: 0 },
        { stage: 'Offered', count: 0 },
        { stage: 'Hired', count: 0 }
    ];
    const maxFunnel = Math.max(...funnel.map((f: any) => f.count), 1);

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden animate-fadeInUp" style={{
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontFamily: "'Inter', sans-serif"
        }}>
            <style>{`
                .glass-panel {
                    background: var(--color-bg-secondary);
                    border: 1px solid var(--color-border);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
                }
            `}</style>

            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 sm:px-10 lg:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">

                        <header className="glass-panel rounded-2xl flex items-center justify-between whitespace-nowrap px-8 py-4 mb-8">
                            <div className="flex items-center gap-8">
                                <Link to="/client" className="flex items-center gap-4">
                                    <div className="size-6 flex items-center justify-center" style={{ color: 'var(--color-primary)' }}>
                                        <span className="material-symbols-outlined text-3xl">hub</span>
                                    </div>
                                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]" style={{ color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>TopDev</h2>
                                </Link>
                                <label className="flex flex-col min-w-40 !h-10 max-w-64 hidden md:flex">
                                    <div className="flex w-full flex-1 items-stretch rounded-full h-full transition-all" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                                        <div className="flex items-center justify-center pl-4 pr-2" style={{ color: 'var(--color-text-subtle)' }}>
                                            <span className="material-symbols-outlined">search</span>
                                        </div>
                                        <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-full focus:outline-0 focus:ring-0 border-none bg-transparent h-full px-2 text-sm font-medium leading-normal" style={{ color: 'var(--color-text)' }} placeholder="Search data..." />
                                    </div>
                                </label>
                            </div>
                            <div className="flex flex-1 justify-end gap-8">
                                <div className="hidden lg:flex items-center gap-8">
                                    <Link className="text-sm font-bold leading-normal border-b-2 pb-1" style={{ color: 'var(--color-text)', borderColor: 'var(--color-primary)' }} to="/client/analytics">Analytics</Link>
                                    <Link className="transition-colors text-sm font-medium leading-normal" style={{ color: 'var(--color-text-muted)' }} to="/client/jobs/1/candidates">Candidates</Link>
                                    <Link className="transition-colors text-sm font-medium leading-normal" style={{ color: 'var(--color-text-muted)' }} to="/client/jobs">Pipeline</Link>
                                    <Link className="transition-colors text-sm font-medium leading-normal" style={{ color: 'var(--color-text-muted)' }} to="/client/billing">Settings</Link>
                                </div>
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border" style={{ borderColor: 'var(--color-border)', backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-gMf-YyLioTFPShFPlVT7ux51q1_Zx_haV3H1YyQokDAgG--NIeGzbfJ_LxVntiroWuj-MVeJ_tPTC--lpqTUuRNmBYQEBL0jwWFhN3hAA7KAGruwhJ7eVCtCZsNwi9fRWGRK5cPHMuq00xKj0ibb7XoBL1BBUdXetZrSLi8XC3XbNys7UMVPtX2LWYSAdufoN-LvJKURHU3I2_EYKiATrx1qJr01TVMb4tpdjC5RL9we49YB6xv9GAPfHF8iMLtQg4ib38D1qCQ")' }}></div>
                            </div>
                        </header>

                        <div className="flex flex-wrap justify-between items-end gap-4 px-2 mb-8">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-primary)' }}></span>
                                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--color-primary)' }}>Live System</span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-[-0.03em]" style={{ color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>Recruitment Matrix</h1>
                                <p className="text-lg font-medium leading-normal" style={{ color: 'var(--color-text-muted)' }}>Neural-net driven insights on your talent pipeline</p>
                            </div>
                            <button className="btn-primary" style={{ minWidth: '160px' }}>
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                <span className="truncate">Extract Data</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="glass-panel flex flex-col gap-3 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start z-10">
                                    <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                                        <span className="material-symbols-outlined text-[20px]">groups</span>
                                        <p className="text-sm font-medium leading-normal">Total Candidates</p>
                                    </div>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-text-subtle)' }}>more_horiz</span>
                                </div>
                                <div className="z-10 mt-2">
                                    <p className="tracking-tight text-3xl font-black leading-tight" style={{ color: 'var(--color-text)' }}>{totalCandidates.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-primary)' }}>trending_up</span>
                                        <p className="text-sm font-bold leading-normal" style={{ color: 'var(--color-primary)' }}>+12.4% vs last cycle</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'var(--color-primary)', opacity: 0.3 }}></div>
                            </div>
                            <div className="glass-panel flex flex-col gap-3 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start z-10">
                                    <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                                        <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
                                        <p className="text-sm font-medium leading-normal">Active Interviews</p>
                                    </div>
                                </div>
                                <div className="z-10 mt-2">
                                    <p className="tracking-tight text-3xl font-black leading-tight" style={{ color: 'var(--color-text)' }}>{activeInterviews}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-primary)' }}>trending_up</span>
                                        <p className="text-sm font-bold leading-normal" style={{ color: 'var(--color-primary)' }}>+5.2% vs last cycle</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'var(--color-text-muted)', opacity: 0.2 }}></div>
                            </div>
                            <div className="glass-panel flex flex-col gap-3 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start z-10">
                                    <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                                        <span className="material-symbols-outlined text-[20px]">local_activity</span>
                                        <p className="text-sm font-medium leading-normal">Offers Extended</p>
                                    </div>
                                </div>
                                <div className="z-10 mt-2">
                                    <p className="tracking-tight text-3xl font-black leading-tight" style={{ color: 'var(--color-text)' }}>{offersExtended}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-danger)' }}>trending_down</span>
                                        <p className="text-sm font-bold leading-normal" style={{ color: 'var(--color-danger)' }}>-2.1% vs last cycle</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'var(--color-danger)', opacity: 0.3 }}></div>
                            </div>
                            <div className="glass-panel flex flex-col gap-3 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start z-10">
                                    <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                                        <span className="material-symbols-outlined text-[20px]">task_alt</span>
                                        <p className="text-sm font-medium leading-normal">Acceptance Rate</p>
                                    </div>
                                </div>
                                <div className="z-10 mt-2">
                                    <p className="tracking-tight text-3xl font-black leading-tight" style={{ color: 'var(--color-text)' }}>{conversionRate}%</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--color-primary)' }}>trending_up</span>
                                        <p className="text-sm font-bold leading-normal" style={{ color: 'var(--color-primary)' }}>+8.5% vs last cycle</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'var(--color-primary)', opacity: 0.3 }}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                             <div className="lg:col-span-2 glass-panel flex flex-col gap-4 rounded-2xl p-6 relative">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold leading-normal flex items-center gap-2" style={{ color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>
                                            <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--color-primary)' }}>monitoring</span>
                                            Growth Velocity
                                        </h3>
                                        <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-text-muted)' }}>Monthly talent acquisition rate</p>
                                    </div>
                                    <div className="flex rounded-lg p-1 border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                                        <button className="px-3 py-1 rounded-md text-xs font-bold" style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text)' }}>1M</button>
                                        <button className="px-3 py-1 rounded-md text-xs font-bold transition-colors" style={{ color: 'var(--color-text-subtle)' }}>3M</button>
                                        <button className="px-3 py-1 rounded-md text-xs font-bold transition-colors" style={{ color: 'var(--color-text-subtle)' }}>1Y</button>
                                    </div>
                                </div>
                                <div className="flex items-end gap-3 mb-6">
                                    <p className="tracking-tight text-4xl font-black leading-tight truncate" style={{ color: 'var(--color-text)' }}>$1.2M</p>
                                    <div className="flex items-center gap-1 mb-1 px-2 py-1 rounded-md border" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}>
                                        <span className="material-symbols-outlined text-[14px]" style={{ color: 'var(--color-primary)' }}>arrow_upward</span>
                                        <p className="text-xs font-bold leading-normal" style={{ color: 'var(--color-primary)' }}>18.2%</p>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 min-h-[240px] relative mt-4">
                                    <div className="relative w-full h-[240px] z-10">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={growthVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                                <XAxis dataKey="month" stroke="var(--color-text-subtle)" tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                                <YAxis stroke="var(--color-text-subtle)" tick={{ fill: 'var(--color-text-subtle)', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                                                    itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                                                />
                                                <Area type="monotone" dataKey="candidates" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCandidates)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel flex flex-col gap-4 rounded-2xl p-6 relative">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold leading-normal flex items-center gap-2" style={{ color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>
                                        <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--color-text-subtle)' }}>filter_alt</span>
                                        Funnel Conversion
                                    </h3>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-text-subtle)' }}>tune</span>
                                </div>
                                <div className="flex items-end gap-3 mb-6">
                                    <p className="tracking-tight text-4xl font-black leading-tight truncate" style={{ color: 'var(--color-text)' }}>{totalCandidates.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 mb-1">
                                        <p className="text-xs font-bold leading-normal" style={{ color: 'var(--color-text-subtle)' }}>Total Sourced</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 flex-1 justify-center mt-2">
                                    {funnel.map((item: any, idx: number) => {
                                        const percentage = maxFunnel > 0 ? (item.count / maxFunnel) * 100 : 0;
                                        const opacity = 1 - (idx * 0.15);
                                        return (
                                            <div key={item.stage} className="flex items-center gap-4 group">
                                                <div className="w-20 text-right text-xs font-bold transition-colors truncate capitalize" style={{ color: 'var(--color-text-muted)' }}>{item.stage}</div>
                                                <div className="flex-1 h-3 rounded-full overflow-hidden relative" style={{ background: 'var(--color-bg-tertiary)' }}>
                                                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%`, background: 'var(--color-primary)', opacity }}></div>
                                                </div>
                                                <div className="w-10 text-xs font-bold text-right" style={{ color: 'var(--color-text)' }}>{Math.round(percentage)}%</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
