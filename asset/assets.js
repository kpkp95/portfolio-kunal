import code_icon from "./code-icon.png";
import code_icon_dark from "./code-icon-dark.png";
import vscode from "./vscode.png";
import firebase from "./firebase.png";
import git from "./git.png";
import mongodb from "./mongodb.png";
import logo_light from "./logo_light_.png";
import logoDark from "./logo_dark_.png";
import header_bg_color from "./header-bg-color.png";
import profile from "./profile.jpeg";
import profile_web from "./profile_web.jpeg";
import profileround from "./profile-round.png";
import react_100 from "./react_100.png";
import react_light_icon from "./react_light_icon.png";
import react_dark from "./react_dark.png";
import nextjs_96 from "./nextjs_96.png";
import nextjs_144 from "./nextjs_144.png";
import tailwind_96 from "./tailwind_css-96.png";
import tailwind_144 from "./tailwind_css-144.png";
import bootstrap_96 from "./bootstrap_96.png";
import performance_light from "./performance_light.png";
import performance_dark from "./performance_dark.png";
import youtube_gpt from "./youtube_gpt.png";
import netflix_gpt from "./Netflix_gpt.png";
import frontend_icon from "./frontend_icon.png";
import backend_icon from "./backend_icon.png";
import back_light from "./back_light.png";
import back_dark from "./back_dark.png";
import webDesign_light from "./webDesign_light.png";
import tools_dark from "./tools_dark.png";
import tools_light from "./tools-light.png";
import webDesign_dark from "./webDesign_dark.png";

export const assets = {
  tools_dark,
  tools_light,
  profile,
  webDesign_light,
  performance_light,
  performance_dark,
  webDesign_dark,
  back_light,
  back_dark,
  youtube_gpt,
  netflix_gpt,
  react_light_icon,
  backend_icon,
  frontend_icon,
  performance_light,
  backend_icon,
  react_100,
  bootstrap_96,
  nextjs_96,
  nextjs_144,
  react_dark,
  tailwind_96,
  tailwind_144,
  code_icon,
  code_icon_dark,
  vscode,
  firebase,
  git,
  mongodb,
  profileround,
  profile_web,
  logo_light,
  logoDark,
  header_bg_color,
};

export const workData = [
  {
    title: "Netflix-GPT 🎬",
    description:
      "Netflix-GPT is an AI-powered movie search and recommendation app built with React, Redux, and Tailwind CSS. It integrates OpenAI's GPT and the TMDb API to provide intelligent movie suggestions and real-time search functionality.",
    bgImage: assets.netflix_gpt,
    github: "https://github.com/kpkp95/netflix-gpt.git",
    bgImage1: "/Netflix_gpt.png",
    projectURL: "https://netflix-gpt.vercel.app/",
  },
  {
    title: "Youtube-Clone 📺",
    description:
      "A YouTube Clone built with React and Tailwind CSS, featuring dynamic video rendering and search functionality using the YouTube API. It delivers a seamless video streaming experience with a responsive and modern UI.",
    bgImage: assets.youtube_gpt,
    github: "https://github.com/kpkp95/my-youtube.git",
    bgImage1: "/youtube_gpt.png",
    projectURL: "https://youtube-clone-kappa-tawny.vercel.app/",
  },
  {
    title: "ApertureAI",
    description:
      "A browser-based AI-powered image editor built with Next.js, Clerk, React, Imagekit, and Fabric.js. It features background removal and replacement using generative AI, along with layer-based canvas tools for cropping, resizing, adjusting exposure/saturation, and saving projects.",
    bgImage: assets.youtube_gpt,
    github: "https://github.com/kpkp95/photoEditor.git", // replace with actual link
    bgImage1: "/PhotoEditor.png", // replace with your image asset
    projectURL: "https://photo-editor.vercel.app/", // replace with your live project URL
  },
];

export const serviceData = [
  {
    icon: assets.webDesign_light,
    darkIcon: assets.webDesign_dark,
    title: "Web Development",
    description:
      "I build responsive and high-performance web applications using modern frameworks like React and Next.js.",
    link: "",
  },
  {
    icon: assets.frontend_icon, // Update with the correct asset
    darkIcon: assets.frontend_icon,
    title: "Front-End Development",
    description:
      "I specialize in front-end development, creating fast and scalable UIs using React, Tailwind CSS, and Bootstrap.",
    link: "",
  },
  {
    icon: assets.back_light, // Update with the correct asset
    darkIcon: assets.back_dark,
    title: "Back-End Integration",
    description:
      "I integrate front-end applications with back-end services using Firebase and MongoDB for seamless functionality.",
    link: "",
  },
  {
    icon: assets.performance_light, // Update with the correct asset
    darkIcon: assets.performance_dark,
    title: "Performance Optimization",
    description:
      "I optimize web applications for speed, SEO, and user experience, ensuring smooth performance across devices.",
    link: "",
  },
];

export const infoList = [
  {
    icon: assets.code_icon,
    iconDark: assets.code_icon_dark,
    title: "Languages",
    description: "JavaScript, TypeScript, Python",
  },
  {
    icon: assets.react_light_icon, // React component used properly
    iconDark: assets.react_dark,
    title: "Technologies",
    description: "React, Next.js, Tailwind CSS, Bootstrap, MongoDB, Firebase",
  },
  {
    icon: assets.tools_light,
    iconDark: assets.tools_dark,
    title: "Tools & Platforms",
    description: "Git, GitHub, VS Code, Vercel, Netlify",
  },
];

export const toolsData = [
  assets.vscode,
  assets.firebase,
  assets.mongodb,
  assets.tailwind_96,
  assets.bootstrap_96,
  assets.git,
  assets.react_100,
  assets.nextjs_96,
];
