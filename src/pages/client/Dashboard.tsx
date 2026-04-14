import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import SEO from '../../components/common/SEO';

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
        <div className="animate-fadeInUp" style={{ fontFamily: "'Inter', sans-serif" }}>
            <SEO 
                title="Client Dashboard" 
                description="Manage your job listings, review top tech talent, and streamline your hiring process on the TopDev recruiter platform."
            />

            {/* Header Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 40 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#000', margin: 0, fontFamily: "'Manrope', sans-serif" }}>
                    Welcome back, <span style={{ color: '#333' }}>{user?.fullName || 'Acme Corp'}</span>
                </h1>
                <p style={{ color: '#666', fontSize: 14, margin: 0 }}>Your recruitment overview — post jobs and review applicants.</p>
                <div style={{ marginTop: 12 }}>
                    <Link to="/client/jobs/upload" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', fontSize: 14 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                        Post New Job
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
                {/* Active Roles */}
                <div className="stat-card float-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 4, background: '#F9F9F9', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#000' }}>work</span>
                        </div>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#666', margin: 0, fontFamily: "'Manrope', sans-serif" }}>Active Roles</h3>
                    </div>
                    <span style={{ fontSize: 36, fontWeight: 800, color: '#000', letterSpacing: '-0.02em', fontFamily: "'Manrope', sans-serif" }}>
                        {isLoading ? '...' : formatNum(stats?.active_roles)}
                    </span>
                </div>

                {/* Total Applicants */}
                <div className="stat-card float-card-delay-1" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 4, background: '#F9F9F9', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#000' }}>group</span>
                        </div>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#666', margin: 0, fontFamily: "'Manrope', sans-serif" }}>Total Applicants</h3>
                    </div>
                    <span style={{ fontSize: 36, fontWeight: 800, color: '#000', letterSpacing: '-0.02em', fontFamily: "'Manrope', sans-serif" }}>
                        {isLoading ? '...' : formatNum(stats?.pipeline_activity)}
                    </span>
                </div>

                {/* Quick Actions */}
                <div className="stat-card float-card-delay-2" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 4, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#fff' }}>bolt</span>
                        </div>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#666', margin: 0, fontFamily: "'Manrope', sans-serif" }}>Quick Actions</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                        <Link to="/client/jobs/upload" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#000', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>
                            Post a new role
                        </Link>
                        <Link to="/client/jobs" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#000', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>list</span>
                            View all roles
                        </Link>
                    </div>
                </div>
            </div>

            {/* Empty state prompt */}
            {(stats?.active_roles || 0) === 0 && (
                <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#ccc', marginBottom: 16, display: 'block' }}>work</span>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#000', marginBottom: 8, fontFamily: "'Manrope', sans-serif" }}>Start by posting your first job</h2>
                    <p style={{ fontSize: 14, color: '#666', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
                        Create a job listing and candidates will start applying. You'll be able to review their profiles right here.
                    </p>
                    <Link to="/client/jobs/upload" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                        Post New Job
                    </Link>
                </div>
            )}
        </div>
    );
}
