"use client";
import React, { useEffect, useState } from "react";
import { checkValidation } from "../../../components/validation/checkValidation";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { addStaffAction, getSingleStaffAction, updateStaffAction } from "@/app/redux/actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../../../components/Layout";
import PuffLoader from "react-spinners/PuffLoader";



function StaffPage() {
  let [staffData, setStaffData] = useState({
    f_name: "",
    l_name: "",
    phone: "",
    email: "",
    image: "",
    password: "",
    c_password: "",
    subRole: ""
  });

  const [staffData2, setStaffData2] = useState(null)
  const { id } = useParams();
  const [errorShow, setErrorShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [staffError, setStaffError] = useState({
    f_name: "",
    phone: "",
    email: "",
    password: "",
    c_password: "",
    subRole: ""
  });
  const dispatch = useDispatch();
  const router = useRouter();

  function staffInputData(e) {
    const { name, value } = e.target;
    setErrorShow(false);
    setStaffError((oldError) => {
      let error = checkValidation(e);
      if (name === "c_password") {
        error = value !== staffData.password ? "Passwords do not match" : "";
      }
      return { ...oldError, [name]: error };
    });
    setStaffData((old) => {
      return { ...old, [name]: value.trim() };
    });
  }

  function staffImageData(e) {
    const { name, files } = e.target;
    setStaffData((old) => {
      return { ...old, [name]: files[0] };
    });
  }

  function getStaff() {
    setLoader(true)
    dispatch(getSingleStaffAction(id, (response) => {
      // console.log(resposne,"staffffffffffffffffffffff")
      if (response?.data?.success) {
        setStaffData2(response?.data?.data);
      }
      setLoader(false)
    }))
  }

  useEffect(() => {
    getStaff();
  }, [])


  useEffect(() => {
    if (staffData2) {
      const [f_name, l_name] = staffData2?.name.split(" ") || [];
      setStaffData({
        ...staffData,
        f_name: f_name || "",
        l_name: l_name || "",
        phone: staffData2?.phone || "",
        email: staffData2?.email || "",
        subRole: staffData2?.subRole || ""
      });
    }
  }, [staffData2]);


  function comparePasswords(password, confirmPassword) {
    return password === confirmPassword;
  }

  function submitData(event) {
    event.preventDefault();
    if (
      !Object.keys(staffError).find(
        (x) => staffError[x] && staffError[x] !== ""
      )
    ) {
      if (!comparePasswords(staffData.password, staffData.c_password)) {
        setStaffError((oldError) => ({
          ...oldError,
          c_password: "Passwords do not match",
        }));
        setErrorShow(true);
      } else {
        // console.log(staffData);
        const finalData = {
          name: staffData.f_name + (staffData.l_name ? " " + staffData.l_name : ""),
          email: staffData.email,
          phone: staffData.phone,
          password: staffData.password,
          subRole: staffData.subRole ? staffData.subRole.toUpperCase() : "",
          _id: id
        };
        if (staffData.image) {
          finalData.profile = staffData.image;
        }

        setLoader(true)
        dispatch(
          updateStaffAction(finalData, (response) => {
            if (response?.data?.success) {
              toast.success(response?.data?.message);
              router.push("/admin/staff")
            } else {
              toast.error(response?.data?.message);
            }
          })
        );
        setLoader(false);
      }
    } else {
      setErrorShow(true);
    }
  }

  if (loader) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader color="#D69E2E" size={50} />
      </div>
    );
  }
  return (
    <>
      <Layout>
        <div className="w-full px-4 lg:px-14 pt-12 md:pt-20 flex justify-center">
          <form className="w-full md:w-2/3 rounded-2xl p-6 border-[1px] border-slate-800 my-10 hover:shadow-md hover:shadow-slate-800 duration-300">
            <div className="flex w-full flex-col md:flex-row gap-y-3 gap-x-5">
              <div className="w-full flex flex-col">
                <label htmlFor="f_name" className="text-sm text-gray-400">
                  First Name<sup className="text-red-500 text-[16px]">*</sup>
                </label>
                <div>
                  <input
                    type="text"
                    id="f_name"
                    name="f_name"
                    value={staffData.f_name}
                    onChange={staffInputData}
                    className="w-full outline-none p-2  border border-yellow-500 rounded-md bg-transparent text-sm"
                  />
                  {errorShow && (
                    <p className="text-[12px] text-red-500">
                      {staffError.f_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="l_name" className="text-sm text-gray-400">
                  Last Name
                </label>
                <input
                  type="text"
                  id="l_name"
                  name="l_name"
                  value={staffData.l_name}
                  onChange={staffInputData}
                  className="w-full outline-none p-2  border border-yellow-500 rounded-md bg-transparent text-sm"
                />
              </div>
            </div>
            <div className="mt-4 flex w-full flex-col md:flex-row gap-y-3 gap-x-5">
              <div className="w-full flex flex-col">
                <label htmlFor="phone" className="text-sm text-gray-400">
                  Phone Number<sup className="text-red-500 text-[16px]">*</sup>
                </label>
                <div>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={staffData.phone}
                    onChange={staffInputData}
                    className="w-full outline-none p-2  border border-yellow-500 rounded-md bg-transparent text-sm"
                  />
                  {errorShow && (
                    <p className="text-[12px] text-red-500">
                      {staffError.phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="email" className="text-sm text-gray-400">
                  Email Id<sup className="text-red-500 text-[16px]">*</sup>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={staffData.email}
                  onChange={staffInputData}
                  className="w-full outline-none p-2  border border-yellow-500 rounded-md bg-transparent text-sm"
                />
                {errorShow && (
                  <p className="text-[12px] text-red-500">{staffError.email}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex w-full flex-col md:flex-row gap-y-3 gap-x-5">
              <div className="w-full md:w-1/2 flex flex-col">
                <label htmlFor="subRole" className="text-sm text-gray-400">
                  Sub Role<sup className="text-red-500 text-[16px]">*</sup>
                </label>
                <select
                  id="subRole"
                  name="subRole"
                  value={staffData.subRole}
                  onChange={staffInputData}
                  className="w-full outline-none p-2 border border-yellow-500 rounded-md bg-transparent text-sm"
                >
                  <option value="" className="text-black">Select Sub Role</option>
                  <option value="EXAMINER" className="text-black">EXAMINER</option>
                  <option value="TEACHER" className="text-black">TEACHER</option>
                </select>
                {errorShow && (
                  <p className="text-[12px] text-red-500">{staffError.subRole}</p>
                )}
              </div>

              <div className="w-full md:w-1/2 flex flex-col">
                <label htmlFor="image" className="text-sm text-gray-400">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={staffImageData}
                  className="w-full outline-none p-[5px] border border-yellow-500 rounded-md bg-transparent text-sm"
                />
              </div>
            </div>
            <div className="mt-4 flex w-full flex-col md:flex-row gap-y-3 gap-x-5">
              <div className="w-full flex flex-col">
                <label htmlFor="password" className="text-sm text-gray-400">
                  Password<sup className="text-red-500 text-[16px]">*</sup>
                </label>
                <div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={staffInputData}
                    className="w-full outline-none p-2  border border-yellow-500 rounded-md bg-transparent text-sm"
                  />
                  {errorShow && (
                    <p className="text-[12px] text-red-500">
                      {staffError.password}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="c_password" className="text-sm text-gray-400">
                  Confirm Password
                  <sup className="text-red-500 text-[16px]">*</sup>
                </label>
                <div>
                  <input
                    type="password"
                    id="c_password"
                    name="c_password"
                    onChange={staffInputData}
                    className="w-full outline-none p-2  border border-yellow-500 rounded-md bg-transparent text-sm"
                  />
                  {errorShow && (
                    <p className="text-[12px] text-red-500">
                      {staffError.c_password}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full  flex justify-center md:justify-start mt-4">
              <button
                type="submit"
                onClick={submitData}
                className="w-1/2 md:w-1/4 border p-2 rounded-lg font-bold text-white bg-yellow-500 duration-300 hover:bg-transparent border-yellow-500 text-sm"
              >
                Edit Staff
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default StaffPage;
