"use client";

import React, { useEffect, useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import Swal from "sweetalert2";
import PuffLoader from "react-spinners/PuffLoader";
import Layout from "../components/Layout";
import { deleteStaffAction, listStaffAction, updateStaffAction } from "@/app/redux/actions";
import { useDispatch } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FormControlLabel, Switch, styled } from "@mui/material";


const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

function StaffPage() {
  const [loader, setLoader] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const dispatch = useDispatch();

  function deleteCategory(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoader(true);
        dispatch(
          deleteStaffAction(id, (response) => {
            if (response?.data?.success) {
              Swal.fire({
                title: "Deleted!",
                text: "The staff member has been deleted.",
                icon: "success",
              }).then(() => {
                getStaff();
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Failed to delete the staff member.",
                icon: "error",
              });
            }
            setLoader(false);
          })
        );
      }
    });
  }

  const getStaff = () => {
    setLoader(true); // Enable loader before dispatch
    dispatch(
      listStaffAction((response) => {
        if (response?.data?.success) {
          setStaffData(response?.data?.data?.staffData.reverse() || []);
        }
        setLoader(false); // Disable loader only after data is received
      })
    );
  };
  

  useEffect(() => {
    getStaff();
  }, []);

  function checkStatus(id, status) {
    const payload = {
      status: !status,
      _id: id
    };
    setLoader(true); // Enable loader before dispatch
    dispatch(updateStaffAction(payload, (response) => {
      console.log(response);
      getStaff(); // Refresh the staff data
      setLoader(false); // Disable loader after the update and data refresh
    }));
  }
  

  if (loader) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader color="#D69E2E" size={50} />
      </div>
    );
  }

  return (
    <Layout>
      <div className="w-full px-4 lg:px-14 pt-28">
        <div className="w-full mb-5">
          <Link
            href="/admin/staff/add_staff"
            className="text-center px-10 py-2 text-sm text-white rounded-md border border-yellow-500 bg-yellow-500 hover:bg-transparent duration-300"
          >
            Add Staff
          </Link>
        </div>

        <div className="w-full">
          <div className="overflow-x-auto">
            <table className="table text-start my-10">
              <thead>
                <tr className="text-[15px]">
                  <td>Id</td>
                  <td>Profile</td>
                  <td>Name</td>
                  <td>Email</td>
                  <td>Phone</td>
                  <td>Status</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {/* staffData.length > 0 ? ( */}
                {staffData.map((staff, i) => (
                  <tr key={i} className="">
                    <td>{i + 1}</td>
                    <td className="flex items-center">
                      <img
                        src={staff.profile}
                        alt={`${staff.name}'s profile`}
                        className="h-16 w-16 rounded-full"
                      />
                    </td>
                    <td>
                      <div>{staff.name}</div>
                      <p className="text-xs text-gray-400 capitalize">{staff?.subRole?.toLowerCase()}</p>
                    </td>
                    <td>{staff.email}</td>
                    <td >{staff.phone}</td>
                    <td className="">
                      <div className='flex items-center gap-6'>
                        <span className={`${staff?.status ? "text-green-300" : "text-gray-600"} font-bold`} >{staff?.status ? "Active" : "InActive"}</span>
                        <FormControlLabel
                          control={<IOSSwitch checked={staff?.status} onClick={() => checkStatus(staff?._id, staff?.status)} />}
                        />
                      </div>
                    </td>
                    <td className="">
                      <div className="flex items-center gap-x-5 ">
                        <Link
                          href={`/admin/staff/view_staff/${staff._id}`}
                          className="flex items-center justify-center py-[4px] px-3 rounded-md border-[1px] border-blue-500 text-blue-500 hover:bg-blue-500 duration-300 hover:text-white hover:border-white font-bold"
                          aria-label="View Staff"
                        >
                          <VisibilityIcon className="text-[14px]" />
                        </Link>
                        <Link
                          href={`/admin/staff/edit_staff/${staff._id}`}
                          className="flex items-center justify-center py-[4px] px-3 rounded-md border-[1px] border-green-500 text-green-500 hover:bg-green-500 duration-300 hover:text-white hover:border-white font-bold"
                          aria-label="Edit Staff"
                        >
                          <BorderColorIcon className="text-[14px]" />
                        </Link>
                        <button
                          className="flex items-center justify-center py-[4px] px-3 rounded-md border-[1px] border-red-500 text-red-500 hover:bg-red-500 duration-300 hover:text-white hover:border-white font-bold"
                          onClick={() => deleteCategory(staff._id)}
                          aria-label="Delete Staff"
                        >
                          <DeleteIcon className="text-[14px]" />
                        </button>
                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StaffPage;
