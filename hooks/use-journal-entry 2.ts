export function useJournalEntry() {
  // TODO: Implement entry saving to API
  return {
    saveEntry: async (content: string) => {
      console.log("Saving entry:", content);
    }
  };
}