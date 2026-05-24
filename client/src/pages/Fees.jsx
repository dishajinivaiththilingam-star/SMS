import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Fees() {

  // =========================
  // STATES
  // =========================

  const [fees, setFees] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [student_id, setStudentId] =
    useState("");

  const [course_id, setCourseId] =
    useState("");

  const [total_fee, setTotalFee] =
    useState("");

  const [paid_amount, setPaidAmount] =
    useState("");



  // =========================
  // GET FEES
  // =========================

  const getFees = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/fees"
      );

      setFees(res.data);

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load fees"
      });

    }

  };



  // =========================
  // GET STUDENTS
  // =========================

  const getStudents = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/students"
      );

      setStudents(res.data);

    } catch (error) {

      console.log(error);

    }

  };



  // =========================
  // GET COURSES
  // =========================

  const getCourses = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/courses"
      );

      setCourses(res.data);

    } catch (error) {

      console.log(error);

    }

  };



  // =========================
  // DOWNLOAD RECEIPT
  // =========================

  const downloadReceipt = (item) => {

    const doc = new jsPDF();



    // STUDENT NAME

    const studentName =
      students.find(
        (student) =>
          student.id ==
          item.student_id
      )?.student_name || "Unknown";



    // COURSE NAME

    const courseName =
      courses.find(
        (course) =>
          course.id ==
          item.course_id
      )?.course_name || "Unknown";



    // TITLE

    doc.setFontSize(20);

    doc.text(
      "Student Fee Receipt",
      20,
      20
    );



    // LINE

    doc.line(20, 25, 190, 25);



    // CONTENT

    doc.setFontSize(14);

    doc.text(
      `Student Name : ${studentName}`,
      20,
      50
    );

    doc.text(
      `Course Name : ${courseName}`,
      20,
      70
    );

    doc.text(
      `Total Fee : Rs. ${item.total_fee}`,
      20,
      90
    );

    doc.text(
      `Paid Amount : Rs. ${item.paid_amount}`,
      20,
      110
    );

    doc.text(
      `Balance Amount : Rs. ${item.balance_amount}`,
      20,
      130
    );

    doc.text(
      `Payment Status : ${item.payment_status}`,
      20,
      150
    );



    // DATE

    doc.text(
      `Date : ${new Date().toLocaleDateString()}`,
      20,
      170
    );



    // SAVE PDF

    doc.save(
      `${studentName}_Receipt.pdf`
    );



    Swal.fire({
      icon: "success",
      title: "Downloaded",
      text: "Receipt Downloaded Successfully",
      timer: 2000,
      showConfirmButton: false
    });

  };



  // =========================
  // ADD FEES
  // =========================

  const addFees = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/fees",
        {
          student_id,
          course_id,
          total_fee,
          paid_amount
        }
      );



      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Fees Added Successfully",
        timer: 2000,
        showConfirmButton: false
      });



      getFees();



      // RESET

      setStudentId("");
      setCourseId("");
      setTotalFee("");
      setPaidAmount("");

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong"
      });

    }

  };



  // =========================
  // UPDATE PAYMENT
  // =========================

  const updatePayment = async (id) => {

    const { value: amount } =
      await Swal.fire({

        title: "Enter Payment Amount",

        input: "number",

        inputPlaceholder:
          "Enter Amount",

        showCancelButton: true,

        confirmButtonText: "Update"

      });



    if (!amount) return;



    try {

      await axios.put(
        `http://localhost:5000/api/fees/${id}`,
        {
          paid_amount: amount
        }
      );



      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Payment Updated Successfully",
        timer: 2000,
        showConfirmButton: false
      });



      getFees();

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update payment"
      });

    }

  };



  // =========================
  // TOTAL COLLECTION
  // =========================

  const totalCollection =
    fees.reduce(
      (total, item) =>
        total +
        Number(item.paid_amount),
      0
    );



  // =========================
  // TOTAL PENDING
  // =========================

  const totalPending =
    fees.reduce(
      (total, item) =>
        total +
        Number(item.balance_amount),
      0
    );



  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    getFees();
    getStudents();
    getCourses();

  }, []);




  return (

    <div className="flex">

      {/* SIDEBAR */}

      <Sidebar />



      {/* MAIN */}

      <div className="ml-[250px] w-full min-h-screen bg-gray-100">

        <Navbar />



        <div className="p-10">

          <h1 className="text-3xl font-bold text-black mb-10">

            Fees Management

          </h1>



          {/* SUMMARY */}

          <div className="grid grid-cols-2 gap-5 mb-10">

            {/* COLLECTION */}

            <div className="bg-green-500 text-white p-6 rounded-xl shadow">

              <h2 className="text-2xl font-bold">

                Total Collection

              </h2>

              <p className="text-4xl mt-3">

                Rs. {totalCollection}

              </p>

            </div>



            {/* PENDING */}

            <div className="bg-red-500 text-white p-6 rounded-xl shadow">

              <h2 className="text-2xl font-bold">

                Pending Amount

              </h2>

              <p className="text-4xl mt-3">

                Rs. {totalPending}

              </p>

            </div>

          </div>



          {/* SEARCH + FILTER */}

          <div className="bg-white p-6 rounded-xl shadow mb-10 flex gap-5">

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search Student..."
              className="border bg-white text-black p-3 rounded w-[300px]"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />



            {/* FILTER */}

            <select
              className="border bg-white text-black p-3 rounded"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <option value="">
                All Status
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Pending">
                Pending
              </option>

            </select>

          </div>



          {/* ADD FEES FORM */}

          <form
            onSubmit={addFees}
            className="bg-white p-6 rounded-xl shadow mb-10"
          >

            <div className="grid grid-cols-4 gap-5">

              {/* STUDENT */}

              <select
                className="border bg-white text-black p-3 rounded"
                value={student_id}
                onChange={(e) =>
                  setStudentId(e.target.value)
                }
                required
              >

                <option value="">
                  Select Student
                </option>

                {students.map((student) => (

                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.student_name}
                  </option>

                ))}

              </select>



              {/* COURSE */}

              <select
                className="border bg-white text-black p-3 rounded"
                value={course_id}
                onChange={(e) =>
                  setCourseId(e.target.value)
                }
                required
              >

                <option value="">
                  Select Course
                </option>

                {courses.map((course) => (

                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.course_name}
                  </option>

                ))}

              </select>



              {/* TOTAL FEE */}

              <input
                type="number"
                placeholder="Total Fee"
                className="border bg-white text-black p-3 rounded"
                value={total_fee}
                onChange={(e) =>
                  setTotalFee(e.target.value)
                }
                required
              />



              {/* PAID AMOUNT */}

              <input
                type="number"
                placeholder="Paid Amount"
                className="border bg-white text-black p-3 rounded"
                value={paid_amount}
                onChange={(e) =>
                  setPaidAmount(e.target.value)
                }
                required
              />

            </div>



            {/* BUTTON */}

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded mt-5 hover:bg-blue-700"
            >
              Add Fees
            </button>

          </form>



          {/* FEES TABLE */}

          <div className="bg-white p-6 rounded-xl shadow overflow-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-100">

                  <th className="p-3 text-left text-black">
                    Student
                  </th>

                  <th className="p-3 text-left text-black">
                    Course
                  </th>

                  <th className="p-3 text-left text-black">
                    Total Fee
                  </th>

                  <th className="p-3 text-left text-black">
                    Paid
                  </th>

                  <th className="p-3 text-left text-black">
                    Balance
                  </th>

                  <th className="p-3 text-left text-black">
                    Status
                  </th>

                  <th className="p-3 text-left text-black">
                    Action
                  </th>

                </tr>

              </thead>



              <tbody>

                {fees
                  .filter((item) => {

                    const student =
                      students.find(
                        (s) =>
                          s.id ==
                          item.student_id
                      );



                    const studentName =
                      student
                        ?.student_name || "";



                    const searchMatch =
                      studentName
                        .toLowerCase()
                        .includes(
                          search.toLowerCase()
                        );



                    const statusMatch =
                      statusFilter
                        ? item.payment_status ===
                        statusFilter
                        : true;



                    return (
                      searchMatch &&
                      statusMatch
                    );

                  })
                  .map((item) => (

                    <tr
                      key={item.id}
                      className="border-b"
                    >

                      {/* STUDENT */}

                      <td className="p-3 text-black">

                        {
                          students.find(
                            (student) =>
                              student.id ==
                              item.student_id
                          )?.student_name
                        }

                      </td>



                      {/* COURSE */}

                      <td className="p-3 text-black">

                        {
                          courses.find(
                            (course) =>
                              course.id ==
                              item.course_id
                          )?.course_name
                        }

                      </td>



                      {/* TOTAL */}

                      <td className="p-3 text-black">
                        Rs. {item.total_fee}
                      </td>



                      {/* PAID */}

                      <td className="p-3 text-black ">
                        Rs. {item.paid_amount}
                      </td>



                      {/* BALANCE */}

                      <td className="p-3 text-black ">
                        Rs. {item.balance_amount}
                      </td>



                      {/* STATUS */}

                      <td className="p-3">

                        <span
                          className={`px-3 py-1 rounded text-white ${item.payment_status ===
                              "Paid"
                              ? "bg-green-500"
                              : "bg-red-500"
                            }`}
                        >
                          {item.payment_status}
                        </span>

                      </td>



                      {/* ACTION */}

                      <td className="p-3 flex gap-3">

                        {/* UPDATE */}

                        <button
                          onClick={() =>
                            updatePayment(item.id)
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Add Payment
                        </button>



                        {/* PDF */}

                        <button
                          onClick={() =>
                            downloadReceipt(item)
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Receipt
                        </button>

                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Fees;