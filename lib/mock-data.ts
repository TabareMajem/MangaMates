export const mockUser = {
  id: "mock-user-1",
  name: "Demo User",
};

export const mockJournalEntries = [
  {
    id: "entry-1",
    content: "Today was a productive day...",
    createdAt: new Date().toISOString(),
  },
  {
    id: "entry-2",
    content: "Feeling grateful for...",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const mockUserStats = {
  totalEntries: 150,
  averageWordsPerEntry: 250,
  moodDistribution: {
    happy: 45,
    neutral: 65,
    sad: 40
  },
  topTopics: ['anime', 'manga', 'life', 'friends'],
  writingStreak: 7,
  lastEntryDate: new Date()
};
