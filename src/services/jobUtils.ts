
// Extract keywords from job applications
export const extractKeywords = (applications: any[]) => {
  // Extract keywords from positions
  const positionWords = applications
    .flatMap(app => app.position.toLowerCase().split(/\s+/))
    .filter(word => word.length > 3) // Filter out short words
    .reduce((acc: Record<string, number>, word: string) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});
  
  // Get top keywords (sorted by frequency)
  return Object.entries(positionWords)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};
