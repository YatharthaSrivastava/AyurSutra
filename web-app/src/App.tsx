import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import PatientOnboardingPage from "@/pages/PatientOnboardingPage";
import PrakritiQuizPage from "@/pages/PrakritiQuizPage";
import SchedulePage from "@/pages/SchedulePage";
import TherapistVitalsPage from "@/pages/TherapistVitalsPage";
import TreatmentPlanPage from "@/pages/TreatmentPlanPage";
import VaidyaPatientsPage from "@/pages/VaidyaPatientsPage";
import AICareAssistantPage from "@/pages/AICareAssistantPage";
import BillingPage from "@/pages/BillingPage";
import NotificationsPage from "@/pages/NotificationsPage";
import TherapistWorkloadPage from "@/pages/TherapistWorkloadPage";
import AdminMasterPage from "@/pages/AdminMasterPage";
import AdminAuditLogsPage from "@/pages/AdminAuditLogsPage";
import TherapyTrackerPage from "@/pages/TherapyTrackerPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <SchedulePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/therapy-tracker"
            element={
              <ProtectedRoute roles={["PATIENT", "VAIDYA", "ADMIN", "THERAPIST"]}>
                <TherapyTrackerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/treatment-plans"
            element={
              <ProtectedRoute>
                <TreatmentPlanPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vaidya/patients"
            element={
              <ProtectedRoute roles={["VAIDYA", "ADMIN"]}>
                <VaidyaPatientsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/therapist/vitals"
            element={
              <ProtectedRoute roles={["THERAPIST", "VAIDYA"]}>
                <TherapistVitalsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/therapist/workload"
            element={
              <ProtectedRoute roles={["ADMIN", "VAIDYA", "THERAPIST"]}>
                <TherapistWorkloadPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute roles={["ADMIN", "VAIDYA", "PATIENT"]}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/ai-assistant"
            element={
              <ProtectedRoute>
                <AICareAssistantPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/billing"
            element={
              <ProtectedRoute roles={["ADMIN", "VAIDYA", "PATIENT"]}>
                <BillingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/master"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminMasterPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute roles={["ADMIN", "VAIDYA"]}>
                <AdminAuditLogsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/onboarding"
            element={
              <ProtectedRoute roles={["PATIENT", "VAIDYA", "ADMIN"]}>
                <PatientOnboardingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/prakriti"
            element={
              <ProtectedRoute roles={["PATIENT", "VAIDYA"]}>
                <PrakritiQuizPage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
