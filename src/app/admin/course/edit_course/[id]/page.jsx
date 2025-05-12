"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCourseAction,
  deleteTopicAction,
  getSingleCourseAction,
  listCatgoryAction,
  updateCourseAction,
} from "@/app/redux/actions";
import PuffLoader from "react-spinners/PuffLoader";
import { Box, Typography } from "@mui/material";
import { checkValidation } from "../../../components/validation/checkValidation";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Layout from "../../../components/Layout";

function EditCourse() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState({});
  const [categoryValue, setCategoryValue] = useState({});

  const [loader, setLoader] = useState(true);

  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.categoryData)|| [];;

  const [imgFile, setImgFile] = useState("");
  const [showImg, setShowImg] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const inputImg = useRef(null);

  const router = useRouter();
  const [courseError, setCourseError] = useState({
    name: "",
    image: "",
    description: "",
  });
  const [errorShow, setErrorShow] = useState(false);

  function handleInputData(e) {
    let { name, value } = e.target;
    setErrorShow(false);
    setCourseError((oldError) => {
      return { ...oldError, [name]: checkValidation(e) };
    });
    setCourseData((old) => {
      return { ...old, [name]: value };
    });
  }

  function handleImageData(e) {
    let { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
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

  function submitCategoryData(event) {
    event.preventDefault();
    if (
      !Object.keys(courseError).find(
        (x) => courseError[x] && courseError[x] !== ""
      )
    ) {
      delete courseData?.image;
      delete courseData?.created_at;
      delete courseData?.topics;
      delete courseData?.status;
      const finalData = imgFile
        ? { ...courseData, image: imgFile, category: categoryValue?._id }
        : { ...courseData, category: categoryValue?._id };
      // console.log(finalData, "---------------------finaldata");
      setLoader(true);
      dispatch(
        updateCourseAction(finalData, (response) => {
          if (response?.data?.success) {
            toast.success(response?.data?.message);
            router.push("/admin/course");
          } else {
            toast.error(response?.data?.message);
          }
        })
      );
      setLoader(false);
    } else {
      setErrorShow(true);
    }
  }

  function getCourseData() {
    setLoader(true);
    dispatch(
      getSingleCourseAction(id, (response) => {
        if (response?.data?.success) {
          setCourseData(response?.data?.data);
          setImageSrc(response?.data?.data?.image);
          setCategoryValue(response?.data?.data?.category);
        } else {
        }
        setLoader(false);
      })
    );
  }

  function getCategoryData() {
    setLoader(true);
    dispatch(
      listCatgoryAction({}, (response) => {
        if (response?.data?.success) {
        } else {
        }
        setLoader(false);
      })
    );
  }
  useEffect(() => {
    getCourseData();
    if(category?.length==0){
      getCategoryData();
    }
  }, []);

  if (loader) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader color="#D69E2E" size={50} />
      </div>
    );
  }

  const filterDataOnSelect = (e, v) => {
    setCategoryValue(v);
  };

  function deleteCourseData(id) {
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
          deleteCourseAction(id, (response) => {
            if (response?.data?.success) {
              Swal.fire({
                title: "Deleted!",
                text: "Your courses has been deleted.",
                icon: "success",
              }).then(() => {});
            } else {
            }
            router.push("/admin/course");
            setLoader(false);
          })
        );
      }
    });
  }

  //topic delete
  function deleteTopic(id) {
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
          deleteTopicAction(id, (response) => {
            if (response?.data?.success) {
              Swal.fire({
                title: "Deleted!",
                text: "Your topics has been deleted.",
                icon: "success",
              }).then(() => {});
            } else {
            }
            getCourseData();
            getCategoryData();
            setLoader(false);
          })
        );
      }
    });
  }

  return (
    <>
      <Layout>
        <div className="w-full px-4 lg:px-14 pt-24">
          <form action="" className=" w-full md:w-1/2 rounded-lg p-4 mt-3">
            <div className="flex w-full">
              <h1 className="w-1/2">Select Categories </h1>
              <div className="w-full">
                <Autocomplete
                  value={categoryValue}
                  defaultValue={categoryValue}
                  onChange={filterDataOnSelect}
                  id="controllable-states-demo"
                  options={category} // Assuming category is an array of objects with 'name' property
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Typography>{option.name}</Typography>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search by Category"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& input": {
                            color: "white",
                          },
                          "& fieldset": {
                            borderColor: "#eab308",
                          },
                          "&:hover fieldset": {
                            borderColor: "#eab308",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "white",
                          "&.Mui-focused": {
                            color: "white",
                          },
                        },
                      }}
                    />
                  )}
                  componentsProps={{
                    clearIndicator: {
                      sx: {
                        color: "white",
                        "&:hover": {
                          color: "white",
                        },
                      },
                      children: <ClearIcon />,
                    },
                    popupIndicator: {
                      sx: {
                        color: "white",
                        "&:hover": {
                          color: "white",
                        },
                      },
                      children: <ExpandMoreIcon />,
                    },
                  }}
                />
              </div>
            </div>

            <div>
              <input
                className="w-full outline-none bg-transparent mt-10 border-b-[1px] border-yellow-500 pb-1"
                type="text"
                placeholder="Course Title"
                name="name"
                value={courseData?.name}
                onChange={handleInputData}
              />
              {errorShow && (
                <p className="text-[14px] text-red-500">{courseError.name}</p>
              )}
              <div className="mt-8">
                {showImg && (
                  <div className="relative w-full md:w-1/2 h-56">
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
              <textarea
                rows="6"
                name="description"
                value={courseData?.description}
                onChange={handleInputData}
                placeholder="Course Description..."
                className="w-full outline-none bg-transparent mt-10 border p-2 rounded-lg border-yellow-500"
              ></textarea>
              {errorShow && (
                <p className="text-[14px] text-red-500">
                  {courseError.description}
                </p>
              )}
              <div className="my-4 flex  justify-start md:justify-normal gap-4 flex-wrap">
                <button
                  onClick={submitCategoryData}
                  className="py-2 px-4 rounded-md border-[1px] border-yellow-500 text-yellow-500 hover:bg-yellow-500 duration-300 hover:text-white hover:border-white font-bold"
                >
                  Update Course
                </button>
                {/* add topic  */}
                <Link
                  href={`/admin/course/addCourse/addtopic/${courseData?._id}`}
                  type="button"
                  className="py-2 px-4 rounded-md border-[1px] border-blue-600 text-blue-600 hover:bg-blue-600 duration-300 hover:text-white hover:border-white font-bold"
                >
                  Add Topic
                </Link>
                {/* delete course btn  */}
                <button
                  onClick={() => deleteCourseData(courseData?._id)}
                  type="button"
                  className="py-2 px-4 rounded-md border-[1px] border-red-500 text-red-500 hover:bg-red-500 duration-300 hover:text-white hover:border-white font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </form>
          {/* topic link */}
          <div className="flex flex-col">
            {courseData?.topics ? (
              <h1 className="text-lg font-semibold w-full md:w-2/3 my-4 text-center text-yellow-500 underline">
                All Topics
              </h1>
            ) : (
              ""
            )}
            {courseData?.topics
              ? courseData?.topics?.map((item, i) => {
                  return (
                    <>
                      <tr className="flex mb-2 w-full md:w-2/3 gap-5 justify-between">
                        <td>
                          <span className="me-2 text-yellow-500">{i + 1}</span>
                          {item.name}
                        </td>
                        <td className="flex gap-2">
                          <Link
                            href={`/admin/course/edit_course/edit_topic/${item._id}`}
                            className="py-1 px-4 text-[8px] rounded-md border-[1px] border-green-500 text-green-500 hover:bg-green-500 duration-300 hover:text-white hover:border-white font-bold"
                          >
                            <BorderColorIcon fontSize="small" />
                          </Link>
                          <button
                            onClick={() => deleteTopic(item._id)}
                            className="py-[2px] px-4 rounded-md border-[1px] border-red-500 text-red-500 hover:bg-red-500 duration-300 hover:text-white hover:border-white font-bold"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </td>
                      </tr>
                    </>
                  );
                })
              : ""}
          </div>
        </div>
      </Layout>{" "}
    </>
  );
}

export default EditCourse;
