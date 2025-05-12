"use client";

import { useCallback, useEffect, useState } from "react";
import { Autocomplete, TextField, Box, Typography, Chip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  getSingleQuizAction,
  listCourseAction,
  questionByCourseAction,
  updateQuizAction,
} from "@/app/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import PuffLoader from "react-spinners/PuffLoader";
import { checkValidation } from "../../../components/validation/checkValidation";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../../components/Layout";

function AddQuizPage() {
  const [courseId, setCourseId] = useState(null);
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();
  const options = ["easy", "medium", "hard"];
  const [loader, setLoader] = useState(false);
  const [levelValue, setLevelValue] = useState(null);
  const [duration, setDutration] = useState("");
  const [allQquestions, setAllQuestions] = useState([]);
  const [questionValue, setQuestionValue] = useState([]);
  const [questionValueId, setQuestionValueId] = useState([]);
  const [marks, setMarks] = useState(10);
  const { id } = useParams();
  const { courses } = useSelector((state) => state.courseData) || [];
  const [courseData, setCourseData] = useState(courses);
  const router = useRouter()

  const [quizData, setQuizData] = useState({
    name: "",
    no_of_questions: "",
  });
  const [quizDataError, setQuizDataError] = useState({
    name: "",
    no_of_questions: "",
  });

  function handleInputDataQuestion(e) {
    let { name, value } = e.target;
    // console.log(typeof parseInt(value))
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

    // Log the courseId to verify its value before proceeding

    // Check if there are any errors in quizDataError
    if (
      !Object.keys(quizDataError).find(
        (x) => quizDataError[x] && quizDataError[x] !== ""
      )
    ) {
      // Check if all required fields are filled
      if (
        value === null ||
        levelValue === null ||
        duration === "" ||
        // questionValueId.length === 0 ||
        marks === null
      ) {
        toast.error("All fields must be filled out");
        // console.log("Some required fields are missing");
      } else {
        // Log the courseId to ensure it is available
        // console.log(courseId, "courseId after validation");

        // Create the final data object
        const finalData = {
          // course: courseId, // Ensure courseId is assigned correctly
          ...quizData,
          level: levelValue,
          duration: duration,
          questions: questionValueId,
        };

        setLoader(true);
        dispatch(
          updateQuizAction(finalData, (response) => {
            console.log(response);
            if (response.data.success) {
              toast.success(response.data.message);
              router.push("/admin/quiz");
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
      console.log("Errors found in quizDataError");
    }
  }

  // get Quiz
  function getQuiz() {
    setLoader(true);
    dispatch(
      getSingleQuizAction(id, (response) => {
        if (response?.data?.success) {
          setQuizData(response?.data?.data);
          setValue(response?.data?.data?.course);
          setCourseId(response?.data?.data?.course?._id);
          setQuestionValue(response?.data?.data?.questions);
          setLevelValue(response?.data?.data?.level);
          setDutration(response?.data?.data?.duration);
        } else {
        }
        setLoader(false);
      })
    );
  }

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


  // console.log(levelValue,"*******************newnewValue")
  function getQuestion() {
    const payload = {
      id: courseId,
      level: levelValue
    }
    // console.log(payload,"**************");
    setLoader(true);
    dispatch(
      questionByCourseAction(payload, (response) => {
        if (response?.data?.success) {
          // console.log("true")

          setAllQuestions(response?.data?.data?.questions);
        } else {
          setLoader(false);
        }
      })
    );
    setLoader(false);
  }

  // console.log(courseId, levelValue)
  useEffect(() => {
    getQuiz();
    if (courseData.length === 0) {
      getCourse();
    }
  }, []);

  useEffect(() => {
    getQuestion();
  }, [courseId]);

  // console.log(allQquestions,"**********************************")

  useEffect(() => {
    if (questionValue.length) {
      const _id = questionValue.map((item) => {
        // console.log(item._id)
        return item._id;
      });
      setQuestionValueId([..._id]);
    }
  }, [questionValue]);

  const filterDataOnSelect = useCallback((e, newValue) => {
    // Ensure newValue is not null before accessing its properties
    if (newValue) {
      setValue(newValue);
      setCourseId(newValue?._id);
      setLevelValue(null)
    } else {
      setValue(null)
      setCourseId(null)
    }
  }, []);

  //close course

  //filter level
  const filterByLevel = useCallback((newValue, courseId2) => {
    setQuizData((prev) => { return { ...prev, no_of_questions: "" } })
    setLevelValue(newValue);
    const payload = {
      id: courseId2,
      level: newValue
    }
    console.log(payload, 'inner')
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
  }, []);


  useEffect(() => {
    // console.log(quizData?.no_of_questions,"****");
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
      const numQuestions = quizData?.no_of_questions;

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
  }, [quizData?.no_of_questions])

  // const filterDataOnQuestion = useCallback((event, newValue) => {
  //   setQuestionValue(newValue);
  //   if (Array.isArray(newValue)) {
  //     const selectedIds = newValue.map((question) => question._id);
  //     setQuestionValueId(selectedIds);
  //   } else {
  //     console.log("newValue is not an array");
  //   }
  // }, []);

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
                        disabled
                        onChange={filterDataOnSelect}
                        id="controllable-states-demo"
                        options={courseData} // Assuming category is an array of objects with 'name' property
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{
                              backgroundColor: "#1e1e1e", // Background color for the dropdown options
                              "&:hover": {
                                backgroundColor: "#333", // Hover background color for options
                              },
                            }}
                          >
                            <Typography>{option.name}</Typography>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            // label="Search by Courses"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#DFDFDF", // Background color for input
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
                  {/* course input end */}
                  {/* // quiz level */}
                  <div className="mt-4 flex md:items-center flex-wrap md:flex-nowrap gap-y-1 w-full">
                    <h1 className="inline-block md:w-1/4 text-sm">
                      Quiz level
                      <sup className="text-red-500 text-[16px]">*</sup>
                    </h1>
                    <div className="w-full md:w-3/4">
                      <Autocomplete
                        disabled={value ? false : true} // Correct way to conditionally set the 'disabled' prop
                        value={levelValue}
                        onChange={(e, newValue) => filterByLevel(newValue, courseId)} id="controllable-states-demo"
                        options={options}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Quiz Level..."
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
                        value={quizData.name}
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
                        value={quizData?.no_of_questions}
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
                        id="marks"
                        name="duration"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        className="p-2 outline-none border border-yellow-500 rounded-md w-full bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
