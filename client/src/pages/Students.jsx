import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Students() {

  // =========================
  // STATES
  // =========================
const navigate = useNavigate();

  const [students, setStudents] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [editId, setEditId] =
    useState(null);

  // =========================
  // PERSONAL DETAILS
  // =========================

  const [student_id, setStudentId] =
    useState("");

  const [student_name, setStudentName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [course_id, setCourseId] =
    useState("");

  const [photo, setPhoto] =
    useState(null);

  const [nic, setNic] =
    useState("");

  const [dob, setDob] =
    useState("");

  const [occupation, setOccupation] =
    useState("");

  const [course_type, setCourseType] =
    useState("");

  const [admission_date, setAdmissionDate] =
    useState("");

  // =========================
  // CONTACT DETAILS
  // =========================

  const [permanent_address,
    setPermanentAddress] =
    useState("");

  const [current_address,
    setCurrentAddress] =
    useState("");

  const [district, setDistrict] =
    useState("");

  const [home_phone,
    setHomePhone] =
    useState("");

  // =========================
  // FAMILY DETAILS
  // =========================

  const [father_name,
    setFatherName] =
    useState("");

  const [mother_name,
    setMotherName] =
    useState("");

  const [father_phone,
    setFatherPhone] =
    useState("");

  const [mother_phone,
    setMotherPhone] =
    useState("");

  const [father_occupation,
    setFatherOccupation] =
    useState("");

  const [mother_occupation,
    setMotherOccupation] =
    useState("");

  const [monthly_income,
    setMonthlyIncome] =
    useState("");

  const [guardian_name,
    setGuardianName] =
    useState("");

  const [guardian_phone,
    setGuardianPhone] =
    useState("");

  // =========================
  // EDUCATION DETAILS
  // =========================

  const [school_name,
    setSchoolName] =
    useState("");

  const [education_year,
    setEducationYear] =
    useState("");

  const [qualification,
    setQualification] =
    useState("");

  const [exam_results,
    setExamResults] =
    useState("");

  const [other_qualifications,
    setOtherQualifications] =
    useState("");

  // =========================
  // AGREEMENT
  // =========================

  const [
    agree_discontinue_fee,
    setAgreeDiscontinueFee
  ] = useState(false);



  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setEditId(null);

    setStudentId("");
    setStudentName("");
    setEmail("");
    setPhone("");
    setGender("");
    setCourseId("");
    setPhoto(null);

    setNic("");
    setDob("");
    setOccupation("");
    setCourseType("");
    setAdmissionDate("");

    setPermanentAddress("");
    setCurrentAddress("");
    setDistrict("");
    setHomePhone("");

    setFatherName("");
    setMotherName("");
    setFatherPhone("");
    setMotherPhone("");
    setFatherOccupation("");
    setMotherOccupation("");
    setMonthlyIncome("");
    setGuardianName("");
    setGuardianPhone("");

    setSchoolName("");
    setEducationYear("");
    setQualification("");
    setExamResults("");
    setOtherQualifications("");

    setAgreeDiscontinueFee(false);

  };



  // =========================
  // EXPORT EXCEL
  // =========================

  const exportExcel = () => {

    const exportData =
      students.map((student) => ({

        Student_ID:
          student.student_id,

        Student_Name:
          student.student_name,

        Email:
          student.email,

        Phone:
          student.phone,

        Gender:
          student.gender,

        NIC:
          student.nic,

        Father_Name:
          student.father_name,

        Mother_Name:
          student.mother_name,

        Course:
          courses.find(
            (course) =>
              course.id ==
              student.course_id
          )?.course_name || ""

      }));

    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });

    const fileData =
      new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
      });

    saveAs(
      fileData,
      "Students_Report.xlsx"
    );

    Swal.fire({
      icon: "success",
      title: "Exported",
      text:
        "Excel File Downloaded Successfully",
      timer: 2000,
      showConfirmButton: false
    });

  };



  // =========================
  // GET STUDENTS
  // =========================

  const getStudents = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/students"
        );

      setStudents(
        res.data.data || res.data
      );

    } catch (error) {

      console.log(error);

    }

  };



  // =========================
  // GET COURSES
  // =========================

  const getCourses = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/courses"
        );

      setCourses(
        res.data.data || res.data
      );

    } catch (error) {

      console.log(error);

    }

  };



  // =========================
  // ADD / UPDATE
  // =========================

  const handleSubmit =
    async (e) => {

    e.preventDefault();

    try {

      const formData =
        new FormData();

      // PERSONAL

      formData.append(
        "student_id",
        student_id
      );

      formData.append(
        "student_name",
        student_name
      );

      formData.append(
        "email",
        email
      );

      formData.append(
        "phone",
        phone
      );

      formData.append(
        "gender",
        gender
      );

      formData.append(
        "course_id",
        course_id
      );

      formData.append(
        "nic",
        nic
      );

      formData.append(
        "dob",
        dob
      );

      formData.append(
        "occupation",
        occupation
      );

      formData.append(
        "course_type",
        course_type
      );

      formData.append(
        "admission_date",
        admission_date
      );

      // CONTACT

      formData.append(
        "permanent_address",
        permanent_address
      );

      formData.append(
        "current_address",
        current_address
      );

      formData.append(
        "district",
        district
      );

      formData.append(
        "home_phone",
        home_phone
      );

      // FAMILY

      formData.append(
        "father_name",
        father_name
      );

      formData.append(
        "mother_name",
        mother_name
      );

      formData.append(
        "father_phone",
        father_phone
      );

      formData.append(
        "mother_phone",
        mother_phone
      );

      formData.append(
        "father_occupation",
        father_occupation
      );

      formData.append(
        "mother_occupation",
        mother_occupation
      );

      formData.append(
        "monthly_income",
        monthly_income
      );

      formData.append(
        "guardian_name",
        guardian_name
      );

      formData.append(
        "guardian_phone",
        guardian_phone
      );

      // EDUCATION

      formData.append(
        "school_name",
        school_name
      );

      formData.append(
        "education_year",
        education_year
      );

      formData.append(
        "qualification",
        qualification
      );

      formData.append(
        "exam_results",
        exam_results
      );

      formData.append(
        "other_qualifications",
        other_qualifications
      );

      // AGREEMENT

      formData.append(
        "agree_discontinue_fee",
        agree_discontinue_fee
      );

      // PHOTO

      if (photo) {

        formData.append(
          "photo",
          photo
        );

      }

      // UPDATE

      if (editId) {

        await axios.put(
          `http://localhost:5000/api/students/${editId}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

        Swal.fire({
          icon: "success",
          title: "Updated",
          text:
            "Student Updated Successfully",
          timer: 2000,
          showConfirmButton: false
        });

      }

      // ADD

      else {

        await axios.post(
          "http://localhost:5000/api/students",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

        Swal.fire({
          icon: "success",
          title: "Added",
          text:
            "Student Added Successfully",
          timer: 2000,
          showConfirmButton: false
        });

      }

      await getStudents();

      resetForm();

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
  // EDIT
  // =========================

  const editStudent =
    (student) => {

    setEditId(student.id);

    setStudentId(
      student.student_id || ""
    );

    setStudentName(
      student.student_name || ""
    );

    setEmail(
      student.email || ""
    );

    setPhone(
      student.phone || ""
    );

    setGender(
      student.gender || ""
    );

    setCourseId(
      student.course_id || ""
    );

    setNic(
      student.nic || ""
    );

    setDob(
      student.dob || ""
    );

    setOccupation(
      student.occupation || ""
    );

    setCourseType(
      student.course_type || ""
    );

    setAdmissionDate(
      student.admission_date || ""
    );

    setPermanentAddress(
      student.permanent_address || ""
    );

    setCurrentAddress(
      student.current_address || ""
    );

    setDistrict(
      student.district || ""
    );

    setHomePhone(
      student.home_phone || ""
    );

    setFatherName(
      student.father_name || ""
    );

    setMotherName(
      student.mother_name || ""
    );

    setFatherPhone(
      student.father_phone || ""
    );

    setMotherPhone(
      student.mother_phone || ""
    );

    setFatherOccupation(
      student.father_occupation || ""
    );

    setMotherOccupation(
      student.mother_occupation || ""
    );

    setMonthlyIncome(
      student.monthly_income || ""
    );

    setGuardianName(
      student.guardian_name || ""
    );

    setGuardianPhone(
      student.guardian_phone || ""
    );

    setSchoolName(
      student.school_name || ""
    );

    setEducationYear(
      student.education_year || ""
    );

    setQualification(
      student.qualification || ""
    );

    setExamResults(
      student.exam_results || ""
    );

    setOtherQualifications(
      student.other_qualifications || ""
    );

    setAgreeDiscontinueFee(
      student.agree_discontinue_fee || false
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };



  // =========================
  // DELETE
  // =========================

  const deleteStudent =
    async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/students/${id}`
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text:
          "Student Deleted Successfully",
        timer: 2000,
        showConfirmButton: false
      });

      getStudents();

    } catch (error) {

      console.log(error);

    }

  };



  // =========================
  // LOAD
  // =========================

  useEffect(() => {

    getStudents();
    getCourses();

  }, []);




  return (

    <div className="flex">

      <Sidebar />

      <div className="ml-[250px] w-full min-h-screen bg-gray-100">

        <Navbar />

        <div className="p-10">

          {/* HEADER */}

          <div className="flex justify-between items-center mb-8">

            <h1 className="text-4xl font-bold text-gray-800">
              Student Admission Form
            </h1>

            <button
              onClick={exportExcel}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Export Excel
            </button>

          </div>

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search Student..."
            className="border p-3 rounded-lg w-[300px] bg-white mb-8"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />



          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow space-y-10"
          >

            {/* PERSONAL DETAILS */}

<div>

  <h2 className="text-2xl font-bold text-blue-700 mb-5 border-b pb-2">
    Personal Details
  </h2>

  <div className="grid grid-cols-3 gap-5">

    {/* STUDENT ID */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Student ID
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={student_id}
        onChange={(e) =>
          setStudentId(e.target.value)
        }
        placeholder="Enter Student ID"
      />
    </div>

    {/* STUDENT NAME */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Student Name
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={student_name}
      required
        onChange={(e) =>
          setStudentName(e.target.value)
        }
        placeholder="Enter Student Name"
      />
    </div>

    {/* EMAIL */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Email Address
      </label>

      <input
        type="email"
        className="border p-3 rounded-lg w-full"
        value={email}
        required
        onChange={(e) =>
          setEmail(e.target.value)
        }
        placeholder="Enter Email"
      />
    </div>

    {/* PHONE */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Mobile Number
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
        placeholder="Enter Mobile Number"
      />
    </div>

    {/* GENDER */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Gender
      </label>

      <select
        className="border p-3 rounded-lg w-full"
        value={gender}
        onChange={(e) =>
          setGender(e.target.value)
        }
      >

        <option value="">
          Select Gender
        </option>

        <option value="Male">
          Male
        </option>

        <option value="Female">
          Female
        </option>

      </select>
    </div>

    {/* NIC */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        NIC Number
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={nic}
        onChange={(e) =>
          setNic(e.target.value)
        }
        placeholder="Enter NIC Number"
      />
    </div>

    {/* DATE OF BIRTH */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Date of Birth
      </label>

      <input
        type="date"
        className="border p-3 rounded-lg w-full"
        value={dob}
        onChange={(e) =>
          setDob(e.target.value)
        }
      />
    </div>

    {/* OCCUPATION */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Occupation
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={occupation}
        onChange={(e) =>
          setOccupation(e.target.value)
        }
        placeholder="Enter Occupation"
      />
    </div>

    {/* COURSE */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Course
      </label>

      <select
        className="border p-3 rounded-lg w-full"
        value={course_id}
        required
        onChange={(e) =>
          setCourseId(e.target.value)
        }
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
    </div>

    {/* COURSE TYPE */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Course Type
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={course_type}
        onChange={(e) =>
          setCourseType(e.target.value)
        }
        placeholder="Full Time / Part Time"
      />
    </div>

    {/* ADMISSION DATE */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Admission Date
      </label>

      <input
        type="date"
        className="border p-3 rounded-lg w-full"
        value={admission_date}
        required
        onChange={(e) =>
          setAdmissionDate(e.target.value)
        }
      />
    </div>

    {/* PHOTO */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Student Photo
      </label>

      <input
        type="file"
        className="border p-3 rounded-lg w-full"
        accept="image/*"
        onChange={(e) =>
          setPhoto(e.target.files[0])
        }
      />
    </div>

  </div>

</div>

{/* CONTACT DETAILS */}

<div>

  <h2 className="text-2xl font-bold text-purple-700 mb-5 border-b pb-2">
    Contact Details
  </h2>

  <div className="grid grid-cols-3 gap-5">

    {/* PERMANENT ADDRESS */}

    <div className="col-span-3">
      <label className="block mb-2 font-semibold text-gray-700">
        Permanent Address
      </label>

      <textarea
        className="border p-3 rounded-lg w-full"
        rows="3"
        value={permanent_address}
        onChange={(e) =>
          setPermanentAddress(e.target.value)
        }
        placeholder="Enter Permanent Address"
      />
    </div>

    {/* CURRENT ADDRESS */}

    <div className="col-span-3">
      <label className="block mb-2 font-semibold text-gray-700">
        Current Address
      </label>

      <textarea
        className="border p-3 rounded-lg w-full"
        rows="3"
        value={current_address}
        onChange={(e) =>
          setCurrentAddress(e.target.value)
        }
        placeholder="Enter Current Address"
      />
    </div>

    {/* DISTRICT */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        District
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={district}
        onChange={(e) =>
          setDistrict(e.target.value)
        }
        placeholder="Enter District"
      />
    </div>

    {/* HOME PHONE */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Home Phone Number
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={home_phone}
        required
        onChange={(e) =>
          setHomePhone(e.target.value)
        }
        placeholder="Enter Home Phone Number"
      />
    </div>

  </div>

</div>



{/* FAMILY DETAILS */}

<div>

  <h2 className="text-2xl font-bold text-green-700 mb-5 border-b pb-2">
    Family Details
  </h2>

  <div className="grid grid-cols-3 gap-5">

    {/* FATHER NAME */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Father Name
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={father_name}
        onChange={(e) =>
          setFatherName(e.target.value)
        }
        placeholder="Enter Father Name"
      />
    </div>

    {/* MOTHER NAME */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Mother Name
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={mother_name}
        onChange={(e) =>
          setMotherName(e.target.value)
        }
        placeholder="Enter Mother Name"
      />
    </div>

    {/* FATHER PHONE */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Father Phone Number
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={father_phone}
        onChange={(e) =>
          setFatherPhone(e.target.value)
        }
        placeholder="Enter Father Phone"
      />
    </div>

    {/* MOTHER PHONE */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Mother Phone Number
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={mother_phone}
        onChange={(e) =>
          setMotherPhone(e.target.value)
        }
        placeholder="Enter Mother Phone"
      />
    </div>

    {/* FATHER OCCUPATION */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Father Occupation
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={father_occupation}
        onChange={(e) =>
          setFatherOccupation(e.target.value)
        }
        placeholder="Enter Father Occupation"
      />
    </div>

    {/* MOTHER OCCUPATION */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Mother Occupation
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={mother_occupation}
        onChange={(e) =>
          setMotherOccupation(e.target.value)
        }
        placeholder="Enter Mother Occupation"
      />
    </div>

    {/* MONTHLY INCOME */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Monthly Family Income
      </label>

      <input
        type="number"
        className="border p-3 rounded-lg w-full"
        value={monthly_income}
        onChange={(e) =>
          setMonthlyIncome(e.target.value)
        }
        placeholder="Enter Monthly Income"
      />
    </div>

    {/* GUARDIAN NAME */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Guardian Name
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={guardian_name}
        onChange={(e) =>
          setGuardianName(e.target.value)
        }
        placeholder="Enter Guardian Name"
      />
    </div>

    {/* GUARDIAN PHONE */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Guardian Phone Number
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={guardian_phone}
        onChange={(e) =>
          setGuardianPhone(e.target.value)
        }
        placeholder="Enter Guardian Phone"
      />
    </div>

  </div>

</div>



{/* ACADEMIC QUALIFICATIONS */}

<div>

  <h2 className="text-2xl font-bold text-orange-700 mb-5 border-b pb-2">
    Academic Qualifications
  </h2>

  <div className="grid grid-cols-3 gap-5">

    {/* SCHOOL NAME */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        School Name
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={school_name}
        onChange={(e) =>
          setSchoolName(e.target.value)
        }
        placeholder="Enter School Name"
      />
    </div>

    {/* EDUCATION YEAR */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Education Year
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={education_year}
        onChange={(e) =>
          setEducationYear(e.target.value)
        }
        placeholder="Enter Education Year"
      />
    </div>

    {/* QUALIFICATION */}

    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Qualification
      </label>

      <input
        type="text"
        className="border p-3 rounded-lg w-full"
        value={qualification}
        onChange={(e) =>
          setQualification(e.target.value)
        }
        placeholder="Enter Qualification"
      />
    </div>

    {/* EXAM RESULTS */}

    <div className="col-span-3">
      <label className="block mb-2 font-semibold text-gray-700">
        Exam Results
      </label>

      <textarea
        className="border p-3 rounded-lg w-full"
        rows="3"
        value={exam_results}
        onChange={(e) =>
          setExamResults(e.target.value)
        }
        placeholder="Enter Exam Results"
      />
    </div>

    {/* OTHER QUALIFICATIONS */}

    <div className="col-span-3">
      <label className="block mb-2 font-semibold text-gray-700">
        Other Qualifications
      </label>

      <textarea
        className="border p-3 rounded-lg w-full"
        rows="3"
        value={other_qualifications}
        onChange={(e) =>
          setOtherQualifications(e.target.value)
        }
        placeholder="Enter Other Qualifications"
      />
    </div>

  </div>

</div>



{/* STUDENT AGREEMENT */}

<div>

  <h2 className="text-2xl font-bold text-red-700 mb-5 border-b pb-2">
    Student Agreement
  </h2>

  <div className="bg-gray-50 border rounded-xl p-5">

    <p className="text-gray-700 leading-8">

      • Students must follow all institute rules and regulations.<br />

      • Course fees once paid will not be refunded.<br />

      • If a student discontinues the course midway,
      Rs.3000 must be paid before leaving the institute.<br />

      • Students should maintain discipline and attendance properly.<br />

      • Any misconduct may result in suspension from the institute.

    </p>

    <div className="mt-5 flex items-center gap-3">

      <input
        type="checkbox"
        checked={agree_discontinue_fee}
        onChange={(e) =>
          setAgreeDiscontinueFee(e.target.checked)
        }
        className="w-5 h-5"
      />

      <label className="font-semibold text-gray-700">
        I Agree to the Institute Rules & Conditions
      </label>

    </div>

  </div>

</div>



{/* SUBMIT BUTTONS */}

<div className="flex gap-4 pt-6">

  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
  >
    {editId
      ? "Update Student"
      : "Add Student"}
  </button>

  {editId && (

    <button
      type="button"
      onClick={resetForm}
      className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold"
    >
      Cancel
    </button>

  )}

</div>


          </form>

{/* TABLE */}

<div className="bg-white p-6 rounded-xl shadow mt-10 overflow-auto">

  <table className="w-full">

    <thead>

      <tr className="bg-gray-100 border-b">

        <th className="p-3 text-left">
          Photo
        </th>

        <th className="p-3 text-left">
          Student ID
        </th>

        <th className="p-3 text-left">
          Student Name
        </th>

        <th className="p-3 text-left">
          Phone Number
        </th>

        <th className="p-3 text-left">
          Course
        </th>

        <th className="p-3 text-left">
          Actions
        </th>

      </tr>

    </thead>

    <tbody>

      {students
        .filter((student) =>
          student.student_name
            ?.toLowerCase()
            .includes(search.toLowerCase())
        )
        .map((student) => (

          <tr
            key={student.id}
            className="border-b hover:bg-gray-50"
          >

            {/* PHOTO */}

            <td className="p-3">

              <img
                src={
                  student.image_url
                    ? student.image_url
                    : `https://ui-avatars.com/api/?name=${student.student_name}`
                }

                alt="Student"

                className="w-14 h-14 rounded-full object-cover border"

                onError={(e) => {

                  e.target.onerror = null;

                  e.target.src =
                    `https://ui-avatars.com/api/?name=${student.student_name}`;

                }}
              />

            </td>

            {/* STUDENT ID */}

            <td className="p-3">
              {student.student_id}
            </td>

            {/* NAME */}

            <td className="p-3">
              {student.student_name}
            </td>

            {/* PHONE */}

            <td className="p-3">
              {student.phone}
            </td>

            {/* COURSE */}

            <td className="p-3">

              {
                courses.find(
                  (course) =>
                    course.id ==
                    student.course_id
                )?.course_name
              }

            </td>

            {/* ACTIONS */}

            <td className="p-3 flex gap-3">


              <button
  type="button"
  onClick={() =>
    navigate(`/students/${student.id}`)
  }
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
>
  View
</button>

              <button
                type="button"
                onClick={() =>
                  editStudent(student)
                }
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  deleteStudent(student.id)
                }
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
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

export default Students;