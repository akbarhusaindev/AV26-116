// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import DashboardLayout from "./layouts/DashboardLayout.jsx";
// import Login from "./pages/Login.jsx";
// import Register from "./pages/Register.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// import Tasks from "./pages/Tasks.jsx";
// import Profile from "./pages/Profile.jsx";

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route
//         element={
//           <ProtectedRoute>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/tasks" element={<Tasks />} />
//         <Route path="/profile" element={<Profile />} />
//       </Route>
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// }

import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Profile from "./pages/Profile.jsx";
import Notes from "./pages/Notes.jsx"; // 🆕 ADD THIS

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />

        {/* 🆕 NOTES ROUTE ADDED */}
        <Route path="/notes" element={<Notes />} />

        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}