This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

//export const serviceData = [
{
icon: assets.web_icon,
title: "Web design",
description: "Web development is the process of building, programming...",
link: "",
},
{
icon: assets.mobile_icon,
title: "Mobile app",
description:
"Mobile app development involves creating software for mobile devices...",
link: "",
},
{
icon: assets.ui_icon,
title: "UI/UX design",
description:
"UI/UX design focuses on creating a seamless user experience...",
link: "",
},
{
icon: assets.graphics_icon,
title: "Graphics design",
description: "Creative design solutions to enhance visual communication...",
link: "",
},
//];

"use client";

import React, { useState } from "react";

const Contact = () => {
const [result, setResult] = useState("");
const [isLoading, setIsLoading] = useState(false);

const onSubmit = async (event) => {
event.preventDefault();
setIsLoading(true);
setResult("Sending...");

    const formData = new FormData(event.target);
    formData.append("access_key", "138d5ba3-8930-4ccd-a4f9-7c6720f68e13");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResult("✅ Form Submitted Successfully!");
        event.target.reset();
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

<div
      id="contact"
      className="w-full px-[12%] py-20 mb-8 scroll-mt-20 bg-[url('/footer-bg-color.png')] bg-no-repeat bg-center bg-cover"
    >
<h4 className="text-center mb-2 text-lg font-ovo">Connect with me</h4>
<h2 className="text-center text-5xl font-ovo">Get in touch</h2>
<p className="text-center max-w-2xl mx-auto mt-5 mb-12 font-ovo">
I'd love to hear from you! If you have any questions, comments, or
feedback, please fill out the form below.
</p>

      <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
        {/* Name & Email Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 mb-8">
          <input
            type="text"
            placeholder="Enter your name"
            required
            name="name"
            className="p-3 outline-none border border-gray-400 rounded-md bg-white w-full"
          />
          <input
            type="email"
            placeholder="Enter your email"
            required
            name="email"
            className="p-3 outline-none border border-gray-400 rounded-md bg-white w-full"
          />
        </div>

        {/* Message Field */}
        <textarea
          rows="6"
          placeholder="Enter your message"
          required
          name="message"
          className="w-full p-4 outline-none border border-gray-400 rounded-md bg-white mb-6"
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`py-3 px-8 w-max flex items-center justify-between gap-2 bg-black/80 text-white rounded-full mx-auto hover:bg-black duration-500 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>

        {/* Form Result Message */}
        <p className="mt-4 text-center text-sm text-gray-700">{result}</p>
      </form>
    </div>

);
};

export default Contact;
{
icon: assets.project_icon,
iconDark: assets.project_icon_dark,
title: "Projects",
description: "Built more than 5 projects",
},
