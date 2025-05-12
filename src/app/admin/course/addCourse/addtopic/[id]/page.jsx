"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css"; // Import the default Quill styles
import "../customQuillToolbar.css"; // Import your custom toolbar styles
import { useParams, useRouter } from "next/navigation";
import { checkValidation } from "../../../../components/validation/checkValidation";
import { useDispatch } from "react-redux";
import { addTopicAction } from "@/app/redux/actions";
import { toast } from "react-toastify";
import Layout from "../../../../components/Layout";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function AddTopicCourse() {
  const [descriptionValue, setDescriptionValue] = useState("");
  const { id } = useParams();
  // console.log(id);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [name, setName] = useState("");
  const [errorShow, setErrorShow] = useState(false);
  const dispatch = useDispatch();

  const [topicError, setTopicError] = useState({
    name: "this field is Required",
  });

  function handleInputData(e) {
    let { name, value } = e.target;
    setErrorShow(false);
    setTopicError((oldError) => {
      return { ...oldError, [name]: checkValidation(e) };
    });
    setName(value);
  }

  function submitData(event) {
    event.preventDefault();
    if (
      !Object.keys(topicError).find(
        (x) => topicError[x] && topicError[x] !== ""
      )
    ) {
      const finalData = { name, course: id, description: descriptionValue };
      console.log(finalData);
      setLoader(false);
      dispatch(
        addTopicAction(finalData, (response) => {
          if (response?.data?.success) {
            toast.success(response?.data?.message);
            router.push(`/admin/course/edit_course/${id}`);
          } else {
            toast.error(response?.data?.message);
          }
        })
      );
    } else {
      setErrorShow(true);
    }
  }

  if (loader) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <PuffLoader color="#D69E2E" size={50} />
      </div>
    );
  }

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  return (
    <>
      <Layout>
        <div className="w-full px-4 lg:px-14 pt-24 md:pt-28">
          <div className="flex flex-col w-full md:w-1/2">
            <label
              htmlFor="topic_title"
              className="text-lg mb-1 text-slate-300"
            >
              Topic Title<sup className="text-red-500 text-[16px]">*</sup>
            </label>
            <div className="w-full">
              <input
                name="name"
                onChange={handleInputData}
                type="text"
                className="w-full p-2 bg-transparent border-[1px] rounded-lg outline-none hover:border-yellow-600 duration-300"
                placeholder="Topic Title..."
              />
              {errorShow && (
                <p className="text-[14px] text-red-500">{topicError.name}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full mt-4 md:mt-6">
            <label
              htmlFor="topic_content"
              className="text-lg mb-1 text-slate-300"
            >
              Add Topic Content<sup className="text-red-500 text-[16px]">*</sup>
            </label>
            <ReactQuill
              theme="snow"
              value={descriptionValue}
              onChange={setDescriptionValue}
              modules={modules}
              className="w-full h-40 custom-quill-editor mb-16 md:mb-10" // Add your custom class here
            />
          </div>
          <div className="flex flex-col w-full my-8">
            <button
              onClick={submitData}
              className="border w-1/2 p-2 md:w-40 text-center text-white border-yellow-500 rounded-lg font-semibold bg-yellow-500 hover:bg-transparent duration-300"
            >
              Add Topic
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default AddTopicCourse;
