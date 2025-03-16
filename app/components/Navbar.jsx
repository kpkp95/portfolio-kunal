"use client";
import { assets } from "@/asset/assets";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaLinkedin, FaGithub, FaReact } from "react-icons/fa";
import { motion } from "motion/react";

import {
  MdOutlineDarkMode,
  MdOutlineArrowOutward,
  MdClose,
  MdOutlineLightMode,
} from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const sideMenuRef = useRef(null);
  const [isScroll, setIsScroll] = useState(false);

  const openMenu = () => {
    sideMenuRef.current?.style.setProperty("transform", "translateX(-16rem)");
  };

  const closeMenu = () => {
    sideMenuRef.current?.style.setProperty("transform", "translateX(16rem)");
  };
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (scrollY > 50) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    });
  }, []);

  return (
    <>
      <div className="fixed top-0 right-0  w-11/12 -z-10 translate-y-[-80%] dark:hidden">
        <Image
          src={assets.header_bg_color}
          alt="header"
          className="w-full"
          priority
        />
      </div>
      <nav
        className={`w-full  fixed px-4  lg:px-8 xl:px-[8%] py-0 flex justify-between items-center z-50  ${
          isScroll
            ? "md:bg-white/60 md:backdrop-blur-md shadow-sm bg-white/70 dark:bg-darkTheme dark:shadow-white/20"
            : ""
        }`}
      >
        <motion.a
          initial={{ x: -500, opacity: 0, scale: 0.5 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.0 }}
          href="#top"
        >
          <Image
            alt="logo"
            src={isDarkMode ? assets.logoDark : assets.logo_light}
            className="w-28 cursor-pointer mr-14"
          />
        </motion.a>
        <ul
          className={`hidden md:flex items-center  gap-6 lg:gap-8 rounded-full px-12 py-3   ${
            isScroll
              ? ""
              : "bg-white/60  shadow-sm dark:border dark:border-white/50 dark:bg-transparent  "
          }`}
        >
          <li>
            <a className="font-ovo" href="#top">
              Home
            </a>
          </li>
          <li>
            <a className="font-ovo" href="#about">
              About Me
            </a>
          </li>
          <li>
            <a className="font-ovo" href="#work">
              My Work
            </a>
          </li>

          <li>
            <a className="font-ovo" href="#contact">
              Contact Me
            </a>
          </li>
        </ul>

        <motion.div
          initial={{ x: 500, opacity: 0, scale: 0.5 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.0 }}
          className="flex items-center gap-4"
        >
          <ul className="hidden  md:flex items-center gap-4 justify-center mt-4 sm:mt-0">
            <li className="hidden lg:flex">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/kpkp95"
              >
                <FaGithub
                  size="1.8em"
                  color={isDarkMode ? "white" : "black"}
                  className="text-gray-700 hover:text-gray transition"
                />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/pandey-kunal/"
              >
                <FaLinkedin
                  size="1.8em"
                  color={isDarkMode ? "white" : "black"}
                  className="text-gray-700 hover:text-black transition"
                />
              </a>
            </li>
          </ul>
          <button onClick={() => setIsDarkMode((prev) => !prev)}>
            {isDarkMode ? (
              <MdOutlineLightMode size="2em" style={{ cursor: "pointer" }} />
            ) : (
              <MdOutlineDarkMode style={{ cursor: "pointer" }} size="2em" />
            )}
          </button>

          <button className="block md:hidden ml-3" onClick={openMenu}>
            <RxHamburgerMenu size="2em" color={isDarkMode ? "white" : "gray"} />
          </button>
        </motion.div>

        {/* mobile menu */}
        <ul
          ref={sideMenuRef}
          className="flex md:hidden flex-col gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-64 z-50 h-screen bg-rose-50 transition duration-500 dark:bg-darkHover dark:text-white"
        >
          <div className="absolute right-6 top-6">
            <MdClose
              size="2em"
              style={{ cursor: "pointer" }}
              onClick={closeMenu}
              color={isDarkMode ? "white" : "gray"}
            />
          </div>
          <li>
            <a onClick={closeMenu} className="font-Outfit" href="#top">
              Home
            </a>
          </li>
          <li>
            <a onClick={closeMenu} href="#about">
              About Me
            </a>
          </li>
          <li>
            <a onClick={closeMenu} href="#work">
              My Work
            </a>
          </li>

          <li>
            <a onClick={closeMenu} href="#contact">
              Contact Me
            </a>
          </li>
          <li className="flex gap-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/kpkp95"
            >
              <FaGithub
                size="1.8em"
                color={isDarkMode ? "white" : "black"}
                className="text-gray-700 hover:text-gray transition"
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/pandey-kunal/"
            >
              <FaLinkedin
                size="1.8em"
                color={isDarkMode ? "white" : "black"}
                className="text-gray-700 hover:text-black transition"
              />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
