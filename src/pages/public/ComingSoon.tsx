import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function ComingSoon() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: 40,
            background: 'var(--color-bg)', color: 'var(--color-text)', textAlign: 'center',
        }}>
            <SEO 
                title="Coming Soon" 
                description="This feature is currently under development on TopDev. Check back soon for the latest AI-powered recruitment tools."
            />
            <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24, boxShadow: '0 0 30px rgba(var(--color-primary-rgb), 0.05)',
            }}>
                <Rocket size={32} color="var(--color-primary)" />
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Coming Soon
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 15, margin: '10px 0 32px', maxWidth: 420, lineHeight: 1.6 }}>
                This feature is under development and will be available in an upcoming release.
                Stay tuned — we're building something great.
            </p>

            <button
                onClick={() => navigate(-1)}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '10px 24px' }}
            >
                <ArrowLeft size={16} /> Go Back
            </button>
        </div>
    );
}
