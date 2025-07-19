export const mockQuestions = [
  {
    id: 1,
    title: "How to implement React hooks?",
    excerpt: "I'm trying to understand useState and useEffect...",
    votes: 15,
    answers: 3,
    tags: ["react", "hooks", "javascript"],
    author: "developer123",
    date: "2 hours ago"
  },
  {
    id: 2,
    title: "CSS Grid vs Flexbox - When to use what?",
    excerpt: "I'm confused about when to choose Grid over Flexbox...",
    votes: 23,
    answers: 7,
    tags: ["css", "layout", "grid", "flexbox"],
    author: "cssmaster",
    date: "5 hours ago"
  },
  {
    id: 3,
    title: "Understanding JavaScript Promises",
    excerpt: "Need help understanding async/await and Promise chains...",
    votes: 42,
    answers: 12,
    tags: ["javascript", "async", "promises"],
    author: "jslearner",
    date: "1 day ago"
  },
  {
    id: 4,
    title: "Best practices for React state management",
    excerpt: "Comparing Redux, Context API, and other state management solutions...",
    votes: 31,
    answers: 9,
    tags: ["react", "redux", "state-management"],
    author: "reactdev",
    date: "3 days ago"
  },
  {
    id: 5,
    title: "Optimizing React performance",
    excerpt: "Looking for ways to improve my React application's performance...",
    votes: 27,
    answers: 5,
    tags: ["react", "performance", "optimization"],
    author: "perfmaster",
    date: "4 days ago"
  }
];

export const mockUsers = [
  { id: 1, name: "developer123", reputation: 1250 },
  { id: 2, name: "cssmaster", reputation: 890 },
  { id: 3, name: "jslearner", reputation: 456 },
  { id: 4, name: "reactdev", reputation: 2100 },
  { id: 5, name: "perfmaster", reputation: 1678 }
];

export const mockTags = [
  { name: "react", count: 1234 },
  { name: "javascript", count: 2156 },
  { name: "css", count: 987 },
  { name: "hooks", count: 543 },
  { name: "performance", count: 421 },
  { name: "async", count: 765 }
];
