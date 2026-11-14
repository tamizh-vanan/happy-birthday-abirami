// Entry for the static GitHub Pages build (see vite.pages.config.ts). Not used by Lovable hosting.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/styles.css";
import { BirthdayExperience } from "@/components/birthday/BirthdayExperience";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BirthdayExperience />
  </StrictMode>,
);
