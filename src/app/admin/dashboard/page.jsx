"use client";

import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { getProfileAction } from "@/app/redux/actions";

function Home() {
  const typedRef = useRef(null);
  const dispatch = useDispatch();

  // Dispatch the profile action
  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);

  // Initialize the typed.js effect
  useEffect(() => {
    if (typedRef.current) {
      const options = {
        strings: ["Blogs", "Articles", "Contest", "Courses", "Internships"],
        typeSpeed: 180,
        backSpeed: 300,
        loop: true,
      };

      const typed = new Typed(typedRef.current, options);

      return () => {
        typed.destroy();
      };
    }
  }, []);

  return (
    <Layout>
      <div className="text-white flex justify-center w-full main items-center">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-extrabold">
            Welcome to Excelegal
          </h1>
          <p className="text-md md:text-xl lg:text-2xl font-bold mt-2 md:mt-3">
            Your own stop solution for law <span ref={typedRef}></span>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
