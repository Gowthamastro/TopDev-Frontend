import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function ComingSoon() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: 40,
            background: '#0a0c10', color: '#f1f5f9', textAlign: 'center',
        }}>
            <SEO 
                title="Coming Soon" 
                description="This feature is currently under development on TopDev. Check back soon for the latest AI-powered recruitment tools."
            />
            <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(13,89,242,0.15), rgba(99,102,241,0.15))',
                border: '1px solid rgba(13,89,242,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24, boxShadow: '0 0 30px rgba(13,89,242,0.15)',
            }}>
                <Rocket size={32} color="#0d59f2" />
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Coming Soon
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 15, margin: '10px 0 32px', maxWidth: 420, lineHeight: 1.6 }}>
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
