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
import { useDispatch, useSelector } from "react-redux";
import { listEnquiryDetailsAction } from "@/app/redux/actions";
import PuffLoader from "react-spinners/PuffLoader";
import Layout from "../components/Layout";
import { Button, styled } from "@mui/material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

function QuestionPage() {
  const columns = [
    { id: "index", label: "Sr.no", minWidth: 50 }, // Changed to 'index'
    {
      id: "name",
      label: "Name",
      minWidth: 100,
      align: "start",
      format: (value) => value.toLocaleString(),
    },
    {
      id: "email",
      label: "Email",
      minWidth: 100,
      align: "start",
      format: (value) => value.toLocaleString(),
    },
    {
      id: "phone",
      label: "Phone",
      minWidth: 100,
      align: "start",
      format: (value) => value.toLocaleString(),
    },
    {
      id: "resume",
      label: "Resume/CV",
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
  const { questions } = useSelector((state) => state.questionData) || [];
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
      listEnquiryDetailsAction(formData, (response) => {
        setLoader(false);
        if (response?.data?.success) {
          // console.log(response?.data?.data,"*******")
          setQuestionsData(response?.data?.data?.enquiryDetailsList);
          setTotalQuestion(response?.data?.data?.totalEnquiryList);
        } else {
          console.error("Failed to fetch data:", response);
        }
      })
    );
  };

  useEffect(() => {
    getData();
  }, [page, rowsPerPage]);

  const rows = questionsData.map((q, index) => ({
    ...q,
    index: index + 1,
  }));


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
          {questionsData.length ? (
            <>
              <div className="w-full my-4">
                <h1 className="text-xl md:text-2xl text-center font-bold  mb-4 underline text-yellow-500">
                  Enquiry Details
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
                                  {column.id === "resume" ? (
                                    <>
                                      <div className='flex items-center  gap-5'>
                                        <Button
                                          component="label"
                                          role={undefined}
                                          variant="contained"
                                          tabIndex={-1}
                                          startIcon={<CloudDownloadIcon />}
                                          style={{ backgroundColor: "#EAB308", fontWeight: "500" }}
                                          onClick={() => {
                                            if (value) {
                                              const link = document.createElement('a');
                                              link.href = value; // Ensure this path is correct
                                              link.download = 'resume.pdf'; // The name for the downloaded file
                                              link.click();
                                            } else {
                                              console.error("Resume file URL is missing or invalid");
                                            }
                                          }}
                                        >
                                          Download Resume
                                        </Button>

                                      </div>
                                    </>
                                  ) : (<>
                                    {value}
                                  </>
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
                    rowsPerPageOptions={[5, 10, 20, 30, 50, 100, 200]}
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
            <div class="flex flex-col items-center justify-center mt-5">
              <p class="text-lg text-red-700 mb-2">Enquiry Details Not Available</p>
              <p class="text-sm text-gray-400">No enquiries have been made yet.</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export default QuestionPage;
