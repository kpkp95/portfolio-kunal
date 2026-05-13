"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Contact = ({ isDarkMode }) => {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResult("Sending...");

    const formData = new FormData(event.target);
    formData.append("access_key", "05ab25b2-4dac-4c23-a280-2a220350549c");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResult("✅ Form submitted successfully!");
        event.target.reset();
        setTimeout(() => setResult(""), 5000);
      } else {
        console.error("Error:", data);
        setResult("❌ " + data.message);
      }
    } catch (error) {
      setResult("❌ Failed to submit. Please try again.");
      console.error("Submit Error:", error);
    }

    setIsLoading(false);
  };

  return (
    <motion.section
      id="contact"
      className="w-full px-[12%] py-24 scroll-mt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h4
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-2 text-lg font-ovo"
      >
        Connect with me
      </motion.h4>

      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center text-5xl font-serif"
      >
        Get in touch
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mt-5 mb-12 font-ovo text-gray-700 dark:text-white/80"
      >
        I'd love to hear from you! If you have any questions, comments, or
        feedback, please fill out the form below.
      </motion.p>

      <motion.form
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onSubmit={onSubmit}
        className="max-w-2xl mx-auto"
      >
        <input
          type="hidden"
          name="to_email"
          value="kunal.pandey.work@outlook.com"
        />
        <input type="hidden" name="from_name" value="Portfolio Contact Form" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 mb-8">
          <motion.input
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            type="text"
            placeholder="Enter your name"
            required
            name="name"
            className="p-3 outline-none border border-gray-400 rounded-md bg-white w-full dark:bg-darkHover/30 dark:border-white/20 dark:text-white"
          />
          <motion.input
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            type="email"
            placeholder="Enter your email"
            required
            name="email"
            className="p-3 outline-none border border-gray-400 rounded-md bg-white w-full dark:bg-darkHover/30 dark:border-white/20 dark:text-white"
          />
        </div>

        <motion.textarea
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          rows="6"
          placeholder="Enter your message"
          required
          name="message"
          className="w-full p-4 outline-none border border-gray-400 rounded-md bg-white mb-6 dark:bg-darkHover/30 dark:border-white/20 dark:text-white"
        ></motion.textarea>

        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          type="submit"
          disabled={isLoading}
          className={`py-3 px-8 flex items-center justify-center gap-2 bg-black/80 text-white rounded-full mx-auto hover:bg-black duration-500 dark:border-[0.5px] dark:hover:bg-darkHover dark:bg-transparent ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </motion.button>

        {result && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-sm text-gray-700 dark:text-white/80"
          >
            {result}
          </motion.p>
        )}
      </motion.form>

      <div className="mt-12 flex items-center justify-center gap-6">
        <a
          href="https://github.com/kpkp95"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          className="transition hover:-translate-y-1"
        >
          <FaGithub size="1.8em" color={isDarkMode ? "white" : "black"} />
        </a>
        <a
          href="https://www.linkedin.com/in/kunal-pandey25"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          className="transition hover:-translate-y-1"
        >
          <FaLinkedin size="1.8em" color="#0A66C2" />
        </a>
      </div>
    </motion.section>
  );
};

export default Contact;
