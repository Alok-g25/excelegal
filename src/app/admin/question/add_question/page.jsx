"use client";

import { addQuestionAction, listCourseAction } from "@/app/redux/actions";
import { Autocomplete, Chip } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import PuffLoader from "react-spinners/PuffLoader";
import { checkValidation } from "../../components/validation/checkValidation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import CancelIcon from "@mui/icons-material/Cancel";


function AddQuestionPage() {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState([]);
  const [courseId, setCourseId] = useState([]);
  const [errorShow, setErrorShow] = useState(false);
  const router = useRouter()
  const { courses } = useSelector((state) => state.courseData) || [];
  // console.log(data,"---------------alok course")
  const [courseData, setCourseData] = useState(courses);

  const [questionData, setQuestionData] = useState({
    question: "",
    a: "",
    b: "",
    c: "",
    d: "",
    answer: "",
    level: ""
  });

  const [questionError, setQuestionError] = useState({
    question: "this field is Required",
    a: "this field is Required",
    b: "this field is Required",
    c: "this field is Required",
    d: "this field is Required",
    answer: "this field is Required",
    level: "this field is Required"
  });

  function handleInputData(e) {
    let { name, value } = e.target;
    setErrorShow(false);
    setQuestionError((oldError) => {
      return { ...oldError, [name]: checkValidation(e) };
    });
    if (name === "answer") {
      setQuestionData((old) => {
        return { ...old, [name]: value.toLowerCase() };
      });
    } else {
      setQuestionData((old) => {
        return { ...old, [name]: value };
      });
    }
  }
  function submitQuestionData(event) {
    event.preventDefault();
    if (
      !Object.keys(questionError).find(
        (x) => questionError[x] && questionError[x] !== ""
      )
    ) {
      // console.log("No errors foun)d in questionError");

      if (value === null) {
        toast.error("course field must Required");
        // console.log("course field is required");
      } else {
        const finalData = { ...questionData, course: courseId };
        console.log("finalData:", finalData);
        setLoader(true)
        dispatch(
          addQuestionAction(finalData, (response) => {
            if (response.data.success) {
              toast.success(response.data.message);
              router.push("/admin/question");
            } else {
              toast.error(response.data.message);
            }
            setLoader(false);
          })
        );
      }
    } else {
      setErrorShow(true);
      console.log("Errors found in questionError, setErrorShow set to true");
    }
  }

  useEffect(() => {
    if (courseData.length === 0) {
      setLoader(true);
      dispatch(
        listCourseAction({}, (response) => {
          if (response?.data?.success) {
            setCourseData(response?.data?.data?.courses);
          } else {
          }
          setLoader(false);
        })

      );
      // console.log("data fetch question  saga -----------------------")
    }
  }, [dispatch]);

  const filterDataOnSelect = useCallback((e, newValue) => {
    if (newValue) {
      setValue(newValue);
      const selectedId = newValue.map((course) => course._id);
      setCourseId(selectedId);
    } else {
      setValue(null);
      setCourseId(null);
    }
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
        <div className='className="w-full px-4 lg:px-14 pt-28'>
          <form action="" className="w-full md:w-2/3">
            <div className="mt-6 md:mt-5 flex flex-wrap md:flex-nowrap gap-y-1">
              <label htmlFor="course" className="md:w-1/4">
                Select Course <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <div className="w-full">
                <Autocomplete
                  multiple
                  value={value}
                  defaultValue={value}
                  onChange={filterDataOnSelect}
                  id="controllable-states-demo"
                  options={courseData} // Assuming category is an array of objects with 'name' property
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Typography>{option.name}</Typography>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Courses..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& input": {
                            color: "white",
                            size: "14px", // Change input text color here
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
                            size: "14px",
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
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={index}
                        label={option.name}
                        {...getTagProps({ index })}
                        deleteIcon={<CancelIcon sx={{ color: "white" }} />}
                        sx={{
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "black",
                          "& .MuiChip-deleteIcon": {
                            color: "white",
                            "&:hover": {
                              color: "white",
                            },
                          },
                        }}
                      />
                    ))
                  }
                />

              </div>
            </div>
            <div className="mt-6 md:mt-5 flex items-center flex-wrap md:flex-nowrap gap-y-1">
              <label htmlFor="question" className="w-1/4">
                Question <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <div className="w-full">
                <textarea
                  id="question"
                  name="question"
                  onChange={handleInputData}
                  rows="2"
                  value={questionData.question}
                  className="p-2 py-2 outline-none border-[1px] border-yellow-500 rounded-md w-full bg-transparent"
                ></textarea>
                {errorShow && (
                  <p className="text-[14px] text-red-500">
                    {questionError.question}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 md:mt-5 flex items-center flex-wrap md:flex-nowrap gap-y-1 ">
              <label htmlFor="ansA" className="w-1/4">
                a <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <div className="w-full">
                <input
                  type="text"
                  id="ansA"
                  name="a"
                  onChange={handleInputData}
                  value={questionData.a}
                  className="p-2 outline-none border-[1px] border-yellow-500 rounded-md w-full bg-transparent"
                />
                {errorShow && (
                  <p className="text-[14px] text-red-500">{questionError.a}</p>
                )}
              </div>
            </div>

            <div className="mt-6 md:mt-5 flex items-center flex-wrap md:flex-nowrap gap-y-1 ">
              <label htmlFor="ansB" className="w-1/4">
                b <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <div className="w-full">
                <input
                  type="text"
                  id="ansB"
                  name="b"
                  onChange={handleInputData}
                  value={questionData.b}
                  className="p-2 outline-none border-[1px] border-yellow-500 rounded-md w-full bg-transparent"
                />
                {errorShow && (
                  <p className="text-[14px] text-red-500">{questionError.b}</p>
                )}
              </div>
            </div>
            <div className="mt-6 md:mt-5 flex items-center flex-wrap md:flex-nowrap gap-y-1 ">
              <label htmlFor="ansC" className="w-1/4">
                c <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <div className="w-full">
                <input
                  type="text"
                  id="ansC"
                  name="c"
                  onChange={handleInputData}
                  value={questionData.c}
                  className="p-2 outline-none border-[1px] border-yellow-500 rounded-md w-full bg-transparent"
                />
                {errorShow && (
                  <p className="text-[14px] text-red-500">{questionError.c}</p>
                )}
              </div>
            </div>
            <div className="mt-6 md:mt-5 flex items-center flex-wrap md:flex-nowrap gap-y-1 ">
              <label htmlFor="ansD" className="w-1/4">
                d <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <div className="w-full">
                <input
                  type="text"
                  id="ansD"
                  name="d"
                  onChange={handleInputData}
                  value={questionData.d}
                  className="p-2 outline-none border-[1px] border-yellow-500 rounded-md w-full bg-transparent"
                />
                {errorShow && (
                  <p className="text-[14px] text-red-500">{questionError.d}</p>
                )}
              </div>
            </div>

            <div className="flex items-center flex-wrap md:flex-nowrap gap-y-1 mt-6 md:mt-5">
              <label htmlFor="CorrectAns" className="w-1/4">
                Answer <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <div className="w-full">
                <select
                  id="CorrectAns"
                  name="answer"
                  onChange={handleInputData}
                  value={questionData.answer}
                  className="p-2 outline-none border-[1px] border-yellow-500 rounded-md w-full bg-transparent"
                >
                  <option value="" className="text-gray-600">Select an answer..</option>
                  <option value="a" className="text-black">a</option>
                  <option value="b" className="text-black">b</option>
                  <option value="c" className="text-black">c</option>
                  <option value="d" className="text-black">d</option>
                </select>
                {errorShow && (
                  <p className="text-[14px] text-red-500">
                    {questionError.answer}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center flex-wrap md:flex-nowrap gap-y-1 mt-6 md:mt-5">
              <label htmlFor="level" className="w-1/4">
                Level <sup className="text-red-500 text-[16px]">*</sup>
              </label>
              <div className="w-full">
                <select
                  id="level"
                  name="level"
                  onChange={handleInputData}
                  value={questionData.level}
                  className="p-2 outline-none border-[1px] border-yellow-500 rounded-md w-full bg-transparent"
                >
                  <option value="" className="text-gray-600">Select Level..</option>
                  <option value="easy" className="text-black">Easy</option>
                  <option value="medium" className="text-black">Medium</option>
                  <option value="hard" className="text-black">Hard</option>
                </select>
                {errorShow && (
                  <p className="text-[14px] text-red-500">
                    {questionError.level}
                  </p>
                )}
              </div>
            </div>

            <div className="text-white flex justify-center items-start mt-4 pb-6">
              <button
                onClick={submitQuestionData}
                type="submit"
                className="w-full md:w-1/4 py-2 rounded-md border-[1px] border-yellow-500 text-yellow-500bg-yellow-500 duration-300 text-white font-bold bg-yellow-500 hover:bg-inherit hover:text-white cursor-pointer text-center"
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default AddQuestionPage;
