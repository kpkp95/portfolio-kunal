import { assets } from "@/asset/assets";
import Image from "next/image";
import React from "react";
import { MdOutlineMail } from "react-icons/md";
import { RiNextjsLine, RiTailwindCssFill } from "react-icons/ri";
import { FaLinkedin, FaGithub, FaReact } from "react-icons/fa";

const Footer = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div className="  py-6 bg-[url('/footer-bg-color.png')] dark:bg-none ">
      <div className="text-center">
        <div className="w-max flex items-center gap-2 mx-auto dark:text-white">
          <MdOutlineMail size="1.8em" color={isDarkMode ? "white" : "gray"} />
          <a
            href="mailto:kunal.pandey.work@outlook.com"
            className="text-gray-800 hover:underline dark:text-white"
          >
            kunal.pandey.work@outlook.com
          </a>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center md:justify-between border-t border-gray-400 mx-[10%] mt-12 py-6 text-center md:text-left">
        {/* Left Side - Copyright */}
        <p className="text-md font-bold w-full md:w-auto">
          © 2025 Kunal Pandey. All Rights Reserved.
        </p>

        {/* Right Side - Built with Logos */}
        <p className=" hidden md:flex items-center gap-3 justify-center md:justify-end mt-4 md:mt-0 w-full md:w-auto">
          Built with <FaReact size="1.5em" color="#61DAFB" />{" "}
          <RiNextjsLine size="1.5em" color={isDarkMode ? "white" : "black"} />
          <RiTailwindCssFill size="1.5em" color="#06B6D4" />
        </p>
      </div>
    </div>
  );
};

export default Footer;
