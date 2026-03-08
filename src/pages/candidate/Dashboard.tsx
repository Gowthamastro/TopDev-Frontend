import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';

export default function CandidateDashboard() {
    const { user } = useAuthStore();
    return (
        <div style={{ padding: 32 }} className="animate-fadeInUp">
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Hi, {user?.fullName?.split(' ')[0]} 👋</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 28 }}>Here are your upcoming and completed assessments.</p>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 48, gap: 12 }}>
                <ClipboardList size={40} color="#475569" />
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14, textAlign: 'center', maxWidth: 380 }}>
                    You'll receive assessment invitations by email when a company selects you. Check your inbox for test links!
                </p>
            </div>
        </div>
    );
}
