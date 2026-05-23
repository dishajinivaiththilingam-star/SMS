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

} from "lucide-react";

import {
  Link
} from "react-router-dom";



function Sidebar() {

  const logoutHandler = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    window.location.replace("/");
  };



  return (

    <div className="w-[250px] h-screen bg-blue-700 text-white fixed left-0 top-0 p-5">

      <h1 className="text-2xl font-bold mb-10">

        SMS Admin

      </h1>



      <ul className="space-y-5">

        <li>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 hover:text-yellow-300"
          >
            <LayoutDashboard size={22} />
            Dashboard
          </Link>
        </li>



        <li>
          <Link
            to="/courses"
            className="flex items-center gap-3 hover:text-yellow-300"
          >
            <BookOpen size={22} />
            Courses
          </Link>
        </li>


<li>
  <Link
    to="/teachers"
    className="flex items-center gap-3 hover:text-yellow-300"
  >
    <Users size={20} />
    Teachers
  </Link>
</li>





        <li>
          <Link
            to="/students"
            className="flex items-center gap-3 hover:text-yellow-300"
          >
            <Users size={22} />
            Students
          </Link>
        </li>


        


        <li>
          <Link
            to="/attendance"
            className="flex items-center gap-3 hover:text-yellow-300"
          >
            <CalendarCheck size={22} />
            Attendance
          </Link>
        </li>


        <li>

  <Link
    to="/attendance-report"
    className="flex items-center gap-3 hover:text-yellow-300"
  >
    <FileText size={20} />
    Attendance Report
  </Link>
</li>



        <li>
          <Link
            to="/fees"
            className="flex items-center gap-3 hover:text-yellow-300"
          >
            <BadgeDollarSign size={22} />
            Fees
          </Link>
        </li>





<li>
  <Link
    to="/profile"
    className="flex items-center gap-3 hover:text-yellow-300"
  >
    <UserCircle size={20} />
    Profile
  </Link>
</li>


<li>
  <Link
    to="/timetable"
    className="flex items-center gap-3 hover:text-yellow-300"
  >
    <Clock3 size={20} />
    Timetable
  </Link>
</li>


<li>
  <Link
    to="/marks"
    className="flex items-center gap-3 hover:text-yellow-300"
  >
    <FileText size={20} />
    Marks
  </Link>
</li>


        <li>

          <button
            onClick={logoutHandler}
            className="flex items-center gap-3 hover:text-red-300"
          >
            <LogOut size={22} />
            Logout
          </button>

        </li>

      </ul>

    </div>

  );

}

export default Sidebar;