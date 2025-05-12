"use client"

import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "@/app/redux/actions/index";
import PuffLoader from "react-spinners/PuffLoader";
import Layout from "../components/Layout";

function ProfilePage() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.admindata) || {}; // Default to an empty object

  useEffect(() => {
      dispatch(getProfileAction());
    }, [dispatch]);
  

  if (!profile) {
    return (
      <>
        <div className="w-screen h-screen flex justify-center items-center">
          <PuffLoader color="#D69E2E"  size={50}/>
        </div>
      </>
    );
  }
console.log(profile,"&&&&&&&&&&&&&&&&&&&&")
  return (
    <>
    <Layout>
      <div className="w-full px-4 lg:px-14 pt-32 flex justify-center mb-10">
        <div className="w-auto rounded-2xl flex p-4 justify-center gap-5 items-center md:justify-between flex-wrap shadow-md shadow-gray-600">
          <div className="w-40 h-40 rounded-full border border-yellow-500 overflow-hidden">
            <img
              className="rounded-full object-cover  bg-contain bg-center w-full border-yellow-500 h-full overflow-hidden"
              src={profile.profile?profile.profile:"https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
            />
            {/* <img
              className="rounded-full object-cover w-full border-yellow-500 h-full"
              src="https://img.freepik.com/premium-vector/no-photos-icon-vector-image-can-be-used-spa_120816-264914.jpg?w=740"
              alt="Profile"
            /> */}
          </div>
          <div className="mt-4 flex flex-col  gap-3">
            <pre>name   : {profile.name}</pre>
            <pre>email  : {profile.email}</pre>
            <pre>Phone  : {profile.phone}</pre>
            <pre>Role   : {profile.role}{profile.subRole?(<span className="text-xs text-gray-600">{profile.subRole}</span>):""}</pre>
            <Link href={`/admin/profile/edit_profile/`} className="border p-2 text-center rounded-lg bg-green-500 hover:bg-green-700 duration-300 font-bold">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
      </Layout>
    </>
  );
}

export default ProfilePage;
