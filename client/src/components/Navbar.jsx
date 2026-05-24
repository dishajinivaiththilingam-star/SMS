import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  Moon,
  Sun,
  LogOut,
  User
} from "lucide-react";

function Navbar() {

  // =========================
  // STATES
  // =========================

  const [notifications, setNotifications] =
    useState([]);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  const [admin, setAdmin] =
    useState(null);



  // =========================
  // GET ADMIN
  // =========================

  useEffect(() => {

    const storedAdmin =
      localStorage.getItem("admin");

    if (storedAdmin) {

      setAdmin(
        JSON.parse(storedAdmin)
      );

    }

  }, []);




  // =========================
  // GET NOTIFICATIONS
  // =========================

  const getNotifications =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/notifications"
          );

        setNotifications(
          res.data
        );

      } catch (error) {

        console.log(error);

      }

    };



  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  useEffect(() => {

    getNotifications();

    // AUTO REFRESH

    const interval =
      setInterval(() => {

        getNotifications();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);




  // =========================
  // DARK MODE
  // =========================

  const toggleDarkMode = () => {

    setDarkMode(!darkMode);

    document.documentElement.classList.toggle(
      "dark"
    );

  };




  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("admin");

    window.location.href = "/";

  };




  return (

    <div className="bg-white shadow px-10 py-5 flex justify-between items-center">

      {/* LEFT */}

      <div>

        <h1 className="text-2xl font-bold text-gray-800">
          Student Management System
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Welcome Back{" "}
          <span className="font-semibold">
            {admin?.name || "Admin"}
          </span>
        </p>

      </div>



      {/* RIGHT */}

      <div className="flex items-center gap-6">

        {/* PROFILE */}

        <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl">

          <div className="bg-blue-600 text-white p-2 rounded-full">
            <User size={18} />
          </div>

          <div>

            <p className="text-sm font-semibold text-gray-800">
              {admin?.name || "Administrator"}
            </p>

            <p className="text-xs text-gray-500">
              {admin?.email || "admin@gmail.com"}
            </p>

          </div>

        </div>



        {/* NOTIFICATION */}

        <div className="relative">

          <button
            onClick={() =>
              setShowDropdown(
                !showDropdown
              )
            }
            className="relative bg-gray-100 hover:bg-gray-200 p-3 rounded-full"
          >

            <Bell size={22} />



            {/* COUNT */}

            {notifications.length > 0 && (

              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {
                  notifications.length
                }
              </span>

            )}

          </button>



          {/* DROPDOWN */}

          {showDropdown && (

            <div className="absolute right-0 mt-5 w-[350px] bg-white shadow-2xl rounded-2xl p-5 z-50 border">

              <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl font-bold text-gray-800">
                  Notifications
                </h2>

                <span className="text-sm text-blue-600">
                  {
                    notifications.length
                  } New
                </span>

              </div>



              {/* EMPTY */}

              {notifications.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No Notifications
                </div>
              )}



              {/* LIST */}

              <div className="max-h-[400px] overflow-auto">

                {notifications.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="border-b py-4"
                    >

                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-600 mt-1">
                        {item.message}
                      </p>



                      <p className="text-xs text-gray-400 mt-2">
                        {
                          new Date(
                            item.created_at
                          ).toLocaleString()
                        }
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </div>



        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>

  );

}

export default Navbar;