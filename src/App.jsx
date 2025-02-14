import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import AdminDashboard from "./components/dashboard/Admindashboard";
import Employee from "./components/dashboard/Employee";
import CreateMember from "./components/dashboard/CreateMember";

const ProtectedRoute = ({ role, children }) => {
  const storedRole = localStorage.getItem("role")?.toLowerCase();
  const token = localStorage.getItem("token");

  if (!token || storedRole !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/createmember" element={<ProtectedRoute role="admin"><CreateMember /></ProtectedRoute>} />
        <Route path="/employee" element={<ProtectedRoute role="employee"><Employee /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
