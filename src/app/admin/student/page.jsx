"use client";

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
import { listStudentAction } from "@/app/redux/actions";
import PuffLoader from "react-spinners/PuffLoader";
import Layout from "../components/Layout";

function StudentPage() {
  const columns = [
    { id: "index", label: "Index", minWidth: 50 }, // Changed to 'index'
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
  ];

  const [page, setPage] = useState(0); // start with 0-based indexing
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const { questions } = useSelector((state) => state.questionData) || [];
  const [studentsData, setStudentsData] = useState(questions);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // reset to the first page
  };

  const getData = () => {
    const formData = { page: page + 1, length: rowsPerPage }; // API might expect 1-based page
    setLoader(true); // Show loader before starting the fetch

    dispatch(
      listStudentAction(formData, (response) => {
        if (response?.data?.success) {
          setStudentsData(response?.data?.data?.studentList);
          setTotalStudents(response?.data?.data?.totalStudentList);
        } else {
          console.error("Failed to fetch data:", response);
        }
        setLoader(false); // Hide loader after the response (success or failure)
      })
    );
  };

  useEffect(() => {
    getData();
  }, [page, rowsPerPage]);

  // Add index ID in the format 'EXCELEGALStudent01'
  const rows = studentsData?.map((q, index) => ({
    ...q,
    index: `EXCStu02${(index + 1).toString().padStart(2, "0")}`, // Adding the EXCELEGALStudent prefix and zero-padding
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
          {studentsData?.length ? (
            <>
              <div className="w-full my-4">
                <h1 className="text-xl md:text-2xl text-center font-bold  mb-4 underline text-yellow-500">
                  Student Details
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
                                  {value}
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
                    count={totalStudents}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                    }}
                  />
                </Paper>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center mt-5">
              <p className="text-lg text-red-700 mb-4">No Student Has Registered Yet</p>
              <p className="text-sm text-gray-400 mb-2">Currently, there are no student registrations available.</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export default StudentPage;
