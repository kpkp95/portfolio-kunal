"use client";

import { workData } from "@/asset/assets";
import React from "react";
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
        A collection of ML, GenAI, cloud, and full-stack projects — from
        production-deployed RAG systems and ML pipelines to BI dashboards and
        web applications.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {workData.map((project, index) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            key={index}
            className="flex flex-col border border-gray-400 rounded-lg p-4 md:p-6
              hover:drop-shadow-black cursor-pointer hover:bg-lightHover
              hover:-translate-y-1 duration-500 dark:hover:bg-darkHover
              dark:hover:shadow-white"
          >
            {/* Title row with Live badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {project.title}
              </h3>
              {project.projectURL && (
                <span
                  className="shrink-0 text-xs font-medium px-2 py-0.5
                  rounded-full border border-green-500 text-green-500
                  dark:border-green-400 dark:text-green-400"
                >
                  Live
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-800 leading-5 dark:text-white/80 flex-1">
              {project.description}
            </p>

            {/* Links */}
            <div className="flex items-center gap-4 mt-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Source Code
                </a>
              )}
              {project.projectURL && (
                <a
                  href={project.projectURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Live Demo →
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Work;
