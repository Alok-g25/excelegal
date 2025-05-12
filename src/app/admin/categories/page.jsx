"use client";

import React, { useEffect, useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import Swal from "sweetalert2";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategoryAction, listCatgoryAction } from "@/app/redux/actions";
import PuffLoader from "react-spinners/PuffLoader";
import Layout from "../components/Layout"


function CategoriesPage() {
  const columns = [
    { id: "index", label: "Index", minWidth: 50 },
    {
      id: "image",
      label: "Category Image",
      minWidth: 100,
      align: "start",
      format: (value) => value.toLocaleString(),
    },
    {
      id: "name",
      label: "Category",
      minWidth: 170,
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const {category}  = useSelector((state) => state.categoryData) || []; // Default to an empty object
  const [totalCategories, setTotalCategories] = useState(0);
  let [loader, setLoader] = useState(false);
  // console.log(category,"-----------------------data");
  const [categories, setCategories] = useState(category);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // reset to the first page
  };

  
  function getAllCategory() {
    const formData = { page: page + 1, length: rowsPerPage }; // API might expect 1-based page
    setLoader(true)
    dispatch(
      listCatgoryAction(formData, (response) => {
        if (response?.data?.success){
          setTotalCategories(response?.data?.data?.totalCategories);
          setCategories(response?.data?.data?.categories);
        } else {
          console.error("Unexpected API response format");
        }
        setLoader(false)
      })
    );
  }

  function deleteCategory(id) {
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
        setLoader(true)
        dispatch(
          deleteCategoryAction(id, (response) => {
            if(response?.data?.success){
            Swal.fire({
              title: "Deleted!",
              text: "Your category has been deleted.",
              icon: "success",
            }).then(() => {
              getAllCategory();
            });
          }
          else{  
          }
          setLoader(false)
          })
        );
      }
    });
  }

  useEffect(() => {
    getAllCategory();
  }, [dispatch, page, rowsPerPage]);

 if (loader) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader color="#D69E2E" size={50} />
      </div>
    );
  }
  const rows = categories;

  return (
    <>
    <Layout>
      <div className="w-full px-4 lg:px-14 pt-24">
        <div className="w-full mb-5">
          <Link
            href="/admin/categories/add_categories"
            className="text-center px-10 py-2 text-[14px] text-white rounded-md border border-yellow-500 bg-yellow-500 hover:bg-transparent duration-300"
          >
            Add Category
          </Link>
        </div>
        <div className="w-full md:w-2/3 pb-10">
          {categories?.length ? (
            <>
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
                      {rows.map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row._id}
                            sx={{ color: "white" }}
                          >
                            {columns.map((column) => {
                              const value =
                                column.id === "index"
                                  ? page * rowsPerPage + index + 1
                                  : row[column.id];
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
                                  {column.id === "image" ? (
                                    <img
                                      src={value}
                                      alt="Category"
                                      className="w-14 rounded-full h-14 bg-center bg-contain inline-block "
                                    />
                                  ) : column.id === "action" ? (
                                    <div className="flex gap-6 items-center">
                                      <Link
                                        href={`/admin/categories/edit_categories/${row._id}`} // dynamically set href
                                        className="border px-3 py-1 hover:bg-slate-900 hover:text-green-700 border-green-500 rounded-full text-green-500 hover:border-white duration-300"
                                      >
                                        <BorderColorIcon className="text-[18px]" />
                                      </Link>
                                      <button
                                        onClick={() => deleteCategory(row._id)}
                                        className="border px-3 py-1 hover:bg-slate-900 hover:text-red-700 border-red-500 rounded-full text-red-500 hover:border-white duration-300"
                                      >
                                        <DeleteIcon className="text-[18px]" />
                                      </button>
                                    </div>
                                  ) : (
                                    value
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 7, 10, 15, 20]}
                  component="div"
                  count={totalCategories}
                  rowsPerPage={rowsPerPage}
                  page={page} // use 0-based index
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  style={{
                    backgroundColor: "transparent",
                    color: "white",
                  }}
                />
              </Paper>
            </>
          ) : (
            <div className="md:h-24 w-full"></div>
          )}
        </div>
      </div>
      </Layout>
    </>
  );
}

export default CategoriesPage;
