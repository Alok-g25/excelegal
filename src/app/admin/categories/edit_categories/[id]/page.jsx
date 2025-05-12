"use client";

import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useRouter } from "next/navigation";
import { useDispatch} from "react-redux";

import { getSingleCategoryAction, updateCategoryAction } from "@/app/redux/actions";
import {checkValidation,validationImg} from "../../../components/validation/checkValidation";
import PuffLoader from "react-spinners/PuffLoader";
import { toast } from "react-toastify"; // Ensure you import toast
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import Layout from "@/app/admin/components/Layout";

function EditCategoriesPage() {
  const inputImg = useRef(null);
  const [showImg, setShowImg] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [errorShow, setErrorShow] = useState(false);
  let [imageData,setImageData]=useState('')
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize useRouter
  let [loader,setLoader]=useState(false)

  let [categoryData, setCategoryData] = useState({});

  const [categoryError, setCategoryError] = useState({
    name: "",
    image: "",
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryError((old) => {
          return { ...old, [name]: validationImg(e) };
        });
        setImageData(file)
        setImageSrc(reader.result);
        setShowImg(true);
      };
      reader.readAsDataURL(file);
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
      categoryData=imageData?{...categoryData,image:imageData}:categoryData

      // console.log(categoryData)
        dispatch(
          updateCategoryAction(categoryData, (response) => {
            // console.log("updatedff",response.data.success)
            if (response.data.success) {
              toast.success(response.data.message);
              router.push("/admin/categories");
            } else {
              toast.error(response.data.message);
            }
          })
        );
    } else {
      setErrorShow(true);
    }
  }

  function closeImage() {
    setShowImg(false);
    categoryError.image="Image field is Required";
    setImageSrc("");
    if (inputImg.current) {
      inputImg.current.value = "";
    }
  }

  useEffect(() => {
    setLoader(true)
    dispatch(
      getSingleCategoryAction(id, (response) => {
        if(response?.data?.success){
        setImageSrc(response?.data?.data?.image);
        if(response?.data?.data?.image){
          setShowImg(true)
        }
        setCategoryData(response?.data?.data);
      }
      else{}
      setLoader(false)
      })
      );
    }, [dispatch, id]);
    
    delete categoryData.image;
    // console.log(categoryData)

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
                className="p-2 outline-none border-[1px] border-yellow-500 rounded-md w-full bg-transparent"
                value={categoryData.name} // Bind value
              />
            </div>
            {errorShow && (
              <p className="text-[14px] text-red-500">{categoryError.name}</p>
            )}
          </div>
          {/* img */}
          <div className="mt-8 flex flex-col">
            <label htmlFor="cat_img">Category Image:<sup className="text-red-500 text-[14px]">*</sup></label>
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
                name="image"
                id="cat_img"
                ref={inputImg}
                className="pb-2 border-b border-yellow-500 w-full"
                style={{ display: showImg ? "none" : "block" }}
                onChange={handleInputImg}
              />
            </div>
            {errorShow && (
              <p className="text-[14px] text-red-500">{categoryError.image}</p>
            )}
          </div>
          {/* img end */}
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

export default EditCategoriesPage;
