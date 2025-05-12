import React from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Link from "next/link";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

function Footer() {
  return (
    <div className="w-full lg:px-14 px-4 p-10 bg-slate-800">
      <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl md:text-2xl">
        <AccountBalanceIcon className=" text-xl md:text-3xl" /> <p>Excelegal</p>
      </div>

      <div className="flex justify-between items-start mt-5 flex-wrap gap-4 w-3/4">
        <div className=" w-72 flex flex-col gap-4 justify-between">
          <Link
            href="#"
            className="text-md underline font-semibold text-gray-400 hover:scale-105 duration-300"
          >
            About Us <ArrowRightAltIcon />
          </Link>
          <Link
            href="#"
            className="text-md underline font-semibold text-gray-400 hover:scale-105 duration-300"
          >
            Cookie Policy <ArrowRightAltIcon />
          </Link>
          <Link
            href="#"
            className="text-md underline font-semibold text-gray-400 hover:scale-105 duration-300"
          >
            Contact Us <ArrowRightAltIcon />
          </Link>
          <Link
            href="#"
            className="text-md underline font-semibold text-gray-400 hover:scale-105 duration-300"
          >
            terms and Conditions
            <ArrowRightAltIcon />
          </Link>
        </div>
        <div className="w-72 flex flex-col gap-4 justify-between">
          <Link
            href="#"
            className="text-md underline font-semibold text-gray-400 hover:scale-105 duration-300"
          >
            Become an Instructor <ArrowRightAltIcon />
          </Link>
          <Link
            href="#"
            className="text-md underline font-semibold text-gray-400 hover:scale-105 duration-300"
          >
            Get the App <ArrowRightAltIcon />
          </Link>
          <Link
            href="#"
            className="text-md underline font-semibold text-gray-400 hover:scale-105 duration-300"
          >
            Privacy Policy <ArrowRightAltIcon />
          </Link>
        </div>
        <div className="w-72 flex flex-col gap-4 justify-between">
          <Link
            href="#"
            className="text-md underline font-semibold text-gray-400 hover:scale-105 duration-300"
          >
            	Become a Contributer <ArrowRightAltIcon />
          </Link>
          <Link
            href="#"
            className="text-md underline font-semibold text-gray-400 hover:scale-105 duration-300"
          >
            	Sitemap <ArrowRightAltIcon />
          </Link>
          <Link
            href="#"
            className="text-md underline font-semibold text-gray-400 hover:scale-105 duration-300"
          >
           	Careers <ArrowRightAltIcon />
          </Link>
        
        </div>
      </div>
    </div>
  );
}

export default Footer;
