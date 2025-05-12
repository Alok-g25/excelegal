"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PuffLoader from "react-spinners/PuffLoader";
import { useDispatch } from "react-redux";
import { deleteBannerAction, listBannerAction } from "@/app/redux/actions";
import Swal from "sweetalert2";
import Layout from "../components/Layout"

function BannerPage() {
  const [loader, setLoader] = useState(false);
  const [allBanner, setAllBanner] = useState([]);
  const dispatch = useDispatch();

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getBanner = () => {
    setLoader(true);
    dispatch(
      listBannerAction((response) => {
        if (response?.data?.success) {
          setAllBanner(response?.data?.data?.banners);
        } else {
          setLoader(false);
        }
        setLoader(false);
      })
    );
  };

  useEffect(() => {
    getBanner();
  }, []);

  const deleteBanner = (id) => {
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
          deleteBannerAction(id, (response) => {
            if (response?.data?.success) {
              setAllBanner((prevData) =>
                prevData.filter((quiz) => quiz._id !== id)
              );
              Swal.fire({
                title: "Deleted!",
                text: "Your banner has been deleted.",
                icon: "success",
              });
            } else {
              setLoader(false);
            }
            setLoader(false);
          })
        );
      }
    });
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
          <div className="w-full flex justify-end">
            <Link
              href="/admin/banner/add_banner"
              className="text-center py-2 w-1/4 rounded-md border text-white font-bold text-sm border-yellow-500 bg-yellow-500 hover:bg-transparent duration-300"
            >
              Add Banner
            </Link>
          </div>

          <div className="flex justify-center">
            <h1 className="text-2xl uppercase font-bold underline text-yellow-500">
              Banners
            </h1>
          </div>

          <div className="w-full flex justify-center md:justify-none flex-wrap gap-7 my-5">
            {allBanner.length !== 0
              ? allBanner.map((item, i) => (
                <div
                  key={i}
                  className={`relative w-full md:w-[600px] border rounded-lg card overflow-hidden hover:shadow-yellow-700 duration-300 ${hoveredIndex === i ? "opacity-50" : ""
                    }`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <figure className="w-full h-60 md:h-72 relative">
                    <img
                      className="w-full h-full rounded-lg shadow-sm shadow-slate-400 object-cover bg-contain duration-300 hover:scale-110"
                      src={item.image}
                      alt=""
                    />
                  </figure>
                  <p className="mt-2 p-2"><b className="text-yellow-600 mr-2">Description:</b>{item?.description.slice(0, 150)}...</p>
                  {hoveredIndex === i && (
                    <div className="absolute top-2 right-2 flex gap-3">
                      <Link
                        href={`/admin/banner/edit_banner/${item._id}`}
                        className="py-1 px-2 bg-slate-500 rounded-full text-white hover:bg-slate-600 duration-300"
                      >
                        <BorderColorIcon fontSize="14px" />
                      </Link>
                      <button
                        onClick={() => deleteBanner(item._id)}
                        className="py-1 px-2 bg-slate-500 rounded-full text-white hover:bg-slate-600 duration-300"
                      >
                        <DeleteIcon fontSize="14px" />
                      </button>
                    </div>
                  )}
                </div>
              ))
              : <div class="flex flex-col items-center justify-center mt-5">
                <p class="text-lg text-red-700 mb-4">Banner not Available</p>
              </div>
            }
          </div>
        </div>
      </Layout>
    </>
  );
}

export default BannerPage;
