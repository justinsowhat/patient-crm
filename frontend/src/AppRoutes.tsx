import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./shared/components/protectedRoute";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Patients from "./pages/Patients";
import { SideNavBar } from "./shared";
import PatientPage from "./pages/Patient";

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<SideNavBar />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patient" element={<PatientPage />} />
            <Route path="/patient/:id" element={<PatientPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};
