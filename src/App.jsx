import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import AdminDashboard from "./components/dashboard/teamlead/Admindashboard";
import Employee from "./components/dashboard/employeedashboard/Employee";
import CreateMember from "./components/dashboard/CreateMember";

const ProtectedRoute = ({ role, element }) => {
  const storedRole = localStorage.getItem("role")?.toLowerCase();
  const token = localStorage.getItem("token");

  if (!token || storedRole !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return element;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={<ProtectedRoute role="admin" element={<AdminDashboard />} />}
        />
        <Route
          path="/admin/createmember"
          element={<ProtectedRoute role="admin" element={<CreateMember />} />}
        />
        <Route
          path="/employee"
          element={<ProtectedRoute role="employee" element={<Employee />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
