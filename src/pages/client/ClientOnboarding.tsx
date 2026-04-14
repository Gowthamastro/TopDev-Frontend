import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import {
    Building2, FileText, Globe, ShieldCheck, 
    ChevronRight, Loader2, User, Layout
} from 'lucide-react';

export default function ClientOnboarding() {
    const navigate = useNavigate();
    const { user, updateProfileComplete } = useAuthStore();
    const [activeTab, setActiveTab] = useState('company.config.ts');

    const [form, setForm] = useState({
        company_name: '',
        company_size: '10-50',
        industry: '',
        website: '',
    });

    const { data: dashboardData } = useQuery({
        queryKey: ['client-dashboard'],
        queryFn: async () => {
            const res = await api.get('/api/v1/clients/dashboard');
            return res.data;
        },
    });

    useEffect(() => {
        if (dashboardData?.client) {
            setForm(prev => ({
                ...prev,
                company_name: dashboardData.client.company_name || '',
                // other fields could be fetched if there was a separate profile GET
            }));
        }
    }, [dashboardData]);

    const onboardMutation = useMutation({
        mutationFn: async () => {
            return api.post('/api/v1/clients/onboard', form);
        },
        onSuccess: (res) => {
            updateProfileComplete(true);
            toast.success('Workspace setup finalized! 🚀');
            navigate('/client');
        },
        onError: () => toast.error('Failed to save company profile'),
    });

    const tabs = [
        { id: 'company.config.ts', label: 'company.config.ts', icon: <Building2 size={14} /> },
        { id: 'hiring.json', label: 'hiring.json', icon: <Layout size={14} /> },
        { id: 'finalize.sh', label: 'finalize.sh', icon: <Loader2 size={14} /> },
    ];

    const renderSmartInput = (label: string, value: any, key: string, placeholder: string, type: 'text' | 'number' | 'select' = 'text', options?: {label:string, value:any}[]) => (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingLeft: 20, marginBottom: 4 }}>
            <span style={{ color: '#ABB2BF', fontSize: 13, minWidth: 120 }}>{label}:</span>
            {type === 'select' ? (
                <select 
                    style={{ background: 'transparent', border: 'none', color: '#98C379', outline: 'none', cursor: 'pointer', fontSize: 13 }}
                    value={value}
                    onChange={(e) => setForm({...form, [key]: e.target.value})}
                >
                    {options?.map(opt => <option key={opt.value} value={opt.value} style={{ background: '#1e1e1e' }}>{opt.label}</option>)}
                </select>
            ) : (
                <input 
                    type={type}
                    style={{ background: 'transparent', border: 'none', color: value ? '#98C379' : '#5C6370', outline: 'none', fontSize: 13, width: '100%' }}
                    value={value}
                    onChange={(e) => setForm({...form, [key]: e.target.value})}
                    placeholder={`'${placeholder}'`}
                />
            )}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--color-bg)' }}>
            <SEO title="Company Setup | TopDev" description="Set up your recruitment workspace" />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{ width: 44, height: 44, background: 'var(--color-primary)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Building2 size={22} style={{ color: 'var(--color-bg)' }} />
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: 'var(--color-text)', fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em' }}>
                    Setup your recruitment workspace
                </h1>
                <p style={{ color: 'var(--color-text-muted)', margin: '8px 0 0', fontSize: 14 }}>Configure your company profile and hiring preferences</p>
            </div>

            {/* IDE Workspace */}
            <div style={{ 
                width: '100%', 
                maxWidth: 900, 
                height: 550,
                background: '#1e1e1e', 
                borderRadius: 16, 
                border: '1px solid var(--glass-border)',
                display: 'flex',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }} className="animate-fadeInUp">
                
                {/* Sidebar */}
                <div style={{ width: 220, background: '#181818', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#c678dd', textTransform: 'uppercase', letterSpacing: 1 }}>Workspace</div>
                    {tabs.map(tab => (
                        <div 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ 
                                padding: '8px 16px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 10, 
                                cursor: 'pointer',
                                background: activeTab === tab.id ? '#2c2c2c' : 'transparent',
                                color: activeTab === tab.id ? '#fff' : '#858585',
                                fontSize: 13,
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ color: activeTab === tab.id ? 'var(--color-primary)' : 'inherit' }}>{tab.icon}</span>
                            {tab.label}
                        </div>
                    ))}

                    <div style={{ marginTop: 'auto', padding: 20 }}>
                        <div style={{ fontSize: 11, color: '#858585', marginBottom: 8 }}>CONFIG STATUS</div>
                        <div style={{ fontSize: 10, color: '#5C6370' }}>Branch: <span style={{ color: '#98C379' }}>main</span></div>
                        <div style={{ fontSize: 10, color: '#5C6370', marginTop: 4 }}>Environment: <span style={{ color: '#D19A66' }}>production</span></div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#252526', display: 'flex', borderBottom: '1px solid #333' }}>
                        {tabs.map(tab => (
                            <div 
                                key={tab.id}
                                style={{ 
                                    padding: '10px 20px', 
                                    fontSize: 12, 
                                    color: activeTab === tab.id ? '#fff' : '#969696',
                                    background: activeTab === tab.id ? '#1e1e1e' : '#2d2d2d',
                                    borderRight: '1px solid #181818',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    cursor: 'pointer'
                                }}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.icon} {tab.label}
                                {activeTab === tab.id && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                            </div>
                        ))}
                    </div>

                    <div style={{ flex: 1, padding: 32, overflowY: 'auto', fontFamily: "'Fira Code', 'Roboto Mono', monospace" }}>
                        
                        {activeTab === 'company.config.ts' && (
                            <>
                                <div style={{ color: '#C678DD', marginBottom: 8 }}>import <span style={{ color: '#D19A66' }}>{'{'} Company {'}'}</span> from <span style={{ color: '#98C379' }}>'@topdev/org'</span>;</div>
                                <div style={{ color: '#E06C75', marginBottom: 20 }}><span style={{ color: '#C678DD' }}>export const</span> org = <span style={{ color: '#C678DD' }}>new</span> <span style={{ color: '#D19A66' }}>Company</span>({'{'}</div>
                                
                                {renderSmartInput('name', form.company_name, 'company_name', 'Acme Corp')}
                                {renderSmartInput('website', form.website, 'website', 'https://acme.com')}
                                {renderSmartInput('industry', form.industry, 'industry', 'Technology')}
                                {renderSmartInput('size', form.company_size, 'company_size', '10-50', 'select', [
                                    { label: 'Seed (1-10)', value: '1-10' },
                                    { label: 'Startup (10-50)', value: '10-50' },
                                    { label: 'Growth (50-200)', value: '50-200' },
                                    { label: 'Enterprise (200+)', value: '200+' },
                                ])}

                                <div style={{ color: '#E06C75', marginTop: 8 }}>{'}'});</div>
                            </>
                        )}

                        {activeTab === 'hiring.json' && (
                            <>
                                <div style={{ color: '#ABB2BF', marginBottom: 20 }}>{'{'}</div>
                                <div style={{ paddingLeft: 20 }}>
                                    <div style={{ color: '#ABB2BF', fontSize: 13, marginBottom: 4 }}>"goals": [</div>
                                    <div style={{ color: '#98C379', fontSize: 13, paddingLeft: 20 }}>"Build top-tier engineering team",</div>
                                    <div style={{ color: '#98C379', fontSize: 13, paddingLeft: 20 }}>"Reduce time-to-hire by 50%",</div>
                                    <div style={{ color: '#98C379', fontSize: 13, paddingLeft: 20 }}>"Access pre-vetted tech talent"</div>
                                    <div style={{ color: '#ABB2BF', fontSize: 13 }}>],</div>
                                    <div style={{ color: '#ABB2BF', fontSize: 13, marginTop: 4 }}>"autoscale_hiring": <span style={{ color: '#D19A66' }}>true</span></div>
                                </div>
                                <div style={{ color: '#ABB2BF', marginTop: 8 }}>{'}'}</div>
                            </>
                        )}

                        {activeTab === 'finalize.sh' && (
                            <div style={{ color: '#ABB2BF', fontSize: 13 }}>
                                <div style={{ marginBottom: 16 }}><span style={{ color: '#98C379' }}>$</span> <span style={{ color: '#61AFEF' }}>topdev</span> check-config</div>
                                <div style={{ paddingLeft: 20, marginBottom: 24 }}>
                                    <div style={{ color: '#98C379', marginBottom: 4 }}>✓ Company details verified</div>
                                    <div style={{ color: '#98C379', marginBottom: 4 }}>✓ Legal compliance check: PASS</div>
                                    <div style={{ color: '#98C379' }}>✓ Workspaces provisioned</div>
                                </div>
                                <div><span style={{ color: '#98C379' }}>$</span> <span style={{ color: '#61AFEF' }}>topdev</span> finalize --workspace</div>
                                <div style={{ paddingLeft: 20, marginTop: 8 }}>
                                    <button 
                                        className="btn-primary" 
                                        onClick={() => onboardMutation.mutate()}
                                        disabled={onboardMutation.isPending}
                                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 24px', fontSize: 13 }}
                                    >
                                        {onboardMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                                        Launch Workspace
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
