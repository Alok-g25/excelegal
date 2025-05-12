"use client";

import { useCallback, useEffect, useState } from "react";
import { Autocomplete, TextField, Box, Typography, Chip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  addQuizAction,
  getProfileAction,
  listCourseAction,
  questionByCourseAction,
} from "@/app/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import PuffLoader from "react-spinners/PuffLoader";
import { checkValidation } from "../../components/validation/checkValidation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";

function AddQuizPage() {
  const [courseId, setCourseId] = useState(null);
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();
  const options = ["easy", "medium", "hard"];
  const [loader, setLoader] = useState(false);
  // const [errorShow, setErrorShow] = useState(false);
  const [levelValue, setLevelValue] = useState(null);
  const [duration, setDutration] = useState("");
  const [allQquestions, setAllQuestions] = useState([]);
  const [questionValue, setQuestionValue] = useState([]);
  const [questionValueId, setQuestionValueId] = useState([]);
  const router = useRouter();
  const [weightage, setWeightage] = useState(10);
  const { courses } = useSelector((state) => state.courseData) || [];
  const [courseData, setCourseData] = useState(courses);
  const { profile } = useSelector((state) => state.admindata) || {}; // Default to an empty object

  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);



  const [quizData, setQuizData] = useState({
    name: "",
    no_of_questions: "",
  });
  const [quizDataError, setQuizDataError] = useState({
    name: "Quiz title Field is Required",
    no_of_questions: "Question  Field is Required",
  });


  function handleInputDataQuestion(e) {
    let { name, value } = e.target;
    // console.log(typeof parseInt(value))
    if (parseInt(value) > allQquestions.length) {
      toast.error(`${value} question not available, only ${allQquestions?.length} questions`)
      return
    } else {
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      const numQuestions = value;

      shuffleArray(allQquestions);

      // Get the first 6 questions
      const selectedQuestions = allQquestions.slice(0, numQuestions);

      // Display the selected questions
      // console.log(selectedQuestions, '------------------- final out put');

      if (Array.isArray(selectedQuestions)) {
        const selectedIds = selectedQuestions.map((question) => question._id);
        // console.log(selectedIds, "Id************************************")
        setQuestionValueId(selectedIds);
      } else {
        console.log("newValue is not an array");
      }
    }
    setQuizDataError((oldError) => {
      return { ...oldError, [name]: checkValidation(e) };
    });
    setQuizData((old) => {
      return { ...old, [name]: value };
    });
  }

  function handleInputData(e) {
    let { name, value } = e.target;
    setQuizDataError((oldError) => {
      return { ...oldError, [name]: checkValidation(e) };
    });
    setQuizData((old) => {
      return { ...old, [name]: value };
    });
  }

  function submitQuizData(event) {
    event.preventDefault();
    if (
      !Object.keys(quizDataError).find(
        (x) => quizDataError[x] && quizDataError[x] !== ""
      )
    ) {
      if (
        value === null ||
        levelValue === null ||
        duration === "" ||
        questionValueId.length === 0 ||
        weightage === null
      ) {
        toast.error("All fields must be filled out");
        // console.log("Some required fields are missing");
      } else {
        const finalData = {
          creator: profile?._id,
          course: courseId,
          ...quizData,
          level: levelValue,
          duration: duration,
          questions: questionValueId,
          weightage: weightage,
        };
        console.log(finalData, "finalDAta*******************************8");
        setLoader(true);
        dispatch(
          addQuizAction(finalData, (response) => {
            if (response.data.success) {
              router.push("/admin/quiz");
              toast.success(response.data.message);
            } else {
              toast.error(response.data.message);
              setLoader(false);
            }
            setLoader(false);
          })
        );
      }
    } else {
      toast.error("All fields must be filled out");
      console.log("Errors found in questionError, setErrorShow set to true");
    }
  }

  //filter on courses
  function getCourse() {
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
  }

  // function getQuestion(){
  //   setLoader(true);
  //   dispatch(
  //     listQuestionAction((response) => {
  //       if (response?.data?.success) {
  //         setAllQuestions(response?.data?.data?.questions);
  //       } else {
  //       }
  //       setLoader(false);
  //     })
  //   );
  // }

  // console.log(allQquestions);
  useEffect(() => {
    if (courseData.length === 0) {
      getCourse();
    }
    // getQuestion();
  }, [dispatch]);

  const filterDataOnSelect = useCallback((e, newValue) => {
    setValue(newValue);
    setCourseId(newValue?._id);
    // console.log(newValue, "*********************8")
    setLevelValue(null)
  }, []);


  //close course

  // console.log(courseId, 'ouyer')
  //filter level
  const filterByLevel = useCallback((newValue, courseId2) => {
    setLevelValue(newValue);

    // console.log(courseId2, 'inner')
    const payload = {
      id: courseId2,
      level: newValue
    }
    dispatch(
      questionByCourseAction(payload, (response) => {
        if (response?.data?.success) {
          // console.log("true")
          setAllQuestions(response?.data?.data?.questions);
        }
      })
    );
    if (newValue === "easy") {
      // setLevelValue(newValue);
      setDutration("10");
    } else if (newValue === "medium") {
      // setLevelValue(newValue);
      setDutration("7");
    } else if (newValue === "hard") {
      // setLevelValue(newValue);
      setDutration("5");
    } else {
      setLevelValue(null);
      setDutration(null);
    }

    if(quizData?.no_of_questions){
      if (parseInt(value) >= allQquestions.length) {
        toast.error(`${value} question not available, only ${allQquestions?.length} questions`)
        return
      } else {
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
        }
        const numQuestions =quizData.no_of_questions;
  
        shuffleArray(allQquestions);
  
        // Get the first 6 questions
        const selectedQuestions = allQquestions.slice(0, numQuestions);
  
        // Display the selected questions
        // console.log(selectedQuestions, '------------------- final out put');
  
        if (Array.isArray(selectedQuestions)) {
          const selectedIds = selectedQuestions.map((question) => question._id);
          // console.log(selectedIds, "Id************************************")
          setQuestionValueId(selectedIds);
        } else {
          console.log("newValue is not an array");
        }
      }
    }
  }, []);


  useEffect(()=>{
    console.log(quizData?.no_of_questions,"****");
    if(quizData?.no_of_questions){
      if (parseInt(value) >= allQquestions.length) {
        toast.error(`${value} question not available, only ${allQquestions?.length} questions`)
        return
      } else {
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
        }
        const numQuestions =quizData.no_of_questions;
  
        shuffleArray(allQquestions);
  
        // Get the first 6 questions
        const selectedQuestions = allQquestions.slice(0, numQuestions);
  
        // Display the selected questions
        // console.log(selectedQuestions, '------------------- final out put');
  
        if (Array.isArray(selectedQuestions)) {
          const selectedIds = selectedQuestions.map((question) => question._id);
          // console.log(selectedIds, "Id************************************")
          setQuestionValueId(selectedIds);
        } else {
          console.log("newValue is not an array");
        }
      }
    }
  },[allQquestions])


  // console.log(duration, levelValue);

  const filterDataOnQuestion = useCallback((event, newValue) => {
    // console.log(newValue)
    setQuestionValue(newValue);
    if (Array.isArray(newValue)) {
      const selectedIds = newValue.map((question) => question._id);
      setQuestionValueId(selectedIds);
    } else {
      console.log("newValue is not an array");
    }
  }, []);

  // console.log(questionValue);
  // console.log(questionValueId);

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
          <div className="w-full lg:w-3/4 my-6 rounded-lg">
            <form action="">
              <div className="flex justify-between flex-wrap">
                <div className="w-full md:w-3/4 order-2 md:order-2">
                  {/* course input start  */}
                  <div className="mt-4 md:mt-0 flex md:items-center flex-wrap md:flex-nowrap gap-y-1 w-full">
                    <h1 className="inline-block md:w-1/4 text-sm">
                      Courses<sup className="text-red-500 text-[16px]">*</sup>
                    </h1>
                    <div className="w-full md:w-3/4">
                      <Autocomplete
                        value={value}
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
                            label="Search by Courses"
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
                  {/* course input end */}

                  {/* // quiz level */}
                  <div className="mt-4 flex md:items-center flex-wrap md:flex-nowrap gap-y-1 w-full">
                    <h1 className="inline-block md:w-1/4 text-sm">
                      Quiz level
                      <sup className="text-red-500 text-[16px]">*</sup>
                    </h1>
                    {console.log(value,"********value******************************")}
                    <div className="w-full md:w-3/4">
                      <Autocomplete
                        disabled={value ? false : true} // Correct way to conditionally set the 'disabled' prop
                        value={levelValue}
                        onChange={(e, newValue) => filterByLevel(newValue, courseId)}
                        id="controllable-states-demo"
                        options={options}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Quiz Level"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& input": {
                                  color: "white",
                                  fontSize: "14px", // Use 'fontSize' instead of 'size' to change the text size
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
                                  fontSize: "14px", // Correct property for changing label size
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
                  <div className="mt-4 flex md:items-center flex-wrap md:flex-nowrap gap-y-1 w-full">
                    <label
                      htmlFor="quizTitle"
                      className="inline-block md:w-1/4 text-sm"
                    >
                      Quiz Title
                      <sup className="text-red-500 text-[16px]">*</sup>
                    </label>
                    <div className="w-full md:w-3/4">
                      <input
                        type="text"
                        id="quizTitle"
                        name="name"
                        onChange={handleInputData}
                        className="p-2 outline-none border-[1px] border-yellow-500 rounded-md w-full bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex md:items-center flex-wrap md:flex-nowrap gap-y-1 w-full">
                    <label
                      htmlFor="noOfQuestion"
                      className="inline-block md:w-1/4 text-sm"
                    >
                      No Of Question
                      <sup className="text-red-500 text-[16px]">*</sup>
                    </label>
                    <div className="w-full md:w-3/4">
                      <input
                        type="string"
                        id="noOfQuestion"
                        name="no_of_questions"
                        onChange={handleInputDataQuestion}
                        className="p-2 outline-none border-[1px] border-yellow-500 rounded-md w-full bg-transparent"
                      />
                    </div>
                  </div>


                  <div className="mt-4 flex md:items-center flex-wrap md:flex-nowrap gap-y-1 w-full">
                    <label
                      htmlFor="durations"
                      className="inline-block md:w-1/4 text-sm"
                    >
                      Duration<sup className="text-red-500 text-[16px]">*</sup>
                    </label>
                    <div className="w-full md:w-3/4">
                      <input
                        type="text"
                        id="durations"
                        name="duration"
                        value={duration}
                        className="p-2 outline-none border border-yellow-500 rounded-md w-full bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex md:items-center flex-wrap md:flex-nowrap gap-y-1 w-full">
                    <label
                      htmlFor="marks"
                      className="inline-block md:w-1/4 text-sm"
                    >
                      Weightage<sup className="text-red-500 text-[16px]">*</sup>
                    </label>
                    <div className="w-full md:w-3/4">
                      <input
                        type="text"
                        id="weightage"
                        name="weightage"
                        value={weightage}
                        onChange={(e) => setWeightage(e.target.value)}
                        className="p-2 outline-none border border-yellow-500 rounded-md w-full bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="mt-4 flex md:items-center flex-wrap md:flex-nowrap gap-y-1 w-full md:w-3/4">
                <label htmlFor="" className="inline-block md:w-1/4 text-sm">
                  Select Question
                  <sup className="text-red-500 text-[16px]">*</sup>
                </label>

                <div className="w-full md:w-3/4">
                  <Autocomplete
                    multiple
                    onChange={filterDataOnQuestion}
                    id="controllable-states-demo"
                    value={questionValue}
                    defaultValue={questionValue}
                    options={allQquestions}
                    getOptionLabel={(option) => option.question}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Typography sx={{ color: "black" }}>
                          {option.question}
                        </Typography>
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Question..."
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
                          label={option.question}
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
              </div> */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={submitQuizData}
                  className=" w-full md:w-1/4 py-2 rounded-md border-[1px] border-yellow-500 text-yellow-500bg-yellow-500 duration-300 text-white text-center font-bold bg-yellow-500 hover:bg-inherit hover:text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default AddQuizPage;
