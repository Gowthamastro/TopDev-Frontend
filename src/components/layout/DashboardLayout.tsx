import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';


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
    { to: '/admin/feature-flags', icon: 'toggle_on', label: 'Feature Flags' },
    { to: '/admin/role-templates', icon: 'description', label: 'Role Templates' },
    { to: '/admin/audit-log', icon: 'shield', label: 'Audit Log' },
];

const candidateNav = [
    { to: '/candidate', icon: 'dashboard', label: 'Dashboard', end: true },
    // Phase 1: Test/Results pages hidden — candidates just browse jobs & apply
];

export default function DashboardLayout({ role }: { role: 'client' | 'admin' | 'candidate' }) {
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const nav = role === 'admin' ? adminNav : role === 'client' ? clientNav : candidateNav;

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: "'Manrope', 'Inter', sans-serif", minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>

            {/* Top Navigation */}
            <header style={{
                position: 'fixed', top: 0, width: '100%', zIndex: 40, height: 64,
                background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 64 }}>
                        <div style={{ width: 256 }}>
                            <div style={{
                                position: 'relative', display: 'flex', alignItems: 'center', width: '100%', height: 36,
                                borderRadius: 9999, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
                                transition: 'all 0.2s'
                            }}>
                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, color: 'var(--color-text-subtle)', fontSize: 16 }}>search</span>
                                <input style={{
                                    width: '100%', height: '100%', background: 'transparent', border: 'none',
                                    fontSize: 13, color: 'var(--color-text)', paddingLeft: 36, paddingRight: 12, outline: 'none',
                                    fontFamily: "'Inter', sans-serif"
                                }} placeholder="Search roles, candidates..." type="text" />
                                <kbd style={{
                                    position: 'absolute', right: 8, padding: '2px 6px', fontSize: 10,
                                    fontFamily: 'monospace', color: 'var(--color-text-subtle)', background: 'var(--color-bg-tertiary)',
                                    borderRadius: 4, border: '1px solid var(--color-border-subtle)'
                                }}>⌘K</kbd>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button 
                            onClick={toggleTheme}
                            style={{
                                padding: 8, color: 'var(--color-text-muted)', background: 'none', border: 'none',
                                cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s', display: 'flex', alignItems: 'center'
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                                {theme === 'light' ? 'dark_mode' : 'light_mode'}
                            </span>
                        </button>
                        <button style={{
                            position: 'relative', padding: 8, color: 'var(--color-text-subtle)', background: 'none', border: 'none',
                            cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s'
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
                            <span style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, background: 'var(--color-accent)', borderRadius: '50%', border: '2px solid var(--color-bg)' }}></span>
                        </button>
                        <div style={{ height: 20, width: 1, background: 'var(--color-border)' }}></div>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 8, paddingRight: 4, paddingTop: 4, paddingBottom: 4,
                            borderRadius: 9999, border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>{user?.fullName || 'Acme Corp'}</span>
                                <span style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{role}</span>
                            </div>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--color-bg)', fontSize: 12, fontWeight: 700
                            }}>
                                {user?.fullName?.charAt(0).toUpperCase() || 'A'}
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside className="sidebar-hover" style={{
                position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 50,
                background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 0'
            }}>
                <div>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', height: 48, padding: '0 20px', marginBottom: 40, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12, background: 'var(--color-primary)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--color-bg)', fontSize: 22 }}>hexagon</span>
                        </div>
                        <span className="sidebar-text" style={{ marginLeft: 16, fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif" }}>
                            TopDev<span style={{ color: 'var(--color-text-muted)' }}>.</span>
                        </span>
                    </div>
                    {/* Nav Links */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px' }}>
                        {nav.map(({ to, icon, label, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) => `${isActive ? 'active' : ''}`}
                                style={({ isActive }) => ({
                                    display: 'flex', alignItems: 'center', height: 40, padding: '0 12px',
                                    borderRadius: 8, overflow: 'hidden', whiteSpace: 'nowrap',
                                    transition: 'all 0.15s', position: 'relative', textDecoration: 'none',
                                    background: isActive ? 'var(--color-bg-tertiary)' : 'transparent',
                                    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                                    border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
                                    fontFamily: "'Manrope', sans-serif"
                                })}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="material-symbols-outlined" style={{ fontSize: 20, flexShrink: 0, color: isActive ? 'var(--color-text)' : 'var(--color-text-subtle)' }}>{icon}</span>
                                        <span className="sidebar-text" style={{ marginLeft: 16, fontSize: 13, fontWeight: 600 }}>{label}</span>
                                        {isActive && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: 'var(--color-primary)', borderRadius: '0 4px 4px 0' }}></div>}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {role === 'client' && (
                        <NavLink to="/client/billing" style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', height: 40, padding: '0 12px',
                            borderRadius: 8, overflow: 'hidden', whiteSpace: 'nowrap',
                            transition: 'all 0.15s', textDecoration: 'none',
                            background: isActive ? 'var(--color-bg-tertiary)' : 'transparent',
                            color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                            fontFamily: "'Manrope', sans-serif"
                        })}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20, flexShrink: 0 }}>settings</span>
                            <span className="sidebar-text" style={{ marginLeft: 16, fontSize: 13, fontWeight: 600 }}>Settings</span>
                        </NavLink>
                    )}
                    <button onClick={handleLogout} style={{
                        display: 'flex', alignItems: 'center', height: 40, padding: '0 12px',
                        borderRadius: 8, overflow: 'hidden', whiteSpace: 'nowrap',
                        transition: 'all 0.15s', width: '100%', textAlign: 'left',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--color-text-muted)', fontFamily: "'Manrope', sans-serif"
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, flexShrink: 0 }}>logout</span>
                        <span className="sidebar-text" style={{ marginLeft: 16, fontSize: 13, fontWeight: 600 }}>Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: 80, paddingTop: 64, minHeight: '100vh', padding: '96px 32px 32px 112px', transition: 'all 0.3s', position: 'relative', zIndex: 10 }}>
                <Outlet />
            </main>
        </div>
    );
}
