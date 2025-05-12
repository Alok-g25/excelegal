"use client";
import { editProfileAction, getProfileAction } from "@/app/redux/actions";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PuffLoader from "react-spinners/PuffLoader";
import { checkValidation } from "../../components/validation/checkValidation";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications
import Layout from "../../components/Layout";

function EditProfile() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.admindata) || {}; // Default to an empty object
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    profile: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errorShow, setErrorShow] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const inputImg = useRef(null);
  const [imgFile, setImgFile] = useState("");
  const router = useRouter();

  function handleImageData(e) {
    let { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // setData((old) => ({
        //   ...old,
        //   [name]: file // Use reader.result to get the data URL
        // }));
        setImgFile(file);
        setImageSrc(reader.result);
        setShowImg(true);
      };
      reader.readAsDataURL(file);
    }
  }

  function closeImage(e) {
    e.preventDefault();
    setShowImg(false);
    setImageSrc("");
    if (inputImg.current) {
      inputImg.current.value = "";
    }
  }

  useEffect(() => {
    if (profile === null) {
      // console.log("alok kumara----------------------")
      dispatch(getProfileAction());
    } else {
      setData(profile);
      if (profile.profile) {
        setImageSrc(profile.profile);
        setShowImg(true);
      }
    }
  }, [dispatch,profile]);

  // useEffect(() => {
  //   if (profile) {
  //     setData(profile);
  //     if (profile.profile) {
  //       setImageSrc(profile.profile);
  //       setShowImg(true);
  //     }
  //   }
  // }, [profile]);

  function handleInputData(e) {
    let { name, value } = e.target;
    setErrorShow(false);
    setError((oldError) => ({
      ...oldError,
      [name]: checkValidation(e),
    }));
    setData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  }

  if (!profile) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader color="#D69E2E" size={50} />
      </div>
    );
  }

  function submitData(e) {
    e.preventDefault();
    if (!Object.keys(error).find((x) => error[x] && error[x] !== "")) {
      let formData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };

      formData = imgFile ? { ...formData, profile: imgFile } : formData;

      dispatch(
        editProfileAction(formData, (response) => {
          // console.log(response.data.message);
          if (response.data.success) {
            console.log(response.data.message);
            toast.success(response.data.message);
            router.push("/admin/profile");
          } else {
            toast.error(response.data.message);
          }
        })
      );
    } else {
      setErrorShow(true);
    }
  }

  return (
    <>
      <Layout>
        <div className="w-full px-4 lg:px-14 pt-20 flex justify-center">
          <form className="w-full md:w-1/2 rounded-2xl p-4 shadow-md shadow-slate-700 my-7">
            <div className="flex w-full flex-col md:flex-none mt-2">
              <label className="w-full text-sm" htmlFor="name">
                Name <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <input
                className="w-full mb-3 outline-none p-2 border border-yellow-500 rounded-md bg-transparent"
                type="text"
                name="name"
                value={data.name}
                onChange={handleInputData}
              />
              {errorShow && (
                <p className="text-[14px] text-red-500">{error.name}</p>
              )}
            </div>
            <div className="flex w-full flex-col md:flex-none mt-2">
              <label className="w-full text-sm" htmlFor="email">
                Email <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <input
                className="w-full mb-3 outline-none p-2 border border-yellow-500 rounded-md bg-transparent"
                type="email"
                name="email"
                value={data.email}
                onChange={handleInputData}
                disabled
              />
              {errorShow && (
                <p className="text-[14px] text-red-500">{error.email}</p>
              )}
            </div>
            <div className="flex w-full flex-col md:flex-none mt-2">
              <label className="w-full text-sm" htmlFor="phone">
                Phone <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <input
                className="w-full mb-3 outline-none p-2 border border-yellow-500 rounded-md bg-transparent"
                type="text"
                name="phone"
                value={data.phone}
                onChange={handleInputData}
              />
              {errorShow && (
                <p className="text-[14px] text-red-500">{error.phone}</p>
              )}
            </div>
            <div className="flex w-full flex-col md:flex-none mt-2">
              <label htmlFor="profile">Profile Image:</label>
              <div>
                {showImg && (
                  <div className="relative w-1/2 md:w-1/3 h-56">
                    <img
                      className="w-full h-full bg-contain object-cover rounded-sm"
                      src={imageSrc}
                      alt=""
                    />
                    <button
                      className="absolute -top-2 -right-3 hover:bg-slate-700 duration-300 rounded-full"
                      onClick={closeImage}
                    >
                      <CloseIcon className="text-white" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  name="profile"
                  ref={inputImg}
                  className="pb-2 border-b border-yellow-500 w-full"
                  style={{ display: showImg ? "none" : "block" }}
                  onChange={handleImageData}
                />
              </div>
            </div>
            <div className="w-full justify-center flex md:justify-start mt-2">
              <button
                className="w-1/2 md:w-1/4 border p-2 rounded-lg font-bold bg-yellow-500 text-white hover:bg-transparent duration-300 border-yellow-500"
                onClick={submitData}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default EditProfile;
