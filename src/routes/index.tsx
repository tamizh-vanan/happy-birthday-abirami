import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { ExperienceProvider } from "@/components/birthday/ExperienceProvider";
import { ProgressChrome, SoundToggle } from "@/components/birthday/Chrome";
import { BootChapter } from "@/components/birthday/BootChapter";
import { DashboardChapter } from "@/components/birthday/DashboardChapter";
import { MeetingChapter } from "@/components/birthday/MeetingChapter";
import { CakeChapter } from "@/components/birthday/CakeChapter";
import { ReasonsChapter } from "@/components/birthday/ReasonsChapter";
import { LetterChapter } from "@/components/birthday/LetterChapter";
import { FinaleChapter } from "@/components/birthday/FinaleChapter";

const TITLE = "Happy Birthday Abirami | A Surprise by Tamizh";
const DESCRIPTION = "A little birthday surprise, made with all my heart. Happy Birthday Abi!";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <MotionConfig reducedMotion="user">
      <ExperienceProvider>
        <ProgressChrome />
        <SoundToggle />
        <main>
          <BootChapter />
          <DashboardChapter />
          <MeetingChapter />
          <CakeChapter />
          <ReasonsChapter />
          <LetterChapter />
          <FinaleChapter />
        </main>
      </ExperienceProvider>
    </MotionConfig>
  );
}
