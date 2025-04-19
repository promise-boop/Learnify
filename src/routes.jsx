import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Layout Components
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

// Page Components
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Survey from "./pages/Survey";
import Dashboard from "./pages/Dashboard";
import MySubjects from "./pages/MySubjects";
import Progress from "./pages/Progress";
import Credits from "./pages/Credits";
import ComingSoon from "./pages/ComingSoon";
import Terms from "./pages/Terms";
import Support from "./pages/Support";
import StudyPage from "./pages/StudyPage";
import ChatbotPage from "./pages/ChatbotPage";
import NotFound from "./pages/NotFound";
import TopicSelection from "./pages/TopicSelection";
import QuizPage from "./pages/QuizPage";
import NoteEditor from "./pages/NoteEditor";
import RamseySettings from "./pages/RamseySettings";
import ContactUs from "./pages/ContactUs";

// Protected Route Component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // User is authenticated, render the layout with outlet
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Survey Gate Component
const SurveyGate = () => {
  const { user, loading, hasCompletedSurvey } = useAuth();
  
  // Show loading state while checking
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // Redirect to survey if not completed
  if (user && !hasCompletedSurvey) {
    return <Navigate to="/survey" replace />;
  }
  
  // Survey completed, render the children
  return <Outlet />;
};

// Public Routes (accessible without login)
const PublicRoute = () => {
  const { user } = useAuth();
  
  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

// Router Configuration
const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "auth", element: <Auth /> },
      { path: "terms", element: <Terms /> }
    ]
  },
  
  // Survey route - requires authentication but not survey completion
  {
    path: "/survey",
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Survey /> }
    ]
  },
  
  // Protected routes - require authentication and survey completion
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <SurveyGate />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "my-subjects", element: <MySubjects /> },
          { path: "my-subjects/:level", element: <MySubjects /> },
          { path: "progress", element: <Progress /> },
          { path: "credits", element: <Credits /> },
          { path: "coming-soon", element: <ComingSoon /> },
          { path: "support", element: <Support /> },
          { path: "contact-us", element: <ContactUs /> },
          
          // Subject and learning routes
          { path: "subjects/:subjectId/topics", element: <TopicSelection /> },
          { path: "subjects/:subjectId/topics/:topicId", element: <StudyPage /> },
          { path: "subjects/:subjectId/topics/:topicId/quiz", element: <QuizPage /> },
          
          // Notes editor
          { path: "notes", element: <NoteEditor /> },
          { path: "notes/:noteId", element: <NoteEditor /> },
          
          // Ramsey chatbot routes
          { path: "ramsey", element: <RamseySettings /> },
          { path: "ramsey/chat", element: <ChatbotPage /> }
        ]
      }
    ]
  },
  
  // 404 Not Found
  { path: "*", element: <NotFound /> }
]);

export default router;