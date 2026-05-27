import {
  LayoutDashboard,
  BookOpen,
  Users,
  CalendarCheck,
  BadgeDollarSign,
  LogOut,
  FileText,
  UserCircle,
  Clock3,
  UserPlus,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

function Sidebar() {

  const location = useLocation();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.replace("/");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
      isActive(path)
        ? "bg-white/20 text-yellow-300 font-semibold"
        : "hover:text-yellow-300 hover:bg-white/10"
    }`;

  return (
    <div className="w-[250px] h-screen bg-blue-700 text-white fixed left-0 top-0 p-5 flex flex-col">

      <h1 className="text-2xl font-bold mb-10 text-center">
        SMS Admin
      </h1>

      <ul className="space-y-1 flex-1">

        <li>
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/courses" className={linkClass("/courses")}>
            <BookOpen size={20} />
            Courses
          </Link>
        </li>

        <li>
          <Link to="/teachers" className={linkClass("/teachers")}>
            <Users size={20} />
            Teachers
          </Link>
        </li>

        {/* Students — shows list page */}
        <li>
          <Link to="/students-list" className={linkClass("/students-list")}>
            <Users size={20} />
            Students
          </Link>
        </li>

        {/* Add Student shortcut */}
        <li>
          <Link to="/students" className={linkClass("/students")}>
            <UserPlus size={18} />
            Add Student
          </Link>
        </li>

        <li>
          <Link to="/attendance" className={linkClass("/attendance")}>
            <CalendarCheck size={20} />
            Attendance
          </Link>
        </li>

        <li>
          <Link to="/attendance-report" className={linkClass("/attendance-report")}>
            <FileText size={20} />
            Attendance Report
          </Link>
        </li>

        <li>
          <Link to="/fees" className={linkClass("/fees")}>
            <BadgeDollarSign size={20} />
            Fees
          </Link>
        </li>

        <li>
          <Link to="/profile" className={linkClass("/profile")}>
            <UserCircle size={20} />
            Profile
          </Link>
        </li>

        <li>
          <Link to="/timetable" className={linkClass("/timetable")}>
            <Clock3 size={20} />
            Timetable
          </Link>
        </li>

        <li>
          <Link to="/marks" className={linkClass("/marks")}>
            <FileText size={20} />
            Marks
          </Link>
        </li>

      </ul>

      {/* Logout at bottom */}
      <button
        onClick={logoutHandler}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-red-300 hover:bg-white/10 transition-all mt-4"
      >
        <LogOut size={20} />
        Logout
      </button>

    </div>
  );
}

export default Sidebar;