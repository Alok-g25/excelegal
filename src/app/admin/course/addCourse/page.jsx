"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PuffLoader from "react-spinners/PuffLoader";
import { addCourseAction, listCatgoryAction } from "@/app/redux/actions";
import { Box, Typography } from "@mui/material";
import {
  checkValidation,
  validationImg,
} from "../../components/validation/checkValidation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";

function AddCoursePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [value, setValue] = useState(null);
  const { category } = useSelector((state) => state.categoryData)|| [];;
  const [catId, setCatId] = useState("");
  const [loader, setLoader] = useState(false);
  const [courseData, setCourseData] = useState({
    name: "",
    image: "",
    description: "",
  });
  const [courseError, setCourseError] = useState({
    name: "name field is Required",
    image: "image field is Required",
    description: "description field is Required",
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

  function handleInputImg(e) {
    let { name, files } = e.target;
    const file = files[0];
    setErrorShow(false);
    setCourseError((old) => {
      return { ...old, [name]: validationImg(e) };
    });
    setCourseData((old) => {
      return { ...old, [name]: file };
    });
  }

  function submitCourseData(event) {
    event.preventDefault();
    // console.log(categoryError)
    if (
      !Object.keys(courseError).find(
        (x) => courseError[x] && courseError[x] !== ""
      )
    ) {
      if (value === null) {
        toast.error("category field must Required");
      } else {
        const finalData = { ...courseData, category: catId };
        setLoader(true);
        dispatch(
          addCourseAction(finalData, (response) => {
            if (response.data.success) {
              toast.success(response.data.message);
              router.push("/admin/course");
            } else {
              toast.error(response.data.message);
            }
            setLoader(false);
          })
        );
      }
    } else {
      setErrorShow(true);
    }
  }
  useEffect(() => {
    if (category.length == 0) {
      setLoader(true);
      dispatch(listCatgoryAction({}, (response) => {}));
      setLoader(false);
    }
  }, [dispatch]);

  const filterDataOnSelect = useCallback((e, newValue) => {
    // console.log(newValue, '---------------- value');
    setValue(newValue);
    setCatId(newValue._id);
  }, []);

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
        <div className="w-full px-4 lg:px-14 pt-24">
          <form className="w-full md:w-1/2 rounded-lg p-4 mt-3">
            <div className="flex w-full">
              <h1 className="w-1/2">
                Select Categories
                <sup className="text-red-500 text-[14px]">*</sup>
              </h1>
              <div className="w-full">
                <Autocomplete
                  value={value}
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
                            color: "gray",
                          },
                          "& fieldset": {
                            borderColor: "#eab308",
                          },
                          "&:hover fieldset": {
                            borderColor: "#eab308",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#eab308",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "gray",
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
                name="name"
                onChange={handleInputData}
                placeholder="Course Title"
              />
              {errorShow && (
                <p className="text-[14px] text-red-500">{courseError.name}</p>
              )}
              <input
                className="w-full outline-none bg-transparent mt-10 border-b-[1px] pb-1 border-yellow-500"
                type="file"
                onChange={handleInputImg}
                name="image"
              />
              {errorShow && (
                <p className="text-[14px] text-red-500">{courseError.image}</p>
              )}
              <textarea
                rows="4"
                name="description"
                onChange={handleInputData}
                placeholder="Course Description..."
                className="w-full outline-none bg-transparent mt-10 border p-2 rounded-lg border-yellow-500"
              ></textarea>
              {errorShow && (
                <p className="text-[14px] text-red-500">
                  {courseError.description}
                </p>
              )}
              <div className="my-4 flex gap-4">
                <button
                  onClick={submitCourseData}
                  type="submit"
                  className="py-2 px-4 rounded-md border-[1px] border-yellow-500 text-yellow-500 hover:bg-yellow-500 duration-300 hover:text-white hover:border-white font-bold"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default AddCoursePage;
