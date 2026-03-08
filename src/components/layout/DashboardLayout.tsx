import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
    LayoutDashboard, Briefcase, Users, BarChart3, CreditCard,
    Settings, Mail, ToggleLeft, BookTemplate, Sliders,
    LogOut, Zap, Shield
} from 'lucide-react';

const clientNav = [
    { to: '/client', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/client/jobs', icon: Briefcase, label: 'Job Roles' },
    { to: '/client/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/client/billing', icon: CreditCard, label: 'Billing' },
];

const adminNav = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/admin/scoring', icon: Sliders, label: 'Scoring Weights' },
    { to: '/admin/settings', icon: Settings, label: 'Platform Settings' },
    { to: '/admin/email-templates', icon: Mail, label: 'Email Templates' },
    { to: '/admin/feature-flags', icon: ToggleLeft, label: 'Feature Flags' },
    { to: '/admin/role-templates', icon: BookTemplate, label: 'Role Templates' },
    { to: '/admin/audit-log', icon: Shield, label: 'Audit Log' },
];

const candidateNav = [
    { to: '/candidate', icon: LayoutDashboard, label: 'Dashboard', end: true },
];

export default function DashboardLayout({ role }: { role: 'client' | 'admin' | 'candidate' }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const nav = role === 'admin' ? adminNav : role === 'client' ? clientNav : candidateNav;

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
            {/* Sidebar */}
            <aside style={{
                width: 240, background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)',
                display: 'flex', flexDirection: 'column', padding: '20px 12px', flexShrink: 0, position: 'fixed', height: '100vh', top: 0, left: 0, zIndex: 10
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px', marginBottom: 28 }}>
                    <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={16} color="white" />
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>TopDev</div>
                        <div style={{ fontSize: 10, color: 'var(--color-text-subtle)', textTransform: 'capitalize' }}>{role} panel</div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {nav.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* User info + logout */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName}</div>
                            <div style={{ fontSize: 11, color: 'var(--color-text-subtle)', textTransform: 'capitalize' }}>{user?.role}</div>
                        </div>
                    </div>
                    <button className="sidebar-item" onClick={handleLogout} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                        <LogOut size={16} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, marginLeft: 240, overflowY: 'auto', minHeight: '100vh' }}>
                <Outlet />
            </main>
        </div>
    );
}
