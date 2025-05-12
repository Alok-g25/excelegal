"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {  getSingleStaffAction } from "@/app/redux/actions/index";
import PuffLoader from "react-spinners/PuffLoader";
import Layout from "../../../components/Layout";
import { useParams } from "next/navigation";

function ProfilePage() {
const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [staffData, setStaffData] = useState({});
  const { id } = useParams();
  const getStaff = () => {
    setLoader(true);
    dispatch(getSingleStaffAction(id, (response) => {
        if (response?.data?.success) {
            // console.log(response?.data?.data,"stffffffffffffffffffffffffffffff")

        setStaffData(response?.data?.data);
        }        
        setLoader(false); // Only set loader to false after the response is received
    }))
}

  useEffect(() => {
    getStaff()
    }, []);
  

  if (loader) {
    return (
      <>
        <div className="w-screen h-screen flex justify-center items-center">
          <PuffLoader color="#D69E2E"  size={50}/>
        </div>
      </>
    );
  }

  return (
    <>
    <Layout>
      <div className="w-full px-4 lg:px-14 pt-32 flex justify-center mb-10">
        <div className="w-auto rounded-2xl flex p-4 justify-center gap-5 items-center md:justify-between flex-wrap shadow-md shadow-gray-600">
          <div className="w-40 h-40 rounded-full border border-yellow-500 overflow-hidden">
            <img
              className="rounded-full object-cover  bg-contain bg-center w-full border-yellow-500 h-full overflow-hidden"
              src={staffData.profile?staffData.profile:"https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
            />
          </div>
          <div className="mt-4 flex flex-col  gap-3">
            <pre>name   : {staffData.name}</pre>
            <pre>email  : {staffData.email}</pre>
            <pre>Phone  : {staffData.phone}</pre>
            <pre>Role   : {staffData.subRole}</pre>
            <pre>Status : {staffData.status?<span className="text-green-600">Active</span>:<span className="text-red-600">InActive</span>}</pre>
            <Link href={`/admin/staff/edit_staff/${id}`} className="border p-2 text-center rounded-lg bg-green-500 hover:bg-green-700 duration-300 font-bold">
              Edit Staff
            </Link>
          </div>
        </div>
      </div>
      </Layout>
    </>
  );
}

export default ProfilePage;
