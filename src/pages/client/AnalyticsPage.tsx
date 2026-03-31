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
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-[#0A0A0C] text-slate-100 font-display animate-fadeInUp" style={{
            backgroundImage: `radial-gradient(circle at 15% 50%, rgba(13, 89, 242, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(189, 0, 255, 0.05), transparent 25%)`,
            backgroundAttachment: 'fixed'
        }}>
            <style>{`
                .glass-panel {
                    background: rgba(19, 19, 22, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }
                .glow-text {
                    text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
                }
            `}</style>

            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 sm:px-10 lg:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">

                        <header className="glass-panel rounded-2xl flex items-center justify-between whitespace-nowrap px-8 py-4 mb-8">
                            <div className="flex items-center gap-8">
                                <Link to="/client" className="flex items-center gap-4 text-white">
                                    <div className="size-6 text-[#00f0ff] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl">hub</span>
                                    </div>
                                    <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] glow-text">TopDev</h2>
                                </Link>
                                <label className="flex flex-col min-w-40 !h-10 max-w-64 hidden md:flex">
                                    <div className="flex w-full flex-1 items-stretch rounded-full h-full bg-[#131316] border border-[#232328] focus-within:border-[#0d59f2] focus-within:ring-1 focus-within:ring-[#0d59f2] transition-all">
                                        <div className="text-slate-400 flex items-center justify-center pl-4 pr-2">
                                            <span className="material-symbols-outlined">search</span>
                                        </div>
                                        <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-full text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-500 px-2 text-sm font-medium leading-normal" placeholder="Search data..." />
                                    </div>
                                </label>
                            </div>
                            <div className="flex flex-1 justify-end gap-8">
                                <div className="hidden lg:flex items-center gap-8">
                                    <Link className="text-white text-sm font-bold leading-normal border-b-2 border-[#00f0ff] pb-1" to="/client/analytics">Analytics</Link>
                                    <Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium leading-normal" to="/client/jobs/1/candidates">Candidates</Link>
                                    <Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium leading-normal" to="/client/jobs">Pipeline</Link>
                                    <Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium leading-normal" to="/client/billing">Settings</Link>
                                </div>
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-[#0d59f2]/50" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-gMf-YyLioTFPShFPlVT7ux51q1_Zx_haV3H1YyQokDAgG--NIeGzbfJ_LxVntiroWuj-MVeJ_tPTC--lpqTUuRNmBYQEBL0jwWFhN3hAA7KAGruwhJ7eVCtCZsNwi9fRWGRK5cPHMuq00xKj0ibb7XoBL1BBUdXetZrSLi8XC3XbNys7UMVPtX2LWYSAdufoN-LvJKURHU3I2_EYKiATrx1qJr01TVMb4tpdjC5RL9we49YB6xv9GAPfHF8iMLtQg4ib38D1qCQ")' }}></div>
                            </div>
                        </header>

                        <div className="flex flex-wrap justify-between items-end gap-4 px-2 mb-8">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
                                    <span className="text-[#00f0ff] text-xs font-bold tracking-widest uppercase">Live System</span>
                                </div>
                                <p className="text-white text-4xl lg:text-5xl font-black leading-tight tracking-[-0.03em] glow-text">Recruitment Matrix</p>
                                <p className="text-slate-400 text-lg font-medium leading-normal">Neural-net driven insights on your talent pipeline</p>
                            </div>
                            <button className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-xl h-11 px-6 bg-[#0d59f2] hover:bg-[#0d59f2]/90 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all shadow-[0_0_15px_rgba(13,89,242,0.5)]">
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                <span className="truncate">Extract Data</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="glass-panel flex flex-col gap-3 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0d59f2]/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-[#0d59f2]/20"></div>
                                <div className="flex justify-between items-start z-10">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <span className="material-symbols-outlined text-[20px]">groups</span>
                                        <p className="text-sm font-medium leading-normal">Total Candidates</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-600">more_horiz</span>
                                </div>
                                <div className="z-10 mt-2">
                                    <p className="text-white tracking-tight text-3xl font-black leading-tight">{totalCandidates.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">trending_up</span>
                                        <p className="text-[#00f0ff] text-sm font-bold leading-normal">+12.4% vs last cycle</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0d59f2] to-transparent"></div>
                            </div>
                            <div className="glass-panel flex flex-col gap-3 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#bd00ff]/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-[#bd00ff]/20"></div>
                                <div className="flex justify-between items-start z-10">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
                                        <p className="text-sm font-medium leading-normal">Active Interviews</p>
                                    </div>
                                </div>
                                <div className="z-10 mt-2">
                                    <p className="text-white tracking-tight text-3xl font-black leading-tight">{activeInterviews}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">trending_up</span>
                                        <p className="text-[#00f0ff] text-sm font-bold leading-normal">+5.2% vs last cycle</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#bd00ff] to-transparent"></div>
                            </div>
                            <div className="glass-panel flex flex-col gap-3 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-red-500/20"></div>
                                <div className="flex justify-between items-start z-10">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <span className="material-symbols-outlined text-[20px]">local_activity</span>
                                        <p className="text-sm font-medium leading-normal">Offers Extended</p>
                                    </div>
                                </div>
                                <div className="z-10 mt-2">
                                    <p className="text-white tracking-tight text-3xl font-black leading-tight">{offersExtended}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[16px] text-red-400">trending_down</span>
                                        <p className="text-red-400 text-sm font-bold leading-normal">-2.1% vs last cycle</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
                            </div>
                            <div className="glass-panel flex flex-col gap-3 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f0ff]/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-[#00f0ff]/20"></div>
                                <div className="flex justify-between items-start z-10">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <span className="material-symbols-outlined text-[20px]">task_alt</span>
                                        <p className="text-sm font-medium leading-normal">Acceptance Rate</p>
                                    </div>
                                </div>
                                <div className="z-10 mt-2">
                                    <p className="text-white tracking-tight text-3xl font-black leading-tight">{conversionRate}%</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">trending_up</span>
                                        <p className="text-[#00f0ff] text-sm font-bold leading-normal">+8.5% vs last cycle</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f0ff] to-transparent"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <div className="lg:col-span-2 glass-panel flex flex-col gap-4 rounded-2xl p-6 relative">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-white text-lg font-bold leading-normal flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#0d59f2] text-[20px]">monitoring</span>
                                            Growth Velocity
                                        </h3>
                                        <p className="text-slate-400 text-sm font-medium mt-1">Monthly talent acquisition rate</p>
                                    </div>
                                    <div className="flex bg-[#131316] rounded-lg p-1 border border-[#232328]">
                                        <button className="px-3 py-1 rounded-md bg-[#232328] text-white text-xs font-bold">1M</button>
                                        <button className="px-3 py-1 rounded-md text-slate-400 hover:text-white text-xs font-bold transition-colors">3M</button>
                                        <button className="px-3 py-1 rounded-md text-slate-400 hover:text-white text-xs font-bold transition-colors">1Y</button>
                                    </div>
                                </div>
                                <div className="flex items-end gap-3 mb-6">
                                    <p className="text-white tracking-tight text-4xl font-black leading-tight truncate glow-text">$1.2M</p>
                                    <div className="flex items-center gap-1 mb-1 px-2 py-1 rounded-md bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                                        <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">arrow_upward</span>
                                        <p className="text-[#00f0ff] text-xs font-bold leading-normal">18.2%</p>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 min-h-[240px] relative mt-4">
                                    <div className="relative w-full h-[240px] z-10">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={growthVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#0d59f2" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#0d59f2" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#232328" />
                                                <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#131316', borderColor: '#232328', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                                    itemStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                                                />
                                                <Area type="monotone" dataKey="candidates" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#colorCandidates)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel flex flex-col gap-4 rounded-2xl p-6 relative">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white text-lg font-bold leading-normal flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#bd00ff] text-[20px]">filter_alt</span>
                                        Funnel Conversion
                                    </h3>
                                    <span className="material-symbols-outlined text-slate-600">tune</span>
                                </div>
                                <div className="flex items-end gap-3 mb-6">
                                    <p className="text-white tracking-tight text-4xl font-black leading-tight truncate">{totalCandidates.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="material-symbols-outlined text-[14px] text-[#00f0ff]">arrow_upward</span>
                                        <p className="text-slate-400 text-xs font-bold leading-normal">Total Sourced</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 flex-1 justify-center mt-2">
                                    {funnel.map((item: any, idx: number) => {
                                        const percentage = maxFunnel > 0 ? (item.count / maxFunnel) * 100 : 0;
                                        const colors = [
                                            'bg-[#0d59f2] shadow-[0_0_10px_rgba(13,89,242,0.8)]',
                                            'bg-gradient-to-r from-[#0d59f2] to-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.5)]',
                                            'bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.5)]',
                                            'bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] shadow-[0_0_10px_rgba(189,0,255,0.5)]',
                                            'bg-[#bd00ff] shadow-[0_0_10px_rgba(189,0,255,0.5)]',
                                            'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]'
                                        ];
                                        const colorClass = colors[idx % colors.length];
                                        return (
                                            <div key={item.stage} className="flex items-center gap-4 group">
                                                <div className="w-20 text-right text-xs font-bold text-slate-400 group-hover:text-white transition-colors truncate capitalize">{item.stage}</div>
                                                <div className="flex-1 h-3 bg-[#131316] rounded-full overflow-hidden border border-[#232328] relative">
                                                    {idx === 1 && <div className="absolute right-0 top-0 bottom-0 w-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] z-10 pointer-events-none"></div>}
                                                    <div className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
                                                </div>
                                                <div className="w-10 text-xs font-bold text-white text-right">{Math.round(percentage)}%</div>
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
