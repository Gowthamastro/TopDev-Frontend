import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminScoringWeights() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const [techWeight, setTechWeight] = useState(85);
    const [commWeight, setCommWeight] = useState(60);
    const [cultWeight, setCultWeight] = useState(45);

    useQuery({
        queryKey: ['scoring-weights'],
        queryFn: async () => {
            try {
                const res = await api.get('/api/v1/admin/scoring-weights');
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                if (data) {
                    setTechWeight(Math.round((data.technical_weight ?? 0.4) * 100));
                    setCommWeight(Math.round((data.communication_weight ?? 0.3) * 100));
                    setCultWeight(Math.round((data.cultural_fit_weight ?? 0.3) * 100));
                }
                return data;
            } catch (err) {
                return null;
            }
        }
    });

    const handleSignOut = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    const handleSave = async () => {
        try {
            await api.put('/api/v1/admin/scoring-weights/1', {
                technical_weight: techWeight / 100,
                communication_weight: commWeight / 100,
                cultural_fit_weight: cultWeight / 100,
                qualification_threshold: 60.0
            });
            toast.success('Configuration saved successfully');
        } catch (error) {
            toast.error('Failed to save configuration');
        }
    };

    return (
        <div className="bg-[var(--color-bg)] text-[var(--color-text)] font-display min-h-screen antialiased flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                input[type=range] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: var(--color-text);
                    cursor: pointer;
                    margin-top: -6px;
                    box-shadow: 0 0 10px var(--color-primary);
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: var(--color-border);
                    border-radius: 2px;
                }
                input[type=range]:focus {
                    outline: none;
                }
                .toggle-checkbox:checked {
                    right: 0;
                    border: 1px solid var(--color-primary);
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: var(--color-primary);
                    box-shadow: 0 0 10px var(--color-primary);
                }
                .toggle-checkbox {
                    right: 0;
                    z-index: 1;
                    border: 1px solid var(--color-border);
                    transition: all 0.3s ease;
                }
                .toggle-label {
                    width: 2.5rem;
                    height: 1.25rem;
                    background-color: var(--color-bg-tertiary);
                    border-radius: 9999px;
                    transition: all 0.3s ease;
                }
            `}</style>

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 border-r backdrop-blur-xl flex flex-col justify-between" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                    <div className="p-4 flex flex-col gap-6">
                        {/* User Profile */}
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}>
                                <img alt="Admin Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDygtz7NSxPaT_xuPPLlJlm8sD2u0s-Qm8JXi_wHrzgAv10NqCXNMJcUMkX3Gm4gLPOtu-CWXF8bveM0zLOfbjjm7LyRdzKw9GomYvo-DtiU9mnet0Jc11zqrL8bKsVDp0UdTBDAj2dTrOvmRIFyXQOlaEm8nXH2KOZCHCbD2-64XOzgWmXpeWFEL7L4iCJfgkm2kV_R0VnFn7NedZdvZizP2UTu9wy6v62EiLwtf2Ey4TpRBcPca2ia5dbc2PYbq2eGPZjzww5-vY" />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-text)' }}>TopDev Control</h1>
                                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Admin Terminal</p>
                            </div>
                        </div>
                        {/* Navigation */}
                        <nav className="flex flex-col gap-1">
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)]" to="/admin" style={{ color: 'var(--color-text-muted)' }}>
                                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg border" to="/admin/scoring" style={{ background: 'var(--color-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-primary)' }}>
                                <span className="material-symbols-outlined text-[20px]">tune</span>
                                <span className="text-sm font-bold">Algorithm</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)]" to="/admin/settings" style={{ color: 'var(--color-text-muted)' }}>
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)]" to="/admin/audit-log" style={{ color: 'var(--color-text-muted)' }}>
                                <span className="material-symbols-outlined text-[20px]">history</span>
                                <span className="text-sm font-medium">Audit Logs</span>
                            </Link>
                        </nav>
                    </div>
                    <div className="p-4">
                        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)]" style={{ color: 'var(--color-text-muted)' }}>
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            <span className="text-sm font-medium">Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden relative">

                    {/* Header */}
                    <header className="px-8 py-6 border-b backdrop-blur-md z-10" style={{ background: 'rgba(var(--color-bg-secondary-rgb), 0.5)', borderColor: 'var(--color-border)' }}>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>Scoring Weights & Settings</h2>
                            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Configure AI recruitment algorithm weights and system preferences.</p>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 z-10">
                        <div className="max-w-4xl mx-auto space-y-12">

                            {/* Algorithm Weights Section */}
                            <section>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>analytics</span>
                                    Algorithm Weights
                                </h3>
                                <div className="border rounded-xl p-6 space-y-8 backdrop-blur-sm" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                                    {/* Slider 1 */}
                                    <div className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Technical Expertise</p>
                                                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Weight applied to coding assessments and technical interviews.</p>
                                            </div>
                                            <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{techWeight}%</span>
                                        </div>
                                        <div className="relative w-full h-4 flex items-center">
                                            <div className="absolute left-0 h-1 rounded-l-full" style={{ width: `${techWeight}%`, background: 'var(--color-primary)' }}></div>
                                            <input className="w-full absolute z-10 opacity-0 cursor-pointer" max="100" min="0" type="range" value={techWeight} onChange={e => setTechWeight(Number(e.target.value))} />
                                            <div className="absolute w-full h-1 rounded-full pointer-events-none" style={{ background: 'var(--color-border)' }}></div>
                                            <div className="absolute h-4 w-4 rounded-full border-2 pointer-events-none" style={{ left: `calc(${techWeight}% - 8px)`, background: 'var(--color-text)', borderColor: 'var(--color-primary)' }}></div>
                                        </div>
                                    </div>
                                    {/* Slider 2 */}
                                    <div className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Communication Skills</p>
                                                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Weight for natural language processing of interview transcripts.</p>
                                            </div>
                                            <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{commWeight}%</span>
                                        </div>
                                        <div className="relative w-full h-4 flex items-center">
                                            <div className="absolute left-0 h-1 rounded-l-full" style={{ width: `${commWeight}%`, background: 'var(--color-primary)' }}></div>
                                            <input className="w-full absolute z-10 opacity-0 cursor-pointer" max="100" min="0" type="range" value={commWeight} onChange={e => setCommWeight(Number(e.target.value))} />
                                            <div className="absolute w-full h-1 rounded-full pointer-events-none" style={{ background: 'var(--color-border)' }}></div>
                                            <div className="absolute h-4 w-4 rounded-full border-2 pointer-events-none" style={{ left: `calc(${commWeight}% - 8px)`, background: 'var(--color-text)', borderColor: 'var(--color-primary)' }}></div>
                                        </div>
                                    </div>
                                    {/* Slider 3 */}
                                    <div className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Cultural Fit</p>
                                                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Alignment with company core values and team dynamics.</p>
                                            </div>
                                            <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{cultWeight}%</span>
                                        </div>
                                        <div className="relative w-full h-4 flex items-center">
                                            <div className="absolute left-0 h-1 rounded-l-full" style={{ width: `${cultWeight}%`, background: 'var(--color-primary)' }}></div>
                                            <input className="w-full absolute z-10 opacity-0 cursor-pointer" max="100" min="0" type="range" value={cultWeight} onChange={e => setCultWeight(Number(e.target.value))} />
                                            <div className="absolute w-full h-1 rounded-full pointer-events-none" style={{ background: 'var(--color-border)' }}></div>
                                            <div className="absolute h-4 w-4 rounded-full border-2 pointer-events-none" style={{ left: `calc(${cultWeight}% - 8px)`, background: 'var(--color-text)', borderColor: 'var(--color-primary)' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* System Preferences */}
                            <section>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>toggle_on</span>
                                    System Preferences
                                </h3>
                                <div className="border rounded-xl p-2 backdrop-blur-sm divide-y" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                                    {/* Toggle 1 */}
                                    <div className="flex items-center justify-between p-4 transition-colors rounded-lg hover:bg-[var(--color-bg-tertiary)]">
                                        <div>
                                            <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Auto-reject below threshold</p>
                                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Automatically decline candidates scoring below 40%.</p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full appearance-none cursor-pointer" id="toggle1" name="toggle" type="checkbox" style={{ background: 'var(--color-text)', border: '4px solid transparent' }} />
                                            <label className="toggle-label block overflow-hidden h-5 rounded-full cursor-pointer" htmlFor="toggle1"></label>
                                        </div>
                                    </div>
                                    {/* Toggle 2 */}
                                    <div className="flex items-center justify-between p-4 transition-colors rounded-lg hover:bg-[var(--color-bg-tertiary)]">
                                        <div>
                                            <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Enable Bias Mitigation</p>
                                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Apply anonymization to candidate profiles during initial screening.</p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full appearance-none cursor-pointer" id="toggle2" name="toggle" type="checkbox" style={{ background: 'var(--color-text)', border: '4px solid transparent' }} />
                                            <label className="toggle-label block overflow-hidden h-5 rounded-full cursor-pointer" htmlFor="toggle2"></label>
                                        </div>
                                    </div>
                                    {/* Toggle 3 */}
                                    <div className="flex items-center justify-between p-4 transition-colors rounded-lg hover:bg-[var(--color-bg-tertiary)]">
                                        <div>
                                            <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Real-time Recalculation</p>
                                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Update candidate scores immediately when weights are changed.</p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input className="toggle-checkbox absolute block w-5 h-5 rounded-full border-4 appearance-none cursor-pointer" id="toggle3" name="toggle" type="checkbox" style={{ background: 'var(--color-text-muted)', borderColor: 'transparent' }} />
                                            <label className="toggle-label block overflow-hidden h-5 rounded-full cursor-pointer" htmlFor="toggle3" style={{ background: 'var(--color-bg-tertiary)' }}></label>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Audit Log Snippet */}
                            <section>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>receipt_long</span>
                                    Recent Activity
                                </h3>
                                <div className="border rounded-xl p-6 backdrop-blur-sm relative overflow-hidden" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                                    {/* Left glowing line */}
                                    <div className="absolute left-6 top-6 bottom-6 w-0.5" style={{ background: 'var(--color-primary)', opacity: 0.2 }}></div>
                                    <div className="space-y-6 pl-6 relative">
                                        {/* Log Item 1 */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full border" style={{ background: 'var(--color-primary)', borderColor: 'var(--color-bg)' }}></div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Weights Updated</p>
                                                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>10:42 AM</span>
                                                </div>
                                                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Admin adjusted Technical Expertise from 80% to {techWeight}%.</p>
                                            </div>
                                        </div>
                                        {/* Log Item 2 */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full border border-[var(--color-bg)]" style={{ background: 'var(--color-text-muted)' }}></div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Bias Mitigation Enabled</p>
                                                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>Yesterday, 4:15 PM</span>
                                                </div>
                                                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>System preference changed by Admin.</p>
                                            </div>
                                        </div>
                                        {/* Log Item 3 */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full border border-[var(--color-bg)]" style={{ background: 'var(--color-text-muted)' }}></div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Algorithm Recalibration</p>
                                                    <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>Oct 12, 09:00 AM</span>
                                                </div>
                                                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Automated weekly model recalibration completed successfully.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Save Button */}
                            <div className="flex justify-end pt-4 pb-12">
                                <button onClick={handleSave} className="btn-primary px-8 py-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    Save Configuration
                                </button>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
