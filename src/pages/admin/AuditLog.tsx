import { useQuery } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import api from '../../services/api';

const ACTION_COLORS: Record<string, string> = {
    update: '#6366f1',
    create: '#10b981',
    delete: '#ef4444',
    login: '#f59e0b',
    toggle: '#8b5cf6',
};

export default function AdminAuditLog() {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['audit-logs'],
        queryFn: () => api.get('/api/v1/admin/audit-logs').then(r => r.data),
        refetchInterval: 30000,
    });

    return (
        <div style={{ padding: 32, maxWidth: 1000 }} className="animate-fadeInUp">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={18} color="#818cf8" />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Audit Log</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: 13 }}>All admin actions (auto-refreshes every 30s)</p>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Resource</th>
                            <th>Details</th>
                            <th>IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-muted)' }}>Loading...</td></tr>
                        )}
                        {(logs || []).map((log: any) => {
                            const actionKey = Object.keys(ACTION_COLORS).find(k => log.action?.toLowerCase().includes(k)) || 'update';
                            const actionColor = ACTION_COLORS[actionKey];
                            return (
                                <tr key={log.id}>
                                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td style={{ fontSize: 13 }}>
                                        <span style={{ fontWeight: 500 }}>User #{log.user_id}</span>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                                            background: `${actionColor}15`, color: actionColor
                                        }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                                        {log.resource_type && (
                                            <span>{log.resource_type}{log.resource_id ? ` #${log.resource_id}` : ''}</span>
                                        )}
                                    </td>
                                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)', maxWidth: 280 }}>
                                        {log.details && (
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                                                {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ fontSize: 12, color: 'var(--color-text-subtle)', fontFamily: 'monospace' }}>
                                        {log.ip_address || '—'}
                                    </td>
                                </tr>
                            );
                        })}
                        {!isLoading && (!logs || logs.length === 0) && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-muted)' }}>
                                No audit events yet.
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
