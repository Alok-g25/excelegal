"use client";

import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginAction } from "@/app/redux/actions/index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';



function LoginPage() {
  const [togglePass, setTogglePass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = (data) => {
    setIsSubmitting(true); // Start loader
    dispatch(
      loginAction(data, (response) => {
        setIsSubmitting(false); // Stop loader
        if (response.data.success) {
          toast.success(response.data.message);
          router.push("/admin/dashboard");
        } else {
          toast.error(response.data.message);
        }
      })
    );
  };

  function togglePassBtn() {
    setTogglePass(!togglePass);
  }

  return (
    <>
      <div className="flex justify-center items-center main p-5">
        <div className="w-full sm:w-[500px] p-5 md:px-14 rounded-lg boxTransparent">
          <h1 className="text-center text-xl font-bold uppercase mb-6">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: true,
              })}
              className="w-full border-none p-2 inputbox rounded-md"
              disabled={isSubmitting} // Disable input when submitting
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
            <div className="relative mt-5">
              <input
                type={togglePass ? "text" : "password"}
                placeholder="Password"
                className="w-full border-none p-2 rounded-md inputbox"
                {...register("password", {
                  required: true,
                })}
                disabled={isSubmitting} // Disable input when submitting
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">This field is required</p>
              )}
              <p
                onClick={togglePassBtn}
                className="absolute top-2 right-2 cursor-pointer"
              >
                {togglePass ? (
                  <VisibilityIcon className="p-1 hover:scale-110 rounded-full" />
                ) : (
                  <VisibilityOffIcon className="p-1 hover:scale-110 rounded-full" />
                )}
              </p>
            </div>
            <input
              type="submit"
              className="w-full my-4 p-2 text-white font-bold border border-yellow-500 bg-yellow-500 cursor-pointer rounded-md hover:bg-transparent hover:text-yellow-500 duration-300"
              value={isSubmitting ? "Logging in..." : "Login"} // Change button text
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

export default LoginPage;
