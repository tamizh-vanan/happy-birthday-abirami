import { createFileRoute } from "@tanstack/react-router";
import { BirthdayExperience } from "@/components/birthday/BirthdayExperience";

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
  return <BirthdayExperience />;
}
