"use client";

import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { changePassword } from "@/app/redux/actions/index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

function ChangePasswordPage() {
  const [oldPassBtn, setOldPassBtn] = useState(false);
  const [newPassBtn, setNewPassBtn] = useState(false);
  const [c_newPassBtn, setc_newPassBtn] = useState(false);
  const dispatch=useDispatch()
  const router=useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false); // Loader state
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  
  const onSubmit = (data) => {
    // console.log(data);
    setIsSubmitting(true);
    delete data.c_newPass;
    // console.log(data)
    dispatch(changePassword(data,(response)=>{
      // console.log("response",response)
      if(response.data.success){
        toast.success(response.data.message)
          router.push("/admin/dashboard")
      }
      else{
        toast.error(response.data.message)
      }
    }))
    setIsSubmitting(false);
  };

  const newPassword = watch("new_password");
  return (
    <>
      <div className="flex justify-center items-center main p-5">
        <div className="w-full sm:w-[500px] p-5 md:px-14 rounded-lg boxTransparent">
          <h1 className="text-center text-lg font-bold uppercase mb-6">Update Password</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* oldpassword */}
            <div className="relative mt-4">
              <input
                type={oldPassBtn ? "text" : "password"}
                placeholder="Current Password"
                className="w-full border-none p-2 rounded-md inputbox"
                {...register("current_password", {
                  required: true,
                })}
                disabled={isSubmitting} // Disable input when submitting
              />
              {errors.current_password && (
                <p className="text-red-500 text-[13px]">current password is required</p>
              )}
              <p
                onClick={() => setOldPassBtn(!oldPassBtn)}
                className="absolute top-2 right-2 cursor-pointer"
              >
                {oldPassBtn ? (
                  <VisibilityIcon className="p-1 hover:scale-110 rounded-full" />
                ) : (
                  <VisibilityOffIcon className="p-1 hover:scale-110 rounded-full" />
                )}
              </p>
            </div>

            {/* new password  */}
            <div className="relative mt-4">
              <input
                type={newPassBtn ? "text" : "password"}
                placeholder="New Password"
                className="w-full border-none p-2 rounded-md inputbox"
                {...register("new_password", {
                  required: true,
                })}
                disabled={isSubmitting} // Disable input when submitting
              />
              {errors.new_password && (
                <p className="text-red-500 text-[13px]">New password is required</p>
              )}
              <p
                onClick={() => setNewPassBtn(!newPassBtn)}
                className="absolute top-2 right-2 cursor-pointer"
              >
                {newPassBtn ? (
                  <VisibilityIcon className="p-1 hover:scale-110 rounded-full" />
                ) : (
                  <VisibilityOffIcon className="p-1 hover:scale-110 rounded-full" />
                )}
              </p>
            </div>

            {/*Confirm new password  */}
            <div className="relative mt-4">
              <input
                type={c_newPassBtn ? "text" : "password"}
                placeholder="Confirm New Password"
                className="w-full border-none p-2 rounded-md inputbox"
                {...register("c_newPass", {
                  required: true,
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                disabled={isSubmitting} // Disable input when submitting
              />
              {errors.c_newPass && (
                <p className="text-red-500 text-[13px]">
                  {errors.c_newPass.message}
                </p>
              )}
              <p
                onClick={() => setc_newPassBtn(!c_newPassBtn)}
                className="absolute top-2 right-2 cursor-pointer"
              >
                {c_newPassBtn ? (
                  <VisibilityIcon className="p-1 hover:scale-110 rounded-full" />
                ) : (
                  <VisibilityOffIcon className="p-1 hover:scale-110 rounded-full" />
                )}
              </p>
            </div>
            <input
              type="submit"
              className="w-full my-6 p-2 text-white text-sm border border-yellow-500 bg-yellow-500 cursor-pointer rounded-md hover:bg-transparent hover:text-yellow-500 duration-300"
              value={isSubmitting ? "Updating Password..." : "Update Password"} // Change button text
              disabled={isSubmitting} // Disable button when submitting
            />
          </form>
          {isSubmitting && (
            <div className="flex justify-center mt-4">
              <div className="loader"></div> {/* Loader component */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ChangePasswordPage;
