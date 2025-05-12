"use client";

import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Swal from "sweetalert2";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  deleteQuestionAction,
  getSingleQuestionAction,
} from "@/app/redux/actions";
import PuffLoader from "react-spinners/PuffLoader";
import Layout from "../../../components/Layout";

function ViewQuestionPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [question, setQuestion] = useState({});
  const router = useRouter();

  function deleteQuestion() {
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
        dispatch(
          deleteQuestionAction(id, (resposne) => {
            if (resposne?.data?.success) {
              router.push("/admin/question");
            }
          })
        );
        Swal.fire({
          title: "Deleted!",
          text: "Your question has been deleted.",
          icon: "success",
        });
      }
    });
  }

  useEffect(() => {
    setLoader(true);
    dispatch(
      getSingleQuestionAction(id, (response) => {
        // console.log(response,"------question resposen");
        if (response?.data?.success) {
          setQuestion(response?.data?.data);
        } else {
          setLoader(false);
        }
        setLoader(false);
      })
    );
  }, [id]);


  console.log(question, "************************")
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
        <div className="w-full px-4 lg:px-14 pt-28 mb-5">
          <div className="flex justify-center items-center h-full">
            <div className="w-full md:w-2/3 boxTransparent rounded-xl p-6">
              <p className="text-md text-yellow-400">Question id : <b className="text-white">{id}</b></p>
              <p className="text-md text-yellow-400">Level : <b className="text-white">{question.level}</b></p>
              <div className="text-md text-yellow-400">Courses :[{
                question?.course?.map((item, index) =>
                  <span className="text-white text-md">{item.name}, </span>
                )
              }]</div>
              <div className="mt-3">
                <p className="text-md text-yellow-400">Question Name : <b className="text-white text-justify inline-block text-sm">{question?.question}</b></p>
                <div className="mt-2 text-yellow-400">
                  a:
                  <span className="text-sm text-white ml-2 ">{question?.a}</span>
                </div>
                <div className="mt-2 text-yellow-400">
                  b:
                  <span className="text-sm text-white ml-2 ">{question?.b}</span>
                </div>
                <div className="mt-2 text-yellow-400">
                  c:
                  <span className="text-sm text-white ml-2 ">{question?.c}</span>
                </div>
                <div className="mt-2 text-yellow-400">
                  d:
                  <span className="text-sm text-white ml-2 ">{question?.d}</span>
                </div>
                <div className="mt-2 text-yellow-400">
                  ansewer:
                  <span className="text-sm text-white ml-2 ">{question?.answer}</span>
                </div>

              </div>
              <div className="flex gap-3 mt-4 ">
                <Link
                  href={`/admin/question/edit_question/${id}`}
                  className="border px-4 py-1 border-green-500 rounded-md text-green-500 hover:text-white hover:border-white duration-300"
                >
                  <BorderColorIcon className="text-[18px]" />
                </Link>

                <button
                  onClick={deleteQuestion}
                  className="border px-4 py-1 border-red-500 rounded-md text-red-500 hover:text-white hover:border-white duration-300"
                >
                  <DeleteIcon className="text-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default ViewQuestionPage;
