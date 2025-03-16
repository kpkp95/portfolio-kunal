import React from "react";
import Image from "next/image";
import { assets } from "@/asset/assets";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { MdOutlineFileDownload } from "react-icons/md";
import { motion } from "motion/react";
import { FaArrowRightLong } from "react-icons/fa6";

const Header = () => {
  const [text, count] = useTypewriter({
    words: [
      "Frontend Developer ",
      "React & Next.js Enthusiast",
      "Creating User-Friendly Interfaces ",
      ,
    ],
    loop: 0, // Set to `0` for infinite loop (or `true`)

    delaySpeed: 2000,
  });
  return (
    <div className="w-11/12 max-w-4xl text-center mx-auto h-screen flex flex-col items-center justify-center gap-2 mb-0 pb-0">
      <motion.div
        className="mb-6"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        <Image
          src={assets.profileround}
          alt="profile"
          className="w-60 rounded-[40px] rounded-t-[100px] rounded-b-[100px]"
        />
      </motion.div>

      <motion.h3
        className="  items-end gap-2 text-xl md:text-2xl mb-1"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Hi! I'm Kunal
      </motion.h3>
      <motion.h1
        className="text-3xl  lg:text-5xl  px-12 py-6 "
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <span className="mr-3">{text}</span>
        <Cursor cursorColor="#F7AB0A" />
      </motion.h1>
      <motion.p
        className="max-w-3xl text-lg mx-auto font-ovo "
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        I am a Front-End Developer from Canada who loves building interactive
        websites and I am eager to contribute to a dynamic team.
      </motion.p>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 py-5 ">
        <motion.a
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          href="#contact"
          className="px-10 py-3 border rounded-full border-white flex bg-black text-white items-center gap-2 dark:bg-transparent dark:text-white "
        >
          contact me
          <FaArrowRightLong size="1.5em" color="white" />
        </motion.a>

        <motion.a
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          href="/kunal_pandey-resume.pdf"
          download
          className="px-10 py-3 border rounded-full border-gray-500 flex items-center gap-2 dark:bg-white dark:text-black"
        >
          <MdOutlineFileDownload size="1.5em" />
          My Resume
        </motion.a>
      </div>
    </div>
  );
};

export default Header;
