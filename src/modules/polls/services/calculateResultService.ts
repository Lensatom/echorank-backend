export function calculateResultsService({
  votes,
  sectionId,
  round = 1,
  prevOptionCounts = {},
  totalOptionCounts
}: {
  votes:any,
  sectionId: string,
  round?: number,
  prevOptionCounts?: Record<string, number>,
  totalOptionCounts: number
}) {
  const optionCounts = optionVoteCounts({
    votes,
    sectionId: sectionId,
    round,
    prevOptionCounts
  });
  const lowestOptions = getLowestCountOption(optionCounts);
  const redistributedOptionCounts = redistributeVotes({
    votes,
    sectionId: sectionId,
    eliminated: lowestOptions,
    round,
    prevOptionCounts: optionCounts
  });

  if (round === totalOptionCounts) {
    return redistributedOptionCounts;
  }

  return calculateResultsService({
    votes,
    sectionId,
    round: round + 1,
    prevOptionCounts: redistributedOptionCounts,
    totalOptionCounts
  });
}


function optionVoteCounts({
  votes,
  sectionId,
  round,
  prevOptionCounts
}: {
  votes: any;
  sectionId: string;
  round: number;
  prevOptionCounts?: Record<string, number>;
}) {
  const optionCounts: Record<string, number> = prevOptionCounts || {};
  for (let i = 0; i < votes.length; i++) {
    const indexOfSection = votes[i].sections.findIndex((sec: any) => sec.sectionId.toString() === sectionId);
    if (indexOfSection === -1) continue;
    const option = votes[i].sections[indexOfSection].ranking[round - 1];
    optionCounts[option] = (optionCounts[option] || 0) + 1;
  }
  return optionCounts;
}


function getLowestCountOption(optionCounts: Record<string, number>): string[] {
  let lowestCount = Infinity;
  const lowestOptions: string[] = [];
  for (const [option, count] of Object.entries(optionCounts)) {
    if (count < lowestCount) {
      lowestCount = count;
      lowestOptions.length = 0;
      lowestOptions.push(option);
    } else if (count === lowestCount) {
      lowestOptions.push(option);
    }
  }
  return lowestOptions;
}


function redistributeVotes({
  votes,
  sectionId,
  eliminated,
  round,
  prevOptionCounts
}: {
  votes: any;
  sectionId: string;
  eliminated: string[];
  round: number;
  prevOptionCounts: Record<string, number>;
}) {
  const optionCounts: Record<string, number> = prevOptionCounts;
  for (let i = 0; i < votes.length; i++) {
    const indexOfSection = votes[i].sections.findIndex((sec: any) => sec.sectionId.toString() === sectionId);
    if (eliminated.includes(votes[i].sections[indexOfSection].ranking[round - 1])) {
      if (indexOfSection === -1) continue;
      const option = votes[i].sections[indexOfSection].ranking[round];
      optionCounts[option] = (optionCounts[option] || 0) + 1;
    }
  }
  return optionCounts;
}