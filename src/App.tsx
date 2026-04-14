import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Client pages
import ClientDashboard from './pages/client/Dashboard';
import ClientJobsPage from './pages/client/JobsPage';
import ClientCandidatesPage from './pages/client/CandidatesPage';
import UploadJDPage from './pages/client/UploadJDPage';
import BillingPage from './pages/client/BillingPage';
import InviteCandidatePage from './pages/client/InviteCandidatePage';
import AssessmentViewPage from './pages/client/AssessmentViewPage';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminSettings from './pages/admin/Settings';
import AdminEmailTemplates from './pages/admin/EmailTemplates';
import AdminFeatureFlags from './pages/admin/FeatureFlags';
import AdminRoleTemplates from './pages/admin/RoleTemplates';
import AdminScoringWeights from './pages/admin/ScoringWeights';
import AdminAuditLog from './pages/admin/AuditLog';

// Candidate pages
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateOnboarding from './pages/candidate/Onboarding';
import CompleteProfile from './pages/candidate/CompleteProfile';
import TestPage from './pages/candidate/TestPage';
import ResultsPage from './pages/candidate/ResultsPage';

// Public
import LandingPage from './pages/public/LandingPage';
import ComingSoon from './pages/public/ComingSoon';
import ClientOnboarding from './pages/client/ClientOnboarding';
import AnalyticsPage from './pages/client/AnalyticsPage';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } });

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  
  // Force incomplete profiles to their respective onboarding pages
  if (!user?.isProfileComplete) {
    if (user?.role === 'candidate') return <Navigate to="/complete-profile" replace />;
    if (user?.role === 'client') return <Navigate to="/client/setup" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '14px' },
            success: { iconTheme: { primary: 'var(--color-success)', secondary: 'var(--color-bg)' } },
            error: { iconTheme: { primary: 'var(--color-danger)', secondary: 'var(--color-bg)' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/test/:token" element={<TestPage />} />

          {/* Setup Pages (Ungated by ProtectedRoute to avoid infinite loops) */}
          <Route path="/complete-profile" element={
            (() => {
              const { isAuthenticated, user } = useAuthStore();
              if (!isAuthenticated) return <Navigate to="/login" replace />;
              if (user?.role !== 'candidate') return <Navigate to="/" replace />;
              return <CompleteProfile />;
            })()
          } />

          <Route path="/client/setup" element={
            (() => {
              const { isAuthenticated, user } = useAuthStore();
              if (!isAuthenticated) return <Navigate to="/login" replace />;
              if (user?.role !== 'client') return <Navigate to="/" replace />;
              return <ClientOnboarding />;
            })()
          } />

          {/* Client Routes */}
          <Route path="/client">
            {/* Standalone Stitch Client Pages */}
            <Route path="analytics" element={<ProtectedRoute roles={['client', 'admin']}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="jobs/:jdId/candidates" element={<ProtectedRoute roles={['client', 'admin']}><ClientCandidatesPage /></ProtectedRoute>} />

            {/* Layout Wrapped pages */}
            <Route element={<ProtectedRoute roles={['client', 'admin']}><DashboardLayout role="client" /></ProtectedRoute>}>
              <Route index element={<ClientDashboard />} />
              <Route path="jobs" element={<ClientJobsPage />} />
              <Route path="jobs/upload" element={<UploadJDPage />} />
              <Route path="jobs/:jdId/invite" element={<InviteCandidatePage />} />
              <Route path="jobs/:jdId/assessment" element={<AssessmentViewPage />} />
              <Route path="billing" element={<BillingPage />} />
            </Route>
          </Route>

          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout role="admin" /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="email-templates" element={<AdminEmailTemplates />} />
            <Route path="feature-flags" element={<AdminFeatureFlags />} />
            <Route path="role-templates" element={<AdminRoleTemplates />} />
            <Route path="audit-log" element={<AdminAuditLog />} />
          </Route>

          {/* Standalone Stitch Admin Pages */}
          <Route path="/admin/scoring" element={<ProtectedRoute roles={['admin']}><AdminScoringWeights /></ProtectedRoute>} />

          {/* Candidate Dashboard */}
          <Route path="/candidate" element={<ProtectedRoute roles={['candidate', 'admin']}><DashboardLayout role="candidate" /></ProtectedRoute>}>
            <Route index element={<CandidateDashboard />} />
            <Route path="onboard" element={<CandidateOnboarding />} />
            <Route path="results/:attemptId" element={<ResultsPage />} />
          </Route>

          <Route path="/unauthorized" element={<div style={{ color: 'white', padding: 40 }}>Access denied.</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

