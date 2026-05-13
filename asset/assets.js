import code_icon from "./code-icon.png";
import code_icon_dark from "./code-icon-dark.png";
import header_bg_color from "./header-bg-color.png";
import profile_web from "./profile_web.jpeg";
import profileround from "./profile-round.png";
import youtube_gpt from "./youtube_gpt.png";
import netflix_gpt from "./Netflix_gpt.png";
import logo_light from "./logo_light_.png";
import logoDark from "./logo_dark_.png";
import {
  SiAmazonwebservices,
  SiPython,
  SiGooglecloud,
  SiDocker,
  SiPytorch,
  SiGithubactions,
  SiGit,
  SiFirebase,
  SiMongodb,
  SiReact,
  SiNextdotjs,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

export const assets = {
  code_icon,
  code_icon_dark,
  header_bg_color,
  profile_web,
  profileround,
  youtube_gpt,
  netflix_gpt,
  logo_light,
  logoDark,
};

export const toolsData = [
  {
    Icon: SiPython,
    label: "Python",
    colorLight: "#3776AB",
    colorDark: "#3776AB",
  },
  {
    Icon: SiAmazonwebservices,
    label: "AWS",
    colorLight: "#FF9900",
    colorDark: "#FF9900",
  },
  {
    Icon: SiGooglecloud,
    label: "GCP",
    colorLight: "#4285F4",
    colorDark: "#4285F4",
  },
  {
    Icon: SiDocker,
    label: "Docker",
    colorLight: "#2496ED",
    colorDark: "#2496ED",
  },
  {
    Icon: SiPytorch,
    label: "PyTorch",
    colorLight: "#EE4C2C",
    colorDark: "#EE4C2C",
  },
  {
    Icon: SiGithubactions,
    label: "CI/CD",
    colorLight: "#2088FF",
    colorDark: "#2088FF",
  },
  { Icon: SiGit, label: "Git", colorLight: "#F05032", colorDark: "#F05032" },
  {
    Icon: VscVscode,
    label: "VS Code",
    colorLight: "#007ACC",
    colorDark: "#007ACC",
  },
  {
    Icon: SiFirebase,
    label: "Firebase",
    colorLight: "#FFCA28",
    colorDark: "#FFCA28",
  },
  {
    Icon: SiMongodb,
    label: "MongoDB",
    colorLight: "#47A248",
    colorDark: "#47A248",
  },
  {
    Icon: SiReact,
    label: "React",
    colorLight: "#61DAFB",
    colorDark: "#61DAFB",
  },
  {
    Icon: SiNextdotjs,
    label: "Next.js",
    colorLight: "#000000",
    colorDark: "#FFFFFF",
  },
];

export const infoList = [
  {
    icon: assets.code_icon,
    iconDark: assets.code_icon_dark,
    title: "ML & AI",
    description:
      "Python, ADK, PyTorch, Scikit-learn, MLflow, LangChain, " +
      "RAG, Pinecone, Embeddings, Hugging Face, Prompt Engineering, AI Agents, Langchain",
  },
  {
    icon: assets.code_icon,
    iconDark: assets.code_icon_dark,
    title: "Cloud & DevOps",
    description:
      "AWS (EC2, ECR, ECS), GCP (Cloud Run, Vertex AI, Secret Manager), " +
      "Docker, GitHub Actions CI/CD, Azure, MLflow",
  },
  {
    icon: assets.code_icon,
    iconDark: assets.code_icon_dark,
    title: "Data Engineering",
    description:
      "Pandas, NumPy, SQL, Power BI, DAX, Plotly, Streamlit, ETL design, " +
      "and analytics workflows that keep data clean and usable",
  },
  {
    icon: assets.code_icon,
    iconDark: assets.code_icon_dark,
    title: "Web Dev",
    description:
      "FastAPI, Flask, TypeScript,React, Next.js, and Tailwind CSS for responsive " +
      "apps, dashboards, and API-driven experiences",
  },
];

export const workData = [
  {
    title: "AI Job Recommender",
    description:
      "Full-stack GenAI career assistant deployed on Google Cloud Run. " +
      "Parses resume PDFs, analyzes via Gemini on Vertex AI, and delivers " +
      "skill-gap reports, 30-day roadmaps, and real-time job matches via Apify API.",
    bgImage1: "/ai_job_recommender.png",
    github: "https://github.com/kpkp95/JobRecommender.git",
    projectURL: "https://ai-job-recommender-778318657000.us-central1.run.app",
  },
  {
    title: "Domain RAG Assistant",
    description:
      "Multi-domain RAG chatbot answering questions from Medical, Machine Learning, " +
      "and LLM documents. Indexes 384-dim embeddings in Pinecone with metadata-based " +
      "domain filtering, Redis-backed conversation memory, and source citations " +
      "(file, page, domain, chunk ID). Achieved 12/12 retrieval evaluation tests. " +
      "Deployed on AWS EC2 via Docker + GitHub Actions CI/CD with a self-hosted runner.",
    bgImage1: "/domain_rag.png",
    github: "https://github.com/kpkp95/domain-rag-assistant",
    projectURL: "http://54.172.244.2:8080/",
  },
  {
    title: "Housing Price Prediction",
    description:
      "XGBoost regression model trained on 800K+ rows of U.S. housing data, " +
      "achieving R² ~0.87 with Optuna tuning. Deployed on AWS ECS via Docker + " +
      "GitHub Actions CI/CD with a FastAPI endpoint and Streamlit dashboard.",
    bgImage1: "/housing_price.png",
    github: "https://github.com/kpkp95",
    projectURL: "",
  },

  {
    title: "Netflix-GPT",
    description:
      "AI-powered movie search and recommendation app built with React, Redux, " +
      "and Tailwind CSS. Integrates OpenAI GPT and TMDb API for intelligent " +
      "movie suggestions and real-time search.",
    bgImage1: "/Netflix_gpt.png",
    github: "https://github.com/kpkp95/netflix-gpt.git",
    projectURL: "https://netflix-gpt-five-tan.vercel.app/",
  },
  {
    title: "ApertureAI",
    description:
      "Browser-based AI image editor built with Next.js, Clerk, and Fabric.js. " +
      "Features background removal via generative AI and layer-based canvas tools " +
      "for cropping, resizing, and exposure adjustment.",
    bgImage1: "/PhotoEditor.png",
    github: "https://github.com/kpkp95/photoEditor.git",
    projectURL: "https://photo-editor-snowy.vercel.app/",
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
];
