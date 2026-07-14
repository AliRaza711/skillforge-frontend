import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Courses } from './pages/Courses';
import { CourseDetails } from './pages/CourseDetails';
import { Certificates } from './pages/Certificates';
import { TeamCompliance } from './pages/TeamCompliance';
import { AssignCourses } from './pages/AssignCourses';
import { CourseManagement } from './pages/CourseManagement';
import { AIQuizGenerator } from './pages/AIQuizGenerator';
import { CompanyCompliance } from './pages/CompanyCompliance';
import { Reports } from './pages/Reports';
import { Unauthorized } from './pages/Unauthorized';
import { NotFound } from './pages/NotFound';
import { useAuthStore } from './store/useAuthStore';

// Root Redirect Component
function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect authenticated user to their role's dashboard
  switch (user.role) {
    case 'Employee':
      return <Navigate to="/courses" replace />;
    case 'Manager':
      return <Navigate to="/team-compliance" replace />;
    case 'ContentAdmin':
      return <Navigate to="/course-management" replace />;
    case 'HRAdmin':
      return <Navigate to="/company-compliance" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Protected Routes inside DashboardLayout */}
      <Route element={<DashboardLayout />}>
        
        {/* Employee Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/certificates" element={<Certificates />} />
        </Route>

        {/* Manager Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Manager']} />}>
          <Route path="/team-compliance" element={<TeamCompliance />} />
          <Route path="/assign-courses" element={<AssignCourses />} />
        </Route>

        {/* Content Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ContentAdmin']} />}>
          <Route path="/course-management" element={<CourseManagement />} />
          <Route path="/ai-quiz-generator" element={<AIQuizGenerator />} />
        </Route>

        {/* HR Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['HRAdmin']} />}>
          <Route path="/company-compliance" element={<CompanyCompliance />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
