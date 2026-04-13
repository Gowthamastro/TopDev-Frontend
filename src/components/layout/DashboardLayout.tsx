import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
    LayoutDashboard, Briefcase, Users, BarChart3, CreditCard,
    Settings, Mail, ToggleLeft, BookTemplate, Sliders,
    LogOut, Zap, Shield, Search, Bell, Hexagon, Calendar
} from 'lucide-react';

const clientNav = [
    { to: '/client', icon: 'dashboard', label: 'Dashboard', end: true },
    { to: '/client/jobs', icon: 'work', label: 'Active Roles' },
    // Phase 1: Hide assessment/AI-dependent features
    // { to: '/client/candidates', icon: 'group', label: 'Talent Pool' },
    // { to: '/client/interviews', icon: 'calendar_month', label: 'Interviews' },
    // { to: '/client/analytics', icon: 'monitoring', label: 'Reports' },
];

const adminNav = [
    { to: '/admin', icon: 'dashboard', label: 'Overview', end: true },
    { to: '/admin/scoring', icon: 'tune', label: 'Scoring Weights' },
    { to: '/admin/settings', icon: 'settings', label: 'Platform Settings' },
    { to: '/admin/email-templates', icon: 'mail', label: 'Email Templates' },
    { to: 'admin/feature-flags', icon: 'toggle_on', label: 'Feature Flags' },
    { to: '/admin/role-templates', icon: 'description', label: 'Role Templates' },
    { to: '/admin/audit-log', icon: 'shield', label: 'Audit Log' },
];

const candidateNav = [
    { to: '/candidate', icon: 'dashboard', label: 'Dashboard', end: true },
    // Phase 1: Test/Results pages hidden — candidates just browse jobs & apply
];

export default function DashboardLayout({ role }: { role: 'client' | 'admin' | 'candidate' }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const nav = role === 'admin' ? adminNav : role === 'client' ? clientNav : candidateNav;

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="bg-[#0A0A0C] text-slate-100 font-display min-h-screen mesh-bg relative overflow-x-hidden">

            {/* Top Navigation */}
            <header className="fixed top-0 w-full z-40 glass-panel border-b border-white/5 h-16">
                <div className="flex items-center justify-between px-6 h-full">
                    <div className="flex items-center gap-4 pl-16">
                        <div className="w-64">
                            <div className="relative flex items-center w-full h-9 rounded-lg bg-[#131316]/80 border border-[#232328] focus-within:border-[#0d59f2]/50 focus-within:ring-1 focus-within:ring-[#0d59f2]/50 transition-all">
                                <span className="material-symbols-outlined absolute left-3 text-[#475569] text-sm">search</span>
                                <input className="w-full h-full bg-transparent border-none text-sm text-slate-100 placeholder-[#475569] pl-9 pr-3 focus:ring-0 outline-none" placeholder="Search roles, candidates..." type="text" />
                                <div className="absolute right-2 flex items-center gap-1">
                                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#475569] bg-[#232328]/50 rounded border border-[#232328]">⌘K</kbd>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-[#475569] hover:text-slate-100 transition-colors rounded-lg hover:bg-white/5">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#0d59f2] rounded-full ring-2 ring-[#0A0A0C]"></span>
                        </button>
                        <div className="h-5 w-px bg-[#232328]"></div>
                        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-white/5 hover:bg-white/5 transition-colors">
                            <div className="flex-col items-end hidden sm:flex">
                                <span className="text-xs font-medium text-slate-100">{user?.fullName || 'Acme Corp'}</span>
                                <span className="text-[10px] text-[#0d59f2]" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{role}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0d59f2] to-purple-600 flex items-center justify-center text-white text-xs font-bold border border-white/10 shadow-[0_0_10px_rgba(13,89,242,0.3)]">
                                {user?.fullName?.charAt(0).toUpperCase() || 'A'}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen z-50 glass-panel border-r border-white/5 sidebar-hover flex flex-col justify-between py-6 group bg-[#0A0A0C]/40">
                <div>
                    {/* Logo */}
                    <div className="flex items-center h-12 px-5 mb-10 overflow-hidden whitespace-nowrap">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#0d59f2]/10 border border-[#0d59f2]/20 text-[#0d59f2] shrink-0 glow-edge shadow-[0_0_15px_rgba(13,89,242,0.2)]">
                            <span className="material-symbols-outlined text-[24px]">hexagon</span>
                        </div>
                        <span className="ml-4 text-lg font-black tracking-tight text-white sidebar-text">TopDev<span className="text-[#0d59f2]">.</span></span>
                    </div>
                    {/* Nav Links */}
                    <nav className="flex flex-col gap-2 px-3">
                        {nav.map(({ to, icon, label, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) => `flex items-center h-10 px-3 rounded-lg overflow-hidden whitespace-nowrap transition-all relative group/link ${isActive ? 'bg-[#0d59f2]/10 text-white border border-[#0d59f2]/20 shadow-[inset_0_0_10px_rgba(13,89,242,0.05)]' : 'text-[#8b94a5] hover:text-white hover:bg-white/5'}`}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`material-symbols-outlined text-[20px] shrink-0 ${isActive ? 'text-[#0d59f2]' : ''}`}>{icon}</span>
                                        <span className={`ml-4 text-sm font-bold sidebar-text ${isActive ? 'text-white' : ''}`}>{label}</span>
                                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#0d59f2] rounded-r-full shadow-[0_0_8px_#0d59f2]"></div>}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="px-3 flex flex-col gap-2">
                    {role === 'client' && (
                        <NavLink to="/client/billing" className={({ isActive }) => `flex items-center h-10 px-3 rounded-lg overflow-hidden whitespace-nowrap transition-all relative group/link ${isActive ? 'bg-[#0d59f2]/10 text-white border border-[#0d59f2]/20' : 'text-[#8b94a5] hover:text-white hover:bg-white/5'}`}>
                            <span className="material-symbols-outlined text-[20px] shrink-0">settings</span>
                            <span className="ml-4 text-sm font-bold sidebar-text">Settings</span>
                        </NavLink>
                    )}
                    <button onClick={handleLogout} className="flex flex-row items-center h-10 px-3 rounded-lg text-[#8b94a5] hover:text-white hover:bg-white/5 overflow-hidden whitespace-nowrap transition-all w-full text-left">
                        <span className="material-symbols-outlined text-[20px] shrink-0">logout</span>
                        <span className="ml-4 text-sm font-bold sidebar-text">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-[80px] pt-16 min-h-screen p-8 transition-all duration-300 relative z-10 w-[calc(100%-80px)]">
                <Outlet />
            </main>
        </div>
    );
}
