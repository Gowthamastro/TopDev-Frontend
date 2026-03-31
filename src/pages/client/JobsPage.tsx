import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Clock, Briefcase, Zap, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function JobsPage() {
    const { data: jobs, isLoading, isError } = useQuery({
        queryKey: ['client-jobs'],
        queryFn: () => api.get('/api/v1/jobs/').then(r => r.data)
    });

    const statusColors: Record<string, string> = {
        active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        draft: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        archived: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
        filled: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20'
    };

    const diffColors: Record<string, string> = {
        beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        advanced: 'text-red-400 bg-red-400/10 border-red-400/20'
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Briefcase className="text-indigo-400" size={28} />
                        Active Roles
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-xl leading-relaxed">
                        Manage your open positions, track candidate performance, and review AI-generated assessments in one unified command center.
                    </p>
                </div>
                <Link to="/client/jobs/upload" className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    <Plus size={18} />
                    <span>Deploy New Role</span>
                </Link>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-xl border border-white/5 space-y-4">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                    <p className="text-slate-400 text-sm animate-pulse">Initializing role data...</p>
                </div>
            ) : isError ? (
                <div className="p-8 glass-panel rounded-xl border border-red-500/20 flex flex-col items-center text-center">
                    <AlertCircle className="text-red-400 mb-3" size={32} />
                    <h3 className="text-white font-medium mb-1">Failed to load roles</h3>
                    <p className="text-slate-400 text-sm">There was an error communicating with the server.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(jobs || []).map((job: any) => (
                        <div key={job.id} className="glass-panel border border-white/5 rounded-xl p-6 hover:border-indigo-500/30 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                            {/* Subtle background glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className="space-y-3 w-full">
                                    <h3 className="text-lg font-semibold text-white truncate pr-4 group-hover:text-indigo-300 transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full border uppercase tracking-wider font-semibold ${statusColors[job.status] || statusColors.archived}`}>
                                            {job.status}
                                        </span>
                                        {job.difficulty && (
                                            <span className={`text-[10px] px-2.5 py-1 rounded-full border uppercase tracking-wider font-semibold ${diffColors[job.difficulty] || diffColors.beginner}`}>
                                                {job.difficulty}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Skills Tag Cloud */}
                            <div className="flex flex-wrap gap-2 mb-6 relative z-10 flex-grow">
                                {(job.skills || []).slice(0, 4).map((sk: string) => (
                                    <span key={sk} className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-slate-300 rounded-md">
                                        {sk}
                                    </span>
                                ))}
                                {(job.skills || []).length > 4 && (
                                    <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/5 text-slate-500 rounded-md">
                                        +{(job.skills || []).length - 4}
                                    </span>
                                )}
                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto relative z-10">
                                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                    <Clock size={12} className="text-slate-400" />
                                    {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <div className="flex items-center gap-3">
                                    <Link to={`/client/jobs/${job.id}/assessment`} className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1" title="View AI Assessment">
                                        <Zap size={14} className="text-indigo-400" /> Test
                                    </Link>
                                    <Link to={`/client/jobs/${job.id}/candidates`} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1 group/link">
                                        Pipeline <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!jobs || jobs.length === 0) && !isError && (
                        <div className="col-span-full py-20 glass-panel border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
                                <Briefcase className="text-indigo-400" size={28} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No active roles</h3>
                            <p className="text-slate-400 max-w-md mx-auto mb-6">Deploy your first AI-powered job assessment to start screening elite engineering talent.</p>
                            <Link to="/client/jobs/upload" className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all flex items-center gap-2">
                                <Plus size={16} /> Create Role
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
