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
        <div className="dark bg-[#101622] text-slate-100 font-display min-h-screen font-['Inter'] animate-fadeInUp">
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
                    background: #ffffff;
                    cursor: pointer;
                    margin-top: -6px;
                    box-shadow: 0 0 10px rgba(13, 89, 242, 0.5);
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                }
                input[type=range]:focus {
                    outline: none;
                }
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #0d59f2;
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #0d59f2;
                    box-shadow: 0 0 10px rgba(13, 89, 242, 0.5);
                }
                .toggle-checkbox {
                    right: 0;
                    z-index: 1;
                    border-color: #e2e8f0;
                    transition: all 0.3s ease;
                }
                .toggle-label {
                    width: 2.5rem;
                    height: 1.25rem;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 9999px;
                    transition: all 0.3s ease;
                }
            `}</style>

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-black/20 border-r border-white/5 backdrop-blur-xl flex flex-col justify-between">
                    <div className="p-4 flex flex-col gap-6">
                        {/* User Profile */}
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0d59f2] to-purple-600 p-[1px]">
                                <div className="w-full h-full rounded-full bg-[#101622] flex items-center justify-center overflow-hidden">
                                    <img alt="Admin Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDygtz7NSxPaT_xuPPLlJlm8sD2u0s-Qm8JXi_wHrzgAv10NqCXNMJcUMkX3Gm4gLPOtu-CWXF8bveM0zLOfbjjm7LyRdzKw9GomYvo-DtiU9mnet0Jc11zqrL8bKsVDp0UdTBDAj2dTrOvmRIFyXQOlaEm8nXH2KOZCHCbD2-64XOzgWmXpeWFEL7L4iCJfgkm2kV_R0VnFn7NedZdvZizP2UTu9wy6v62EiLwtf2Ey4TpRBcPca2ia5dbc2PYbq2eGPZjzww5-vY" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-sm font-semibold tracking-wide">TopDev Control</h1>
                                <p className="text-xs text-slate-400">Admin Terminal</p>
                            </div>
                        </div>
                        {/* Navigation */}
                        <nav className="flex flex-col gap-1">
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" to="/admin">
                                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0d59f2]/20 text-[#0d59f2] border border-[#0d59f2]/20 shadow-[0_0_15px_rgba(13,89,242,0.15)]" to="/admin/scoring">
                                <span className="material-symbols-outlined text-[20px]">tune</span>
                                <span className="text-sm font-medium">Algorithm</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" to="/admin/settings">
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                <span className="text-sm font-medium">Settings</span>
                            </Link>
                            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" to="/admin/audit-log">
                                <span className="material-symbols-outlined text-[20px]">history</span>
                                <span className="text-sm font-medium">Audit Logs</span>
                            </Link>
                        </nav>
                    </div>
                    <div className="p-4">
                        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            <span className="text-sm font-medium">Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0d59f2]/10 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                    {/* Header */}
                    <header className="px-8 py-6 border-b border-white/5 bg-[#101622]/50 backdrop-blur-md z-10">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold tracking-tight">Scoring Weights &amp; Settings</h2>
                            <p className="text-sm text-slate-400">Configure AI recruitment algorithm weights and system preferences.</p>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 z-10">
                        <div className="max-w-4xl mx-auto space-y-12">

                            {/* Algorithm Weights Section */}
                            <section>
                                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#0d59f2]">analytics</span>
                                    Algorithm Weights
                                </h3>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-8 backdrop-blur-sm">
                                    {/* Slider 1 */}
                                    <div className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-sm font-medium text-slate-200">Technical Expertise</p>
                                                <p className="text-xs text-slate-500">Weight applied to coding assessments and technical interviews.</p>
                                            </div>
                                            <span className="text-[#0d59f2] font-mono text-sm font-bold">{techWeight}%</span>
                                        </div>
                                        <div className="relative w-full h-4 flex items-center">
                                            <div className="absolute left-0 h-1 bg-[#0d59f2] rounded-l-full" style={{ width: `${techWeight}%`, boxShadow: '0 0 10px rgba(13,89,242,0.4)' }}></div>
                                            <input className="w-full absolute z-10 opacity-0 cursor-pointer" max="100" min="0" type="range" value={techWeight} onChange={e => setTechWeight(Number(e.target.value))} />
                                            <div className="absolute w-full h-1 bg-white/10 rounded-full pointer-events-none"></div>
                                            <div className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_10px_rgba(13,89,242,0.8)] border-2 border-[#0d59f2] pointer-events-none" style={{ left: `calc(${techWeight}% - 8px)` }}></div>
                                        </div>
                                    </div>
                                    {/* Slider 2 */}
                                    <div className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-sm font-medium text-slate-200">Communication Skills</p>
                                                <p className="text-xs text-slate-500">Weight for natural language processing of interview transcripts.</p>
                                            </div>
                                            <span className="text-[#0d59f2] font-mono text-sm font-bold">{commWeight}%</span>
                                        </div>
                                        <div className="relative w-full h-4 flex items-center">
                                            <div className="absolute left-0 h-1 bg-[#0d59f2] rounded-l-full" style={{ width: `${commWeight}%`, boxShadow: '0 0 10px rgba(13,89,242,0.4)' }}></div>
                                            <input className="w-full absolute z-10 opacity-0 cursor-pointer" max="100" min="0" type="range" value={commWeight} onChange={e => setCommWeight(Number(e.target.value))} />
                                            <div className="absolute w-full h-1 bg-white/10 rounded-full pointer-events-none"></div>
                                            <div className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_10px_rgba(13,89,242,0.8)] border-2 border-[#0d59f2] pointer-events-none" style={{ left: `calc(${commWeight}% - 8px)` }}></div>
                                        </div>
                                    </div>
                                    {/* Slider 3 */}
                                    <div className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-sm font-medium text-slate-200">Cultural Fit</p>
                                                <p className="text-xs text-slate-500">Alignment with company core values and team dynamics.</p>
                                            </div>
                                            <span className="text-[#0d59f2] font-mono text-sm font-bold">{cultWeight}%</span>
                                        </div>
                                        <div className="relative w-full h-4 flex items-center">
                                            <div className="absolute left-0 h-1 bg-[#0d59f2] rounded-l-full" style={{ width: `${cultWeight}%`, boxShadow: '0 0 10px rgba(13,89,242,0.4)' }}></div>
                                            <input className="w-full absolute z-10 opacity-0 cursor-pointer" max="100" min="0" type="range" value={cultWeight} onChange={e => setCultWeight(Number(e.target.value))} />
                                            <div className="absolute w-full h-1 bg-white/10 rounded-full pointer-events-none"></div>
                                            <div className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_10px_rgba(13,89,242,0.8)] border-2 border-[#0d59f2] pointer-events-none" style={{ left: `calc(${cultWeight}% - 8px)` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* System Preferences */}
                            <section>
                                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#0d59f2]">toggle_on</span>
                                    System Preferences
                                </h3>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-2 backdrop-blur-sm divide-y divide-white/5">
                                    {/* Toggle 1 */}
                                    <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">Auto-reject below threshold</p>
                                            <p className="text-xs text-slate-500">Automatically decline candidates scoring below 40%.</p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" id="toggle1" name="toggle" type="checkbox" />
                                            <label className="toggle-label block overflow-hidden h-5 rounded-full bg-[#0d59f2] cursor-pointer" htmlFor="toggle1"></label>
                                        </div>
                                    </div>
                                    {/* Toggle 2 */}
                                    <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">Enable Bias Mitigation</p>
                                            <p className="text-xs text-slate-500">Apply anonymization to candidate profiles during initial screening.</p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" id="toggle2" name="toggle" type="checkbox" />
                                            <label className="toggle-label block overflow-hidden h-5 rounded-full bg-[#0d59f2] cursor-pointer" htmlFor="toggle2"></label>
                                        </div>
                                    </div>
                                    {/* Toggle 3 */}
                                    <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">Real-time Recalculation</p>
                                            <p className="text-xs text-slate-500">Update candidate scores immediately when weights are changed.</p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-slate-400 border-4 appearance-none cursor-pointer" id="toggle3" name="toggle" type="checkbox" />
                                            <label className="toggle-label block overflow-hidden h-5 rounded-full bg-white/10 cursor-pointer" htmlFor="toggle3"></label>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Audit Log Snippet */}
                            <section>
                                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#0d59f2]">receipt_long</span>
                                    Recent Activity
                                </h3>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
                                    {/* Left glowing line */}
                                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#0d59f2]/50 via-[#0d59f2]/20 to-transparent"></div>
                                    <div className="space-y-6 pl-6 relative">
                                        {/* Log Item 1 */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-[#0d59f2] shadow-[0_0_8px_rgba(13,89,242,0.8)] border border-[#101622]"></div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-slate-200">Weights Updated</p>
                                                    <span className="text-xs text-slate-500 font-mono">10:42 AM</span>
                                                </div>
                                                <p className="text-xs text-slate-400">Admin adjusted Technical Expertise from 80% to {techWeight}%.</p>
                                            </div>
                                        </div>
                                        {/* Log Item 2 */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-white/30 border border-[#101622]"></div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-slate-200">Bias Mitigation Enabled</p>
                                                    <span className="text-xs text-slate-500 font-mono">Yesterday, 4:15 PM</span>
                                                </div>
                                                <p className="text-xs text-slate-400">System preference changed by Admin.</p>
                                            </div>
                                        </div>
                                        {/* Log Item 3 */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-white/30 border border-[#101622]"></div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-slate-200">Algorithm Recalibration</p>
                                                    <span className="text-xs text-slate-500 font-mono">Oct 12, 09:00 AM</span>
                                                </div>
                                                <p className="text-xs text-slate-400">Automated weekly model recalibration completed successfully.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Save Button */}
                            <div className="flex justify-end pt-4 pb-12">
                                <button onClick={handleSave} className="bg-[#0d59f2] hover:bg-[#0d59f2]/90 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(13,89,242,0.3)] transition-all flex items-center gap-2 cursor-pointer">
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
