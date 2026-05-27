import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// =========================
// AUTH
// =========================
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// =========================
// PAGES
// =========================
import Login from "./pages/Login";
import App from "./App";
import Courses from "./pages/Courses";

import Students from "./pages/Students";
import StudentsTable from "./pages/StudentsTable";
import Dropout from "./pages/Dropout";

import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import AttendanceReport from "./pages/AttendanceReport";
import Profile from "./pages/Profile";
import Timetable from "./pages/Timetable";
import Marks from "./pages/Marks";
import StudentView from "./pages/StudentView";
import Teachers from "./pages/Teachers";
import TeacherProfile from "./pages/TeacherProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// =========================
// RENDER
// =========================

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── PUBLIC ── */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ── DASHBOARD ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />

          {/* ── STUDENTS TABLE (list page) ── */}
          <Route
            path="/students-list"
            element={
              <ProtectedRoute>
                <StudentsTable />
              </ProtectedRoute>
            }
          />

          {/* ── ADD STUDENT (form, no table) ── */}
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />

          {/* ── EDIT STUDENT ── */}
          <Route
            path="/students/edit/:id"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />

          {/* ── STUDENT VIEW (detail) ── */}
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute>
                <StudentView />
              </ProtectedRoute>
            }
          />

          {/* ── DROPOUT ── */}
          <Route
            path="/dropout"
            element={
              <ProtectedRoute>
                <Dropout />
              </ProtectedRoute>
            }
          />

          {/* ── COURSES ── */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />

          {/* ── ATTENDANCE ── */}
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />

          {/* ── FEES ── */}
          <Route
            path="/fees"
            element={
              <ProtectedRoute>
                <Fees />
              </ProtectedRoute>
            }
          />

          {/* ── TEACHERS ── */}
          <Route
            path="/teachers"
            element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers/:id"
            element={
              <ProtectedRoute>
                <TeacherProfile />
              </ProtectedRoute>
            }
          />

          {/* ── ATTENDANCE REPORT ── */}
          <Route
            path="/attendance-report"
            element={
              <ProtectedRoute>
                <AttendanceReport />
              </ProtectedRoute>
            }
          />

          {/* ── PROFILE ── */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ── TIMETABLE ── */}
          <Route
            path="/timetable"
            element={
              <ProtectedRoute>
                <Timetable />
              </ProtectedRoute>
            }
          />

          {/* ── MARKS ── */}
          <Route
            path="/marks"
            element={
              <ProtectedRoute>
                <Marks />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);