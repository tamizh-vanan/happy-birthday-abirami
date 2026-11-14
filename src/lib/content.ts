export const PEOPLE = {
  name: "Abirami",
  nickname: "Abi",
  creator: "Tamizh",
  birthdayLabel: "November 23, 2026",
};

export const CHAPTERS = [
  { id: "boot", label: "System Boot" },
  { id: "dashboard", label: "Test Dashboard" },
  { id: "meeting", label: "Meeting Alert" },
  { id: "cake", label: "Birthday Cake" },
  { id: "reasons", label: "Ten Reasons" },
  { id: "letter", label: "A Letter" },
  { id: "finale", label: "Final Surprise" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

export const TEST_SCENARIOS = [
  { name: "Hardworking nature", passed: true, ms: 1240 },
  { name: "Automation skills", passed: true, ms: 860 },
  { name: "Attending Teams calls", passed: true, ms: 3120 },
  { name: "Taking breaks", passed: false, ms: 30000 },
  { name: "Being adorable", passed: true, ms: 12 },
  { name: "Making Tamizh smile", passed: true, ms: 1 },
];

export const MEETING_AGENDA = [
  "Stop working for five minutes.",
  "Disconnect headphones temporarily.",
  "Accept birthday wishes.",
  "Enjoy a little surprise.",
];

export const REASONS = [
  "Your dedication inspires me.",
  "Your hardworking nature is amazing.",
  "Your smile makes ordinary moments special.",
  "Your passion for learning is admirable.",
  "Your cute headphone look.",
  "Your ability to handle challenging situations.",
  "Your kindness.",
  "Your determination.",
  "Your unique personality.",
  "Simply because you're Abi.",
];

export const LETTER_PARAGRAPHS = [
  "I know your days are filled with automation scripts, Playwright tests, endless Teams meetings and those headphones that seem to have become part of you!",
  "Sometimes I wonder whether your laptop gets more of your attention than the rest of the world. Haha!",
  "But today, I want you to take a little break.",
  "You deserve happiness, laughter, peaceful moments and all the beautiful things life has to offer.",
  "I genuinely admire your dedication, your dreams and the person you are.",
  "I don't know exactly what the future holds, but I'm grateful to know someone as special as you.",
  "Keep smiling, keep growing and keep shining.",
  "And remember, among all the test cases in the world, you'll always be my favourite exception.",
  "Happy Birthday, Abi!",
];

export const FINAL_MESSAGE = [
  "I hope your life is filled with beautiful moments, exciting opportunities, laughter and endless happiness.",
  "Thank you for being someone who makes my world a little more special.",
  "You are special to me, Abi. Always keep smiling.",
];
