"use client";

import React, { useEffect, useState } from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import { logoutAction } from "@/app/redux/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "@/app/redux/actions/index";
import { usePathname } from "next/navigation"; // Import usePathname to get current pathname

function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.admindata) || {}; // Default to an empty object
  const pathname = usePathname(); // Get current pathname
  const [activeLink, setActiveLink] = useState(pathname); // Initialize state with current pathname

  useEffect(() => {
    if (profile === null) {
      dispatch(getProfileAction());
    }
  }, [dispatch]);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
  };

  const { role } = profile ? profile : { role: "STAFF" };

  const navItem = (
    <>
      <li>
        <Link
          href="/admin/dashboard"
          className={`text-md font-bold px-3 py-1 rounded-md ${
            activeLink === "/admin/dashboard"
              ? "border-b border-yellow-500"
              : ""
          }`}
          onClick={() => handleNavClick("/admin/dashboard")}
        >
          Dashboard
        </Link>
      </li>
      <li>
        <Link
          href="/admin/banner"
          className={`text-md font-bold px-3 py-1 rounded-md ${
            activeLink === "/admin/banner" ? "border-b border-yellow-500" : ""
          }`}
          onClick={() => handleNavClick("/admin/banner")}
        >
          Banner
        </Link>
      </li>
      {role === "ADMIN" && (
        <li>
          <Link
            href="/admin/enquiry-details"
            className={`text-md font-bold px-3 py-1 rounded-md ${
              activeLink === "/admin/enquiry-details" ? "border-b border-yellow-500" : ""
            }`}
            onClick={() => handleNavClick("/admin/enquiry-details")}
          >
            Enquiry Details
          </Link>
        </li>
      )}
      {role === "ADMIN" && (
        <li>
          <Link
            href="/admin/student"
            className={`text-md font-bold px-3 py-1 rounded-md ${
              activeLink === "/admin/student" ? "border-b border-yellow-500" : ""
            }`}
            onClick={() => handleNavClick("/admin/student")}
          >
            Student
          </Link>
        </li>
      )}
      {role === "ADMIN" && (
        <li>
          <Link
            href="/admin/staff"
            className={`text-md font-bold px-3 py-1 rounded-md ${
              activeLink === "/admin/staff" ? "border-b border-yellow-500" : ""
            }`}
            onClick={() => handleNavClick("/admin/staff")}
          >
            Staff
          </Link>
        </li>
      )}
      {role === "ADMIN" && (
        <li>
          <Link
            href="/admin/categories"
            className={`text-md font-bold px-3 py-1 rounded-md ${
              activeLink === "/admin/categories"
                ? "border-b border-yellow-500"
                : ""
            }`}
            onClick={() => handleNavClick("/admin/categories")}
          >
            Categories
          </Link>
        </li>
      )}
      <li>
        <Link
          href="/admin/course"
          className={`text-md font-bold px-3 py-1 rounded-md ${
            activeLink === "/admin/course" ? "border-b border-yellow-500" : ""
          }`}
          onClick={() => handleNavClick("/admin/course")}
        >
          Courses
        </Link>
      </li>
      <li>
        <Link
          href="/admin/question"
          className={`text-md font-bold px-3 py-1 rounded-md ${
            activeLink === "/admin/question" ? "border-b border-yellow-500" : ""
          }`}
          onClick={() => handleNavClick("/admin/question")}
        >
          Question
        </Link>
      </li>
      <li>
        <Link
          href="/admin/quiz"
          className={`text-md font-bold px-3 py-1 rounded-md ${
            activeLink === "/admin/quiz" ? "border-b border-yellow-500" : ""
          }`}
          onClick={() => handleNavClick("/admin/quiz")}
        >
          Quiz
        </Link>
      </li>
    </>
  );

  function logout() {
    dispatch(
      logoutAction((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          router.push("/admin/login");
        } else {
          toast.error(response.data.message);
        }
      })
    );
  }

  console.log(profile?.profile)

  return (
    <nav
      className={`w-full px-4 z-50 lg:px-14 fixed top-0 left-0 right-0 duration-300 ${
        sticky ? "bg-slate-800" : ""
      }`}
    >
      <div className="navbar relative">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-slate-800 rounded-box w-40"
            >
              {navItem}
            </ul>
          </div>
          <Link href="/admin/dashboard">
            <h1 className="font-bold flex gap-2 text-xl justify-center text-yellow-500">
              <AccountBalanceIcon className="text-xl lg:text-3xl text-yellow-500 hidden md:block" />{" "}
              Excelegal
            </h1>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 flex gap-3">{navItem}</ul>
        </div>
        <div className="navbar-end">
          <button
            className={`w-12 h-12 rounded-full border-[2px] hover:border-yellow-500 ${
              showUser ? "border-yellow-500" : "border-gray-400"
            }`}
            onClick={() => setShowUser(!showUser)}
          >
            <img
              className="w-full h-full rounded-full object-cover overflow-hidden"
              src={
                profile && profile.profile
                  ? profile.profile
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt=""
            />
          </button>
        </div>
      </div>
      <div
        className={`p-4 flex flex-col shadow shadow-slate-700 rounded-lg w-48 bg-slate-800 text-white absolute top-18 ${
          showUser ? "right-6 md:right-16" : "-right-48"
        }`}
      >
        <div className="relative">
          <p
            className="absolute -top-3 -right-3 hover:bg-slate-700 duration-300 rounded-full cursor-pointer"
            onClick={() => setShowUser(!showUser)}
          >
            <CloseIcon />
          </p>
          {profile && (
            <>
              <p className="font-semibold text-[14px]">{profile.name}</p>
              <p className="-mt-1 mb-2 pb-1 border-b border-slate-700 text-[12px]">
                {profile.email}
              </p>
            </>
          )}
        </div>
        <Link
          href="/admin/profile"
          className="inline-block text-sm mb-2 hover:text-gray-400 duration-300"
        >
          Profile
        </Link>
        <Link
          href="/admin/u_password"
          className="inline-block text-sm mb-2 hover:text-gray-400 duration-300"
        >
          Change Password
        </Link>
        {/* <Link
          href="#"
          className="mb-2 pb-1 border-b border-slate-700 inline-block text-sm"
        >
          Setting
        </Link> */}
        <button
          onClick={logout}
          className="mt-1 text-red-600 inline-block text-start hover:text-red-800 duration-300 text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
