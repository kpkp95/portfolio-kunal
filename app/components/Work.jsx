"use client";

import { workData } from "@/asset/assets";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

const Work = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      id="work"
      className="w-full px-[15%] py-25 mb-25 scroll-mt-20 dark:text-white"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center text-5xl font-serif"
      >
        My Projects
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mt-5 mb-12 font-ovo dark:text-white"
      >
        Welcome to my web development portfolio! Here, you'll find projects that
        highlight my expertise in front-end development, showcasing my skills in
        building dynamic and responsive web applications.
      </motion.p>

      {/* Ensuring Two Columns on Larger Screens */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {workData.map((project, index) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            key={index}
            className="flex items-center border border-gray-400 rounded-lg p-4 md:p-6 hover:drop-shadow-black cursor-pointer hover:bg-lightHover hover:-translate-y-1 duration-500  dark:hover:bg-darkHover dark:hover:shadow-white"
          >
            {/* Left Side - Image */}
            <div className="hidden w-1/3">
              <Image
                src={project.bgImage}
                width={200}
                height={120}
                alt={project.title}
                className="rounded-lg"
              />
            </div>

            {/* Right Side - Content */}
            <div className="w-full pl-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {project.title}
              </h3>
              <p className="text-sm text-gray-800 leading-5 mt-2 dark:text-white">
                {project.description}
              </p>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 hover:underline dark:border-white dark"
              >
                Source Code
              </a>
              <a
                href={project.projectURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 pl-2 text-blue-600 hover:underline dark:border-white dark"
              >
                Project Link
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Work;
