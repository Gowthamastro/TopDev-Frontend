import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function ClientDashboard() {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => api.get('/api/v1/analytics/dashboard').then(r => r.data),
    });

    const handleSignOut = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    const formatNum = (num: number | undefined) => (num !== undefined ? num.toLocaleString() : '0');

    return (
        <div className="dark bg-[#0a0c10] text-slate-100 font-display min-h-screen relative overflow-x-hidden font-['Inter'] animate-fadeInUp">
            <style>{`
                .glass-panel {
                    background: rgba(18, 22, 31, 0.6);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02), 0 4px 24px -4px rgba(0, 0, 0, 0.5);
                }
                .glow-edge {
                    position: relative;
                }
                .glow-edge::before {
                    content: '';
                    position: absolute;
                    inset: -1px;
                    background: linear-gradient(180deg, rgba(13, 89, 242, 0.3), transparent 40%);
                    border-radius: inherit;
                    z-index: -1;
                    opacity: 0.5;
                }
                .mesh-bg {
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(13, 89, 242, 0.15) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(0, 255, 102, 0.05) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(13, 89, 242, 0.1) 0px, transparent 50%);
                }
                .sidebar-hover:hover {
                    width: 240px;
                }
                .sidebar-hover {
                    width: 80px;
                    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .sidebar-hover:hover .sidebar-text {
                    opacity: 1;
                    transform: translateX(0);
                    display: block;
                }
                .sidebar-text {
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: all 0.2s ease 0.1s;
                    display: none;
                    white-space: nowrap;
                }
            `}</style>

            <div className="fixed inset-0 pointer-events-none z-0 mesh-bg"></div>

            {/* Top Navigation */}
            <header className="fixed top-0 w-full z-40 glass-panel border-b border-[#1f2633]/50 h-16">
                <div className="flex items-center justify-between px-6 h-full">
                    <div className="flex items-center gap-4 pl-16">
                        <div className="w-64">
                            <div className="relative flex items-center w-full h-9 rounded-lg bg-[#12161f]/80 border border-[#1f2633] focus-within:border-[#0d59f2]/50 focus-within:ring-1 focus-within:ring-[#0d59f2]/50 transition-all">
                                <span className="material-symbols-outlined absolute left-3 text-[#8b94a5] text-sm">search</span>
                                <input className="w-full h-full bg-transparent border-none text-sm text-slate-100 placeholder-[#8b94a5] pl-9 pr-3 focus:ring-0" placeholder="Search roles, candidates..." type="text" />
                                <div className="absolute right-2 flex items-center gap-1">
                                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#8b94a5] bg-[#1f2633]/50 rounded border border-[#1f2633]">⌘K</kbd>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-[#8b94a5] hover:text-slate-100 transition-colors rounded-lg hover:bg-[#1f2633]/50">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#0d59f2] rounded-full ring-2 ring-[#0a0c10]"></span>
                        </button>
                        <div className="h-5 w-px bg-[#1f2633]"></div>
                        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-[#1f2633]/50 hover:bg-[#1f2633]/30 transition-colors">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <span className="text-xs font-medium text-slate-100">{user?.fullName || 'Acme Corp'}</span>
                                <span className="text-[10px] text-[#0d59f2]">Elite Tier</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0d59f2] to-purple-600 flex items-center justify-center text-white text-xs font-bold border border-white/10 shadow-[0_0_10px_rgba(13,89,242,0.3)]">
                                {user?.fullName?.substring(0, 2).toUpperCase() || 'AC'}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen z-50 glass-panel border-r border-[#1f2633]/50 sidebar-hover flex flex-col justify-between py-4 group">
                <div>
                    <Link to="/client" className="flex items-center h-12 px-5 mb-8 overflow-hidden whitespace-nowrap">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#0d59f2]/10 border border-[#0d59f2]/20 text-[#0d59f2] shrink-0 glow-edge">
                            <span className="material-symbols-outlined text-[24px]">hexagon</span>
                        </div>
                        <span className="ml-4 text-lg font-bold tracking-tight text-slate-100 sidebar-text">TopDev<span className="text-[#0d59f2]">.</span></span>
                    </Link>
                    <nav className="flex flex-col gap-2 px-3">
                        <Link className="flex items-center h-10 px-3 rounded-lg bg-[#0d59f2]/10 text-[#0d59f2] border border-[#0d59f2]/20 overflow-hidden whitespace-nowrap relative group/link" to="/client">
                            <span className="material-symbols-outlined text-[20px] shrink-0">dashboard</span>
                            <span className="ml-4 text-sm font-medium sidebar-text">Dashboard</span>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0d59f2] rounded-r-full"></div>
                        </Link>
                        <Link className="flex items-center h-10 px-3 rounded-lg text-[#8b94a5] hover:text-slate-100 hover:bg-[#1f2633]/40 overflow-hidden whitespace-nowrap transition-colors" to="/client/jobs">
                            <span className="material-symbols-outlined text-[20px] shrink-0">work</span>
                            <span className="ml-4 text-sm font-medium sidebar-text">Active Roles</span>
                        </Link>
                        <Link className="flex items-center h-10 px-3 rounded-lg text-[#8b94a5] hover:text-slate-100 hover:bg-[#1f2633]/40 overflow-hidden whitespace-nowrap transition-colors" to="/client/jobs">
                            <span className="material-symbols-outlined text-[20px] shrink-0">group</span>
                            <span className="ml-4 text-sm font-medium sidebar-text">Talent Pool</span>
                        </Link>
                        <Link className="flex items-center h-10 px-3 rounded-lg text-[#8b94a5] hover:text-slate-100 hover:bg-[#1f2633]/40 overflow-hidden whitespace-nowrap transition-colors" to="/client/analytics">
                            <span className="material-symbols-outlined text-[20px] shrink-0">analytics</span>
                            <span className="ml-4 text-sm font-medium sidebar-text">Reports</span>
                        </Link>
                    </nav>
                </div>
                <div className="px-3">
                    <button onClick={handleSignOut} className="w-full flex items-center h-10 px-3 rounded-lg text-[#8b94a5] hover:text-slate-100 hover:bg-[#1f2633]/40 overflow-hidden whitespace-nowrap transition-colors">
                        <span className="material-symbols-outlined text-[20px] shrink-0">logout</span>
                        <span className="ml-4 text-sm font-medium sidebar-text">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-[80px] pt-16 min-h-screen p-8 transition-all duration-300 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-2">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">{user?.fullName || 'Acme Corp'}</span></h1>
                        <p className="text-[#8b94a5] text-sm">Here's your AI-powered recruitment overview for today.</p>
                    </div>
                    <Link to="/client/jobs/upload" className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#0d59f2] hover:bg-blue-600 text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(13,89,242,0.4)] glow-edge">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        New Role
                    </Link>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Active Roles */}
                    <div className="glass-panel rounded-xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-[#0d59f2]">work</span>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-[#1f2633] flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-[16px]">work</span>
                                </div>
                                <h3 className="text-sm font-medium text-[#8b94a5]">Active Roles</h3>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-slate-100">
                                    {isLoading ? '...' : formatNum(stats?.active_roles)}
                                </span>
                                {stats?.trends?.roles > 0 && (
                                    <div className="flex items-center text-xs font-medium text-[#00ff66] bg-[#00ff66]/10 px-1.5 py-0.5 rounded">
                                        <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span>
                                        +{stats.trends.roles}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0d59f2]/50 to-transparent"></div>
                    </div>

                    {/* Qualified Candidates */}
                    <div className="glass-panel rounded-xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-slate-100">group</span>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-[#1f2633] flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-[16px]">group</span>
                                </div>
                                <h3 className="text-sm font-medium text-[#8b94a5]">Qualified Candidates</h3>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-slate-100">
                                    {isLoading ? '...' : formatNum(stats?.qualified_candidates)}
                                </span>
                                {stats?.trends && stats.trends.candidates !== 0 && (
                                    <div className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded ${stats.trends.candidates > 0 ? 'text-[#00ff66] bg-[#00ff66]/10' : 'text-[#ff3366] bg-[#ff3366]/10'}`}>
                                        <span className="material-symbols-outlined text-[12px] mr-0.5">{stats.trends.candidates > 0 ? 'trending_up' : 'trending_down'}</span>
                                        {stats.trends.candidates > 0 ? '+' : ''}{stats.trends.candidates}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400/50 to-transparent"></div>
                    </div>

                    {/* Avg AI Score */}
                    <div className="glass-panel rounded-xl p-5 relative overflow-hidden group glow-edge">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-[#0d59f2]/20 border border-[#0d59f2]/30 flex items-center justify-center text-[#0d59f2]">
                                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                                    </div>
                                    <h3 className="text-sm font-medium text-[#8b94a5]">Avg AI Score</h3>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-slate-100">
                                        {isLoading ? '...' : (stats?.avg_ai_score || 0)}
                                        <span className="text-lg text-[#8b94a5] font-normal">/100</span>
                                    </span>
                                </div>
                                {stats?.trends?.score > 0 && (
                                    <div className="mt-2 flex items-center text-xs font-medium text-[#00ff66]">
                                        <span className="material-symbols-outlined text-[12px] mr-0.5">arrow_upward</span>
                                        +{stats.trends.score}% this week
                                    </div>
                                )}
                            </div>
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-[#1f2633]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                    <path className="text-[#0d59f2] drop-shadow-[0_0_8px_rgba(13,89,242,0.8)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${stats?.avg_ai_score || 0}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                                </svg>
                                <span className="absolute text-xs font-bold text-slate-100">{Math.round(stats?.avg_ai_score || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Time to Hire */}
                    <div className="glass-panel rounded-xl p-5 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-[#1f2633] flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-[16px]">timer</span>
                                </div>
                                <h3 className="text-sm font-medium text-[#8b94a5]">Time to Hire</h3>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-3xl font-bold text-slate-100">
                                        {isLoading ? '...' : (stats?.time_to_hire || 0)} 
                                        <span className="text-lg text-[#8b94a5] font-normal ml-1">days</span>
                                    </span>
                                </div>
                                <div className="w-20 h-10 opacity-70">
                                    <svg className="w-full h-full stroke-[#00ff66]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 100 40">
                                        <path d="M0 30 Q 10 20, 20 25 T 40 15 T 60 20 T 80 10 T 100 5"></path>
                                        <circle cx="100" cy="5" fill="#00ff66" r="3"></circle>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ff66]/50 to-transparent"></div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass-panel rounded-xl p-6 lg:col-span-2 border border-[#1f2633] flex flex-col glow-edge">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-100">Candidate Pipeline Activity</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-2xl font-bold text-slate-100">
                                        {isLoading ? '...' : formatNum(stats?.pipeline_activity)}
                                    </span>
                                    <span className="text-sm text-[#8b94a5]">Total Activities</span>
                                    {stats?.trends?.activity > 0 && (
                                        <span className="text-xs font-medium text-[#00ff66] ml-2 flex items-center">
                                            <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>
                                            {stats.trends.activity}%
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-[#12161f] rounded-lg p-1 border border-[#1f2633]">
                                <button className="px-3 py-1 text-xs font-medium rounded-md bg-[#1f2633] text-slate-100">Month</button>
                                <button className="px-3 py-1 text-xs font-medium rounded-md text-[#8b94a5] hover:text-slate-100 transition-colors">Quarter</button>
                            </div>
                        </div>
                        <div className="relative flex-1 min-h-[220px] w-full mt-4 flex flex-col justify-end">
                            <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
                                <div className="w-full h-px bg-[#1f2633] border-dashed border-t border-[#1f2633]/50"></div>
                                <div className="w-full h-px bg-[#1f2633] border-dashed border-t border-[#1f2633]/50"></div>
                                <div className="w-full h-px bg-[#1f2633] border-dashed border-t border-[#1f2633]/50"></div>
                                <div className="w-full h-px bg-[#1f2633] border-dashed border-t border-[#1f2633]/50"></div>
                            </div>
                            {(stats?.pipeline_activity || 0) > 0 ? (
                                <div className="relative z-10 w-full h-full">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="rgba(13,89,242,0.4)"></stop>
                                                <stop offset="100%" stopColor="rgba(13,89,242,0.0)"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 100 L 100 100 Z" fill="url(#chartGradient)"></path>
                                        <path d="M0 100 L 100 100" fill="none" stroke="#0d59f2" strokeLinecap="round" strokeWidth="2"></path>
                                    </svg>
                                </div>
                            ) : (
                                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-[#1f2633] mb-3">monitoring</span>
                                    <p className="text-sm text-[#475569] font-medium">No pipeline activity yet</p>
                                    <p className="text-xs text-[#334155] mt-1">Invite candidates to see data here</p>
                                </div>
                            )}
                            <div className="flex justify-between mt-2 text-[11px] text-[#8b94a5] font-medium px-1">
                                <span>W1</span>
                                <span>W2</span>
                                <span>W3</span>
                                <span>W4</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="glass-panel rounded-xl p-6 border border-[#1f2633] flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-100">AI Score Distribution</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl font-bold text-slate-100">{Math.round(stats?.avg_ai_score || 0)}</span>
                                <span className="text-sm text-[#8b94a5]">Avg Score</span>
                            </div>
                        </div>
                        {(stats?.avg_ai_score || 0) > 0 ? (
                            <div className="flex-1 flex items-end justify-between gap-2 mt-4 px-2 pb-6 relative">
                                <div className="w-full flex flex-col justify-end items-center group/bar cursor-pointer">
                                    <div className="w-full bg-[#1f2633] rounded-t-sm transition-all group-hover/bar:bg-slate-600" style={{ height: '15%' }}></div>
                                    <span className="absolute bottom-0 text-[11px] text-[#8b94a5] font-medium mt-2">&lt;70</span>
                                </div>
                                <div className="w-full flex flex-col justify-end items-center group/bar cursor-pointer">
                                    <div className="w-full bg-slate-700 rounded-t-sm transition-all group-hover/bar:bg-slate-600" style={{ height: '40%' }}></div>
                                    <span className="absolute bottom-0 text-[11px] text-[#8b94a5] font-medium mt-2">70-79</span>
                                </div>
                                <div className="w-full flex flex-col justify-end items-center group/bar cursor-pointer">
                                    <div className="w-full bg-slate-600 rounded-t-sm transition-all group-hover/bar:bg-slate-500" style={{ height: '65%' }}></div>
                                    <span className="absolute bottom-0 text-[11px] text-[#8b94a5] font-medium mt-2">80-89</span>
                                </div>
                                <div className="w-full flex flex-col justify-end items-center group/bar cursor-pointer relative">
                                    <div className="w-full bg-[#0d59f2]/80 rounded-t-sm border-t border-[#0d59f2] drop-shadow-[0_-4px_10px_rgba(13,89,242,0.4)] transition-all group-hover/bar:bg-[#0d59f2]" style={{ height: '90%' }}></div>
                                    <span className="absolute bottom-0 text-[11px] text-[#0d59f2] font-bold mt-2">90-100</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                                <span className="material-symbols-outlined text-4xl text-[#1f2633] mb-3">bar_chart</span>
                                <p className="text-sm text-[#475569] font-medium">No scores recorded yet</p>
                                <p className="text-xs text-[#334155] mt-1">Score data will appear after candidates complete assessments</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
