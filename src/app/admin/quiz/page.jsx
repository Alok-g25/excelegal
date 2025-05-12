"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { approvalQuizAction, deleteQuizAction, getProfileAction, listQuizAction } from "@/app/redux/actions";
import PuffLoader from "react-spinners/PuffLoader";
import TablePagination from "@mui/material/TablePagination";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { Backdrop,} from "@mui/material";
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';

function QuizPage() {
  const [loader, setLoader] = useState(false);
  const [QuizData, setQuizData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const { profile } = useSelector((state) => state.admindata) || {}; // Default to an empty object

  useEffect(() => {
    if (profile === null) {
      dispatch(getProfileAction());
    }
  }, [dispatch]);


  function getAllQuiz(page = 0, length = 5) {
    setLoader(true);
    dispatch(
      listQuizAction({ page: page + 1, length }, (response) => {
        if (response?.data?.success) {
          setQuizData(response?.data?.data?.Quizzes || []);
          setTotalItems(response?.data?.data?.totalQuizzes || 0); // Assuming the API returns total count
        }
        setLoader(false);
      })
    );
  }

  useEffect(() => {
    getAllQuiz(page, rowsPerPage);
  }, [page, rowsPerPage]);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  }

  function deleteQuiz(id) {
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
          deleteQuizAction(id, (response) => {
            if (response?.data?.success) {
              setQuizData((prevData) =>
                prevData.filter((quiz) => quiz._id !== id)
              );
              Swal.fire({
                title: "Deleted!",
                text: "Your Quiz has been deleted.",
                icon: "success",
              });
            }
            setLoader(false);
          })
        );
      }
    });
  }


  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  function getApproval(status, quizId) {
    // console.log(status, quizId)
    const payload = {
      id: quizId,
      approval_status: status
    }
    setLoader(true);
    dispatch(approvalQuizAction(payload, (res) => {
      if (res?.data?.success) {
        // console.log(res);
        getAllQuiz()
      }
      setLoader(false);
      toast.error(res?.data?.message)
    }))
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
          <div className="w-full justify-between flex flex-wrap md:flex-nowrap gap-y-4 ">
            {/* <div className="w-full md:w-1/2 flex gap-4">
              <input
                type="text"
                className="w-4/5 rounded-md bg-transparent border border-yellow-500 px-4"
                placeholder="Search quiz..."
              />
              <button className="md:w-1/5 text-center text-white p-2 rounded-md border border-blue-500 bg-blue-500 hover:bg-transparent duration-300">
                Search
              </button>
            </div> */}
            <Link
              href="/admin/quiz/add_quiz"
              className="w-full md:w-1/4 text-center text-white font-bold py-2 md:py-3 rounded-md border border-yellow-500 bg-yellow-500 hover:bg-transparent duration-300"
            >
              Add Quiz
            </Link>
          </div>

          {QuizData && QuizData.length !== 0 ? (
            <>
              <h1 className="text-xl md:text-2xl text-center font-bold underline text-yellow-500">
                All Quiz
              </h1>
              <div className="w-full flex justify-center md:justify-around lg:justify-stretch flex-wrap gap-7 my-6">
                {QuizData.map((item, i) => (
                  <div
                    key={i}
                    className="card w-80 bg-base-100 md:w-72 border-[1px] border-slate-800 duration-300"
                  >
                    <div className="py-2 px-4 ">

                      <h2 className="text-md text-slate-400 capitalize">
                        {item.name} <span className="text-[14px] text-yellow-700">({item?.creator?.name})</span>
                      </h2>
                      <h2 className="text-[12px] text-slate-500 mt-1">
                        <b className="text-slate-500">Course - </b>
                        {item?.course?.name}
                      </h2>
                      <h2 className="text-[12px] text-slate-500 mt-1">
                        <b className="text-slate-500">Total Question - </b>
                        {item.no_of_questions}
                      </h2>
                      <h2 className="text-[12px] text-slate-500 mt-1">
                        <b className="text-slate-500">Duration - </b>
                        {item.duration} min ({item.level})
                      </h2>

                      <div className="mt-4 flex justify-start md:justify-normal gap-4 flex-wrap">
                        <Link
                          href={`/admin/quiz/edit_quiz/${item?._id}`}
                          type="submit"
                          className="px-2 py-1 rounded-md border-[1px] border-green-500 text-green-500 hover:bg-green-500 duration-300 hover:text-white hover:border-white"
                        >
                          <BorderColorIcon className="text-[16px]" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteQuiz(item?._id)}
                          className="px-2 rounded-md border-[1px] border-red-500 text-red-500 hover:bg-red-500 duration-300 hover:text-white hover:border-white"
                        >
                          <DeleteIcon className="text-[16px]" />
                        </button>

                        {(item?.approval_status === "PENDING") && (
                          profile?.role === "STAFF" ? (
                            // Only show text if role is STAFF
                            <p className="px-2 flex justify-center cursor-wait items-center rounded-md border text-[13px] border-gray-500 text-gray-500">
                              <PendingIcon className="mr-2 text-[14px]" /> {item?.approval_status}
                            </p>
                          ) : profile?.role === "ADMIN" ? (
                            // Show button if role is ADMIN
                            <>
                              <button
                                onClick={handleOpen}
                                className="px-2 rounded-md border text-[13px] border-gray-500 text-gray-500 hover:bg-gray-500 duration-300 hover:text-white hover:border-white"
                              >
                                {item?.approval_status}
                              </button>
                              <Backdrop
                                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                                open={open}
                                onClick={handleClose}
                              >
                                <div className="bg-white rounded-2xl p-6 w-96 text-black">
                                  <h3 className="text-black text-[14px]">
                                    Are you sure you want to grant permission as 'APPROVED' or 'REJECT'?
                                  </h3>
                                  <div className="mt-6 flex justify-end items-center gap-4">
                                    <button
                                      onClick={() => getApproval("APPROVED", item?._id)}
                                      className="px-2 py-1 text-[13px] rounded-md border border-green-500 text-white bg-green-500 duration-300 hover:text-white hover:border-white"
                                    >
                                      <VerifiedIcon className="mr-2" /> APPROVED
                                    </button>
                                    <button
                                      onClick={() => getApproval("REJECTED", item?._id)}
                                      className="px-2 py-1 text-[13px] rounded-md border border-red-500 text-white bg-red-500 duration-300 hover:text-white hover:border-white"
                                    >
                                      <UnpublishedIcon className="mr-2" /> REJECTED
                                    </button>
                                  </div>
                                </div>
                              </Backdrop>
                            </>
                          ) : null
                        )}

                        {/* For other statuses like REJECTED */}
                        {item?.approval_status === "REJECTED" && (
                          <p className="text-center cursor-not-allowed px-2 rounded-md text-[10px] text-white duration-300 flex justify-center items-center ml-4 bg-red-600">
                            <UnpublishedIcon className="mr-2 text-[14px]" /> {item?.approval_status}
                          </p>
                        )}


                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <TablePagination
                rowsPerPageOptions={[8, 16, 32, 64, 128, 256]}
                component="div"
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                style={{ backgroundColor: "transparent", color: "white", marginBottom: "10px" }}
              />
            </>
          ) : (
            <p className="md:h-32 h-0 w-full mb-6"></p>
          )}
        </div>
      </Layout>
    </>
  );
}

export default QuizPage;


