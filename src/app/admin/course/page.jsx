"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch } from "react-redux";
import { listCourseAction } from "@/app/redux/actions";
import PuffLoader from "react-spinners/PuffLoader";
import { Box, TablePagination, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/Layout";

function CoursesPage() {
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [courses, setCourses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCourse = (page = 0, length = 5) => {
    setLoader(true);
    dispatch(
      listCourseAction({ page: page + 1, length }, (response) => {
        if (response?.data?.success) {
          setCourses(response?.data?.data?.courses || []);
          setTotalItems(response?.data?.data?.totalCourses || 0);
        } else {
          console.error("Failed to fetch courses:", response?.data?.message);
        }
        setLoader(false);
      })
    );
  };

  useEffect(() => {
    getCourse(page, rowsPerPage);
  }, [page, rowsPerPage]);

  useEffect(() => {
    const data = courses.map((item) => item.name);
    setCourseData(data);
    setFilteredData(courses);
  }, [courses]);

  const filterDataOnSelect = useCallback(
    (e, value) => {
      const result = courses.filter((item) => item.name.includes(value));
      setFilteredData(result);
    },
    [courses]
  );

  const onInputChange = (e, value) => {
    debounce(value, 1000);
  };

  let timer;
  const debounce = (value, delimiter = 500) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      console.log("Debounced value:", value);
    }, delimiter);
  };

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
          <div className="w-full mb-6 flex flex-wrap md:flex-nowrap md:justify-between gap-y-3">
            <div className="w-full">
              <h1 className="text-2xl uppercase font-bold underline mb-3">
                Courses
              </h1>
              <form>
                <Autocomplete
                  onChange={filterDataOnSelect}
                  onInputChange={onInputChange}
                  id="controllable-states-demo"
                  options={courseData}
                  getOptionLabel={(option) => option}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Typography>{option}</Typography>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search by Courses..."
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
              </form>
            </div>
            <div className="w-full flex justify-end items-end">
              <Link
                href="/admin/course/addCourse"
                className="w-full md:w-1/2 text-center py-2 md:py-4 rounded-md border text-white font-bold border-yellow-500 bg-yellow-500 hover:bg-transparent duration-300"
              >
                Add Course
              </Link>
            </div>
          </div>
          <div className="w-full flex justify-center md:justify-stretch flex-wrap gap-7 mb-5">
            {filteredData.map((item, i) => {
              const createdAtYear = new Date(
                item.created_at
              ).toLocaleDateString();
              return (
                <Link
                  href={`/admin/course/edit_course/${item?._id}`}
                  key={item.id || i}
                  className="card bg-base-100 w-72 border-[1px] border-slate-800 duration-300"
                >
                  <figure>
                    <img className="w-full h-44" src={item.image} alt="image" />
                  </figure>
                  <div className="p-4">
                    <h2 className="text-[12px]">
                      Category:{" "}
                      <span className="text-[14px] text-white">
                        {item?.category?.name}
                      </span>
                    </h2>
                    <h2 className="text-[12px]">
                      Course Name:{" "}
                      <span className="text-[14px] text-white">
                        {item.name}
                      </span>
                    </h2>
                    <h2 className="text-[12px] text-gray-400 mt-2">
                      {item.description.slice(0, 150)}...
                    </h2>
                    <p className="text-[12px] mt-2">{createdAtYear}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <TablePagination
            rowsPerPageOptions={[8,16,32,64,128,256]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ backgroundColor: "transparent", color: "white" }}
          />
        </div>
      </Layout>
    </>
  );
}

export default CoursesPage;
