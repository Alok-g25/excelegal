"use client";

import React, { useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  checkValidation,
  validationImg,
} from "../../components/validation/checkValidation";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import PuffLoader from "react-spinners/PuffLoader";
import { addBannerAction } from "@/app/redux/actions";
import { toast } from "react-toastify";
import Layout from "../../components/Layout"

function AddBannerPage() {
  const [showImg, setShowImg] = useState(false);
  const [imageSrc, setImageSrc] = useState("/images/bannerImage2.png");
  const inputImg = useRef(null);
  const [myImg, setMyImg] = useState("");
  const [errorShow, setErrorShow] = useState(false);
  const dispatch = useDispatch()
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [bannerError, setBannerError] = useState({
    image: "Banner Image is required",
    description: "description is requried"
  });
  const [description, setDescription] = useState("")

  function handleInputImg(e) {
    let { name, files } = e.target;
    const file = files[0];
    setErrorShow(false);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const validationMessage = validationImg(e);
        setBannerError((prevError) => ({
          ...prevError,
          [name]: validationMessage,
        }));
        setMyImg(file);
        setImageSrc(reader.result);
        setShowImg(true);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleInputData(e) {
    let { name, value } = e.target;
    setErrorShow(false);
    setBannerError((oldError) => {
      return { ...oldError, [name]: checkValidation(e) };
    });
    setDescription(e.target.value)
  }

  function closeImage(e) {
    e.preventDefault();
    setShowImg(false);
    setMyImg("");
    setImageSrc("/images/bannerImage2.png");
    setBannerError({ image: "Image is required" });
    if (inputImg.current) {
      inputImg.current.value = "";
    }
  }

  function submitData(e) {
    e.preventDefault();
    console.log(bannerError);
    if (
      !Object.keys(bannerError).find(
        (x) => bannerError[x] && bannerError[x] !== ""
      )
    ) {
      // setLoader(true)
      const finalData = { image: myImg,description:description}
      console.log(finalData)
      dispatch(addBannerAction(finalData, (respone) => {
        if (respone?.data?.success) {
          toast.success(respone?.data?.message)
          router.push("/admin/banner")
        } else {
          toast.error(respone?.data?.message)
          setLoader(false)
        }
        setLoader(false)
      }))
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
  // console.log(description)

  return (
    <>
      <Layout>
        <div className="w-full px-4 lg:px-14 pt-20">
          <div className="w-full flex justify-center flex-col items-center mb-5">
            <div className="w-full md:w-[650px] h-60 relative border-[1px] border-dashed border-slate-500 rounded-lg">
              {showImg ? (
                <img
                  className="w-full h-full rounded-lg overflow-hidden object-cover bg-contain"
                  src={imageSrc}
                  alt=""
                />
              ) : (
                <div
                  className="w-full h-full rounded-lg flex justify-center items-center flex-col"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <img
                    src={imageSrc}
                    alt=""
                    className="w-24 h-24"
                  />
                  <div className="mt-4">
                    <p className="text-md font-bold text-white text-center">
                      Choose Your Image
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Click to find the Perfect Banner for your Exceleagal
                    </p>
                  </div>
                </div>
              )}

              {errorShow && (
                <p className="text-[14px] text-red-500">{bannerError.image}</p>
              )}
              {showImg ? (
                <button
                  onClick={closeImage}
                  className="absolute -top-3 -right-3 p-1 z-10 bg-gray-500 rounded-full hover:bg-gray-600 duration-300 text-white hover:scale-105"
                >
                  <CloseIcon />
                </button>
              ) : (
                <input
                  type="file"
                  ref={inputImg}
                  name="image"
                  onChange={handleInputImg}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-0 cursor-pointer file:hidden"
                />
              )}
            </div>
            <div className="flex mt-5 justify-start w-full md:w-[650px] flex-col">
              <label htmlFor="description" className="text-sm">Description <span className="text-red-600 text-left">*</span></label>
              <textarea name="description" value={description} onChange={handleInputData} id="description" rows="7" className="bg-inherit border-[1px] border-slate-500 rounded-md text-sm px-4 py-2 outline-none"></textarea>
              {errorShow && (
                <p className="text-[14px] text-red-500">{bannerError.description}</p>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center mb-10">
            <button
              onClick={submitData}
              className="text-center py-2 px-20 rounded-md border text-white font-bold text-sm border-yellow-500 bg-yellow-500 hover:bg-transparent duration-300"
            >
              Submit
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default AddBannerPage;
