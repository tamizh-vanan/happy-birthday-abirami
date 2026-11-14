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

/** The whole birthday page. Shared by the Lovable route and the GitHub Pages build. */
export function BirthdayExperience() {
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
