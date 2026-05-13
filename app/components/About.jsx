import React from "react";
import Image from "next/image";
import { infoList, toolsData } from "@/asset/assets";
import { motion } from "motion/react";

const About = ({ isDarkMode }) => {
  return (
    <motion.div
      id="about"
      className="w-full px-[6%] sm:px-[10%] xl:px-[12%] py-10 mb-25 scroll-mt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center text-5xl mt-10 font-serif"
      >
        About Me
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full my-10 sm:my-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="mb-10 font-ovo text-justify p-2 sm:p-0">
            I am an AI/ML developer and data engineer based in Ontario, Canada,
            with hands-on experience building production-grade machine learning
            pipelines, RAG systems, and cloud-deployed GenAI applications. I
            completed post-graduate studies in Artificial Intelligence at Seneca
            College and Cloud Computing at Cambrian College, with projects
            spanning LangChain, Pinecone, MLflow, Docker, AWS, and GCP. I am
            actively seeking a co-op opportunity to contribute across data, ML,
            and cloud engineering domains.
          </p>

          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {infoList.map(({ icon, iconDark, title, description }, index) => (
              <motion.li
                whileHover={{ scale: 1.05 }}
                className="border-[0.5px] border-gray-400 rounded-xl p-6 cursor-pointer hover:bg-lightHover hover:drop-shadow-black hover:-translate-y-1 duration-500 dark:border-white/20 dark:hover:shadow-white dark:hover:bg-darkHover/50"
                key={index}
              >
                <Image
                  src={isDarkMode ? iconDark : icon}
                  alt={title}
                  className="w-5"
                />
                <h3 className="my-2 font-semibold text-gray-700 dark:text-white">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-6 dark:text-white/80">
                  {description}
                </p>
              </motion.li>
            ))}
          </motion.ul>

          <motion.h4
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="my-6 text-gray-600 font-ovo dark:text-white"
          >
            Tools I use
          </motion.h4>

          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="flex flex-wrap items-center gap-3 sm:gap-5"
          >
            {toolsData.map(({ Icon, label, colorLight, colorDark }, index) => (
              <motion.li
                whileHover={{ scale: 1.1 }}
                key={index}
                title={label}
                className="flex items-center justify-center w-10 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:-translate-y-1 duration-500 dark:border-white/20 dark:hover:shadow-white dark:hover:bg-darkHover/50"
              >
                <Icon
                  size="1.5em"
                  color={isDarkMode ? colorDark : colorLight}
                  aria-label={label}
                />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;
