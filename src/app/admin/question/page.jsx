"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { deleteQuestionAction, listQuestionAction } from "@/app/redux/actions";
import PuffLoader from "react-spinners/PuffLoader";
import Layout from "../components/Layout";

function QuestionPage() {
  const columns = [
    { id: "index", label: "Id", minWidth: 50 },
    {
      id: "level",
      label: "Level",
      minWidth: 100,
      align: "start",
      format: (value) => value.toLocaleString(),
    },
    {
      id: "question",
      label: "Question Name",
      minWidth: 400,
      align: "start",
      format: (value) => value.toLocaleString(),
    },
    {
      id: "action",
      label: "Action",
      minWidth: 100,
      align: "start",
      format: (value) => value,
    },
  ];

  const [page, setPage] = useState(0); // start with 0-based indexing
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const {questions}=useSelector((state)=>state.questionData) || [];
  const [questionsData, setQuestionsData] = useState(questions);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // reset to the first page
  };

  const getData = () => {
    const formData = { page: page + 1, length: rowsPerPage }; // API might expect 1-based page
    setLoader(true);
    dispatch(
      listQuestionAction(formData, (response) => {
        setLoader(false);
        if (response?.data?.success) {
          setQuestionsData(response?.data?.data?.questions);
          setTotalQuestion(response?.data?.data?.totalQuestions);
        } else {
          console.error("Failed to fetch data:", response);
        }
      })
    );
  };

  const deleteQuestion = (id) => {
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
          deleteQuestionAction(id, (response) => {
            setLoader(false);
            if (response?.data?.success) {
              getData();
              Swal.fire({
                title: "Deleted!",
                text: "Your question has been deleted.",
                icon: "success",
              });
            } else {
              console.error("Failed to delete question:", response);
            }
          })
        );
      }
    });
  };

  useEffect(() => {
    getData();
  }, [page, rowsPerPage]);

  const rows = questionsData.map((q, index) => ({
    ...q,
    index: index + 1,
  }));

  function ChangeQuestionOnSearch(e) {
    const searchQuery = e.target.value.toLowerCase();
    const filteredQuestions = questions.filter((question) => {
      const questionName = question.question?.toLowerCase() || "";
      const level = question.level?.toLowerCase() || "";
      const courseName = Array.isArray(question.course)
        ? question.course[0]?.name?.toLowerCase() || ""
        : "";
  
      return (
        questionName.includes(searchQuery) ||
        level.includes(searchQuery) ||
        courseName.includes(searchQuery)
      );
    });
  
    setQuestionsData(filteredQuestions);
    setPage(0); // Reset to the first page after filtering
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
        <div className="w-full px-4 lg:px-14 pt-24">
          <div className="w-full justify-between flex flex-wrap md:flex-nowrap gap-y-4">
            <div className="w-full md:w-1/2 gap-1">
              <input
                type="text"
                onChange={ChangeQuestionOnSearch}
                className="w-4/5 rounded-md bg-transparent border border-yellow-300 py-2 md:py-3 px-2 outline-none"
                placeholder="Search question..."
              />
              {/* <button className="text-center py-2 ml-1 md:py-3 px-3 md:px-4 text-white rounded-md border border-blue-500 bg-blue-500 hover:bg-blue-700  duration-300">
                Search
              </button> */}
            </div>
            <Link
              href="/admin/question/add_question"
              className="w-full md:w-1/4 text-center text-white font-bold py-2 md:py-3 rounded-md border border-yellow-500 bg-yellow-500 hover:bg-transparent duration-300 mb-5"
            >
              Add Question
            </Link>
          </div>

          {questionsData.length ? (
            <>
              <div className="w-full my-4">
                <h1 className="text-xl md:text-2xl text-center font-bold  mb-4 underline text-yellow-500">
                  All Question
                </h1>

                <Paper
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    backgroundColor: "transparent",
                    color: "white",
                  }}
                >
                  <TableContainer
                    sx={{
                      maxHeight: 700,
                      border: "1px solid rgb(255,255,255,0.2)",
                    }}
                  >
                    <Table aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                minWidth: column.minWidth,
                                fontWeight: "bolder",
                                fontSize: "15px",
                                color: "white",
                                backgroundColor: "transparent",
                                borderBottom: "1px solid rgb(255,255,255,0.2)",
                              }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.index}
                            sx={{ color: "white" }}
                          >
                            {columns.map((column) => {
                              let value = row[column.id];
                              if (
                                column.id === "course" &&
                                value &&
                                typeof value === "object"
                              ) {
                                value = value[0]?.name; // replace 'name' with the correct property of the course object
                              }
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{
                                    backgroundColor: "transparent",
                                    color: "white",
                                    borderBottom:
                                      "1px solid rgb(255,255,255,0.2)",
                                  }}
                                >
                                  {column.id === "action" ? (
                                    <div className="flex justify-evenly items-center gap-2">
                                      <Link
                                        href={`/admin/question/view_question/${row._id}`}
                                        className="py-[2px] px-3 rounded-md border-[1px] border-blue-500 text-blue-500 hover:bg-blue-500 duration-300 hover:text-white hover:border-white font-bold"
                                      >
                                        <VisibilityIcon className="text-[14px]" />
                                      </Link>
                                      <Link
                                        href={`/admin/question/edit_question/${row._id}`}
                                        className="py-[2px] px-3 rounded-md border-[1px] border-green-500 text-green-500 hover:bg-green-500 duration-300 hover:text-white hover:border-white font-bold"
                                      >
                                        <BorderColorIcon className="text-[14px]" />
                                      </Link>
                                      <button
                                        onClick={() => deleteQuestion(row._id)}
                                        className="py-[2px] px-3 rounded-md border-[1px] border-red-500 text-red-500 hover:bg-red-500 duration-300 hover:text-white hover:border-white font-bold"
                                      >
                                        <DeleteIcon className="text-[14px]" />
                                      </button>
                                    </div>
                                  ) : (
                                    value
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 20, 30, 50, 100,200]}
                    component="div"
                    count={totalQuestion}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                    }}
                    ic
                  />
                </Paper>
              </div>
            </>
          ) : (
            <div className="text-red-500">Question not found</div>
          )}
        </div>
      </Layout>
    </>
  );
}

export default QuestionPage;
