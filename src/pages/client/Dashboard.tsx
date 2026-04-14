import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';

export default function ClientDashboard() {
    const { user } = useAuthStore();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => api.get('/api/v1/analytics/dashboard').then(r => r.data),
    });

    const formatNum = (num: number | undefined) => (num !== undefined ? num.toLocaleString() : '0');

    // Handle generic 'your name' from default editor state
    const displayName = user?.fullName?.toLowerCase().includes('your name') 
        ? 'there' 
        : user?.fullName || 'Recruiter';

    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <SEO 
                title="Client Dashboard" 
                description="Manage your job listings, review top tech talent, and streamline your hiring process."
            />

            {/* Header Section with subtle gradient text */}
            <div style={{ marginBottom: 48, animation: 'fadeIn 0.6s ease-out' }}>
                <h1 style={{ 
                    fontSize: 40, 
                    fontWeight: 800, 
                    letterSpacing: '-0.04em', 
                    color: 'var(--color-text)', 
                    margin: '0 0 8px 0', 
                    fontFamily: "'Manrope', sans-serif" 
                }}>
                    Welcome, <span style={{ 
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>{displayName}</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 16, margin: 0, opacity: 0.7 }}>
                    Here's what's happening with your recruitment pipeline today.
                </p>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 48 }}>
                {/* Active Roles */}
                <div className="glass-card" style={{ 
                    padding: 24,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 20,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 12, 
                            background: 'rgba(var(--color-primary-rgb), 0.1)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--color-primary)' }}>work</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: 99 }}>
                            +0%
                        </div>
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', margin: '0 0 4px 0', fontFamily: "'Manrope', sans-serif" }}>
                        Active Roles
                    </h3>
                    <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', fontFamily: "'Manrope', sans-serif" }}>
                        {isLoading ? '...' : formatNum(stats?.active_roles)}
                    </div>
                </div>

                {/* Pipeline Activity */}
                <div className="glass-card" style={{ 
                    padding: 24,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 20,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 12, 
                            background: 'rgba(var(--color-accent-rgb), 0.1)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--color-accent)' }}>groups</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', background: 'var(--color-bg-tertiary)', padding: '4px 10px', borderRadius: 99 }}>
                            Total
                        </div>
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', margin: '0 0 4px 0', fontFamily: "'Manrope', sans-serif" }}>
                        Pipeline Activity
                    </h3>
                    <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', fontFamily: "'Manrope', sans-serif" }}>
                        {isLoading ? '...' : formatNum(stats?.pipeline_activity)}
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="glass-card" style={{ 
                    padding: 24,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 20
                }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 16px 0', fontFamily: "'Manrope', sans-serif" }}>
                        Quick Actions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Link to="/client/jobs/upload" style={{ 
                            display: 'flex', alignItems: 'center', gap: 12, 
                            padding: '10px 16px', borderRadius: 12, 
                            background: 'var(--color-primary)', color: 'var(--color-bg)',
                            textDecoration: 'none', fontSize: 13, fontWeight: 700,
                            transition: 'transform 0.2s',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                            Post New Role
                        </Link>
                        <Link to="/client/jobs" style={{ 
                            display: 'flex', alignItems: 'center', gap: 12, 
                            padding: '10px 16px', borderRadius: 12, 
                            background: 'var(--color-bg-tertiary)', color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            textDecoration: 'none', fontSize: 13, fontWeight: 600,
                            transition: 'all 0.2s'
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>list</span>
                            Manage Active Roles
                        </Link>
                    </div>
                </div>
            </div>

            {/* Empty State / Dashboard Content */}
            {(stats?.active_roles || 0) === 0 ? (
                <div style={{ 
                    marginTop: 24,
                    padding: 80, 
                    textAlign: 'center',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 32,
                    border: '1px dashed var(--color-border)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative Background Glow */}
                    <div style={{ 
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 300, height: 300, background: 'var(--color-primary)', filter: 'blur(120px)',
                        opacity: 0.1, pointerEvents: 'none'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ 
                            width: 80, height: 80, borderRadius: 24, 
                            background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px'
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-text-subtle)' }}>rocket_launch</span>
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', marginBottom: 12, fontFamily: "'Manrope', sans-serif" }}>
                            Your Hiring Journey Starts Here
                        </h2>
                        <p style={{ fontSize: 16, color: 'var(--color-text-muted)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
                            TopDev helps you find and score the best tech talent with structured AI-matching. Post your first job description to begin.
                        </p>
                        <Link to="/client/jobs/upload" className="btn-primary" style={{ padding: '14px 32px', fontSize: 15, borderRadius: 14 }}>
                            Post a Job Description
                        </Link>
                    </div>
                </div>
            ) : (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    {/* Placeholder for active role list or feed */}
                    <p>Standard dashboard content will appear here.</p>
                </div>
            )}
        </div>
    );
}
