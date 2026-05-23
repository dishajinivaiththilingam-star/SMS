import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Timetable() {

    // =========================
    // STATES
    // =========================

    const [timetables, setTimetables] =
        useState([]);

    const [courses, setCourses] =
        useState([]);

    const [course_id, setCourseId] =
        useState("");

    const [day, setDay] =
        useState("");

    const [start_time, setStartTime] =
        useState("");

    const [end_time, setEndTime] =
        useState("");



    // =========================
    // GET TIMETABLES
    // =========================

    const getTimetables =
        async () => {

            try {

                const res =
                    await axios.get(
                        "http://localhost:5000/api/timetables"
                    );

                setTimetables(
                    res.data
                );

            } catch (error) {

                console.log(error);

            }

        };



    // =========================
    // GET COURSES
    // =========================

    const getCourses =
        async () => {

            try {

                const res =
                    await axios.get(
                        "http://localhost:5000/api/courses"
                    );

                setCourses(
                    res.data
                );

            } catch (error) {

                console.log(error);

            }

        };



    // =========================
    // ADD TIMETABLE
    // =========================

    const addTimetable =
        async (e) => {

            e.preventDefault();

            try {

                await axios.post(
                    "http://localhost:5000/api/timetables",
                    {
                        course_id,
                        day,
                        start_time,
                        end_time
                    }
                );



                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Timetable Added Successfully",
                    timer: 2000,
                    showConfirmButton: false,
                });



                getTimetables();



                // RESET

                setCourseId("");
                setDay("");
                setStartTime("");
                setEndTime("");

            } catch (error) {

                console.log(error);



                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text:
                        error.response?.data?.message ||
                        "Failed to Add Timetable",
                });

            }

        };



    // =========================
    // DELETE TIMETABLE
    // =========================

    const deleteTimetable =
        async (id) => {

            const result =
                await Swal.fire({
                    title: "Are you sure?",
                    text: "You want to delete this timetable?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, Delete",
                });



            if (!result.isConfirmed)
                return;



            try {

                await axios.delete(
                    `http://localhost:5000/api/timetables/${id}`
                );



                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: "Timetable Deleted Successfully",
                    timer: 2000,
                    showConfirmButton: false,
                });



                getTimetables();

            } catch (error) {

                console.log(error);



                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text:
                        error.response?.data?.message ||
                        "Delete Failed",
                });

            }

        };



    // =========================
    // LOAD
    // =========================

    useEffect(() => {

        getTimetables();

        getCourses();

    }, []);




    return (

        <div className="flex">

            <Sidebar />



            <div className="ml-[250px] w-full min-h-screen bg-gray-100">

                <Navbar />



                <div className="p-10">

                    <h1 className="text-3xl font-bold mb-10">

                        Timetable Management

                    </h1>



                    {/* FORM */}

                    <form
                        onSubmit={addTimetable}
                        className="bg-white p-6 rounded-xl shadow mb-10"
                    >

                        <div className="grid grid-cols-3 gap-5">

                            {/* COURSE */}

                            <select
                                className="border p-3 rounded"
                                value={course_id}
                                onChange={(e) =>
                                    setCourseId(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Course
                                </option>



                                {courses.map(
                                    (course) => (

                                        <option
                                            key={course.id}
                                            value={course.id}
                                        >

                                            {
                                                course.course_name
                                            }

                                        </option>

                                    )
                                )}

                            </select>



                            {/* DAY */}

                            <select
                                className="border p-3 rounded"
                                value={day}
                                onChange={(e) =>
                                    setDay(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Day
                                </option>

                                <option value="Monday">
                                    Monday
                                </option>

                                <option value="Tuesday">
                                    Tuesday
                                </option>

                                <option value="Wednesday">
                                    Wednesday
                                </option>

                                <option value="Thursday">
                                    Thursday
                                </option>

                                <option value="Friday">
                                    Friday
                                </option>

                            </select>



                            {/* START */}

                            <input
                                type="text"
                                placeholder="Start Time"
                                className="border p-3 rounded"
                                value={start_time}
                                onChange={(e) =>
                                    setStartTime(
                                        e.target.value
                                    )
                                }
                                required
                            />



                            {/* END */}

                            <input
                                type="text"
                                placeholder="End Time"
                                className="border p-3 rounded"
                                value={end_time}
                                onChange={(e) =>
                                    setEndTime(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>



                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded mt-5 hover:bg-blue-700"
                        >

                            Add Timetable

                        </button>

                    </form>



                    {/* TABLE */}

                    <div className="bg-white p-6 rounded-xl shadow overflow-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="bg-gray-100 border-b">

                                    <th className="p-3 text-left">
                                        Course
                                    </th>

                                    <th className="p-3 text-left">
                                        Day
                                    </th>

                                    <th className="p-3 text-left">
                                        Time
                                    </th>

                                    <th className="p-3 text-left">
                                        Action
                                    </th>

                                </tr>

                            </thead>



                            <tbody>

                                {timetables.map(
                                    (item) => (

                                        <tr
                                            key={item.id}
                                            className="border-b"
                                        >

                                            <td className="p-3">

                                                {
                                                    courses.find(
                                                        (course) =>
                                                            course.id ==
                                                            item.course_id
                                                    )?.course_name
                                                }

                                            </td>

                                            <td className="p-3">
                                                {item.day}
                                            </td>



                                            <td className="p-3">

                                                {
                                                    item.start_time
                                                }

                                                {" - "}

                                                {
                                                    item.end_time
                                                }

                                            </td>



                                            <td className="p-3">

                                                <button
                                                    onClick={() =>
                                                        deleteTimetable(
                                                            item.id
                                                        )
                                                    }
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                >

                                                    Delete

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Timetable;