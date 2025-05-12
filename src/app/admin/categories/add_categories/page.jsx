"use client";

import React, { useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {checkValidation,validationImg} from "../../components/validation/checkValidation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addCategoryAction } from "@/app/redux/actions";
import PuffLoader from "react-spinners/PuffLoader";
import Layout from "../../components/Layout";

function AddCategoriesPage() {
  const inputImg = useRef(null);
  const [showImg, setShowImg] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [errorShow, setErrorShow] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  let [loader, setLoader] = useState(false);

  const [categoryData, setCategoryData] = useState({
    name: "",
    image: "",
  });

  const [categoryError, setCategoryError] = useState({
    name: "Category Name is required",
    image: "Category Image is required",
  });

  function handleInputData(e) {
    let { name, value } = e.target;
    setErrorShow(false);
    setCategoryError((oldError) => {
      return { ...oldError, [name]: checkValidation(e) };
    });
    setCategoryData((old) => {
      return { ...old, [name]: value };
    });
  }

  function handleInputImg(e) {
    let { name, files } = e.target;
    const file = files[0];
    setErrorShow(false);
    // console.log(name,file);
    if (file) {
      const reader = new FileReader();
      // console.log(reader);
      reader.onloadend = () => {
        setCategoryError((old) => {
          return { ...old, [name]: validationImg(e) };
        });
        setCategoryData((old) => {
          return { ...old, [name]: file };
        });
        setImageSrc(reader.result);
        setShowImg(true);
      };
      reader.readAsDataURL(file);
    }
  }

  function closeImage() {
    setShowImg(false);
    setImageSrc("");
    if (inputImg.current) {
      inputImg.current.value = "";
    }
  }

  function submitCategoryData(event) {
    event.preventDefault();
    // console.log(categoryError)
    if (
      !Object.keys(categoryError).find(
        (x) => categoryError[x] && categoryError[x] !== ""
      )
    ) {
      console.log(categoryData);
      setLoader(true);
      dispatch(
        addCategoryAction(categoryData, (response) => {
          // console.log("response------------",response.data.message)
          if (response.data.success) {
            toast.success(
              `${response.data.data.name} ${response.data.message}`
            );
            router.push("/admin/categories");
          } else {
            toast.error(response.data.message);
          }
          setLoader(false);
        })
      );
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
      <div className="w-full px-4 lg:px-14 pt-28">
        <div className="w-full md:w-1/2">
          <div className="flex flex-col">
            <label htmlFor="categories">
              Category Name <sup className="text-red-500 text-[14px]">*</sup>
            </label>
            <div className="w-full">
              <input
                onChange={handleInputData}
                type="text"
                id="categories"
                name="name"
                className="p-2 outline-none border-[1px] border-yellow-500 rounded-md w-full  bg-transparent"
              />
            </div>
            {errorShow && (
              <p className="text-[14px] text-red-500">{categoryError.name}</p>
            )}
          </div>
          {/* img  */}
          <div className="mt-8 flex flex-col">
            <label htmlFor="categories_img">
              Category Image <sup className="text-red-500 text-[14px]">*</sup>
            </label>
            <div>
              <div
                className="relative w-full sm:w-1/2 h-48"
                style={{ display: showImg ? "block" : "none" }}
              >
                <img
                  className="rounded-xl w-full h-full bg-ontain object-cover"
                  src={imageSrc}
                  alt=""
                  style={{ display: showImg ? "block" : "none" }}
                />
                <button
                  className="absolute -top-2 -right-3 hover:bg-slate-700 duration-300 rounded-full"
                  onClick={closeImage}
                  style={{ display: showImg ? "block" : "none" }}
                >
                  <CloseIcon className="text-white" />
                </button>
              </div>
              <input
                type="file"
                ref={inputImg}
                name="image"
                className="pb-2 border-b border-yellow-500 text-white w-full"
                style={{ display: showImg ? "none" : "block" }}
                onChange={handleInputImg}
              />
            </div>
            {errorShow && (
              <p className="text-[14px] text-red-500">{categoryError.image}</p>
            )}
          </div>
          {/* img end  */}
          <div className="my-8">
            <button
              className="py-2 px-3 rounded-md border-[1px] border-yellow-500 duration-300 text-white font-bold bg-yellow-500 hover:bg-inherit hover:text-white cursor-pointer text-center"
              onClick={submitCategoryData}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
      </Layout>
    </>
  );
}

export default AddCategoriesPage;
