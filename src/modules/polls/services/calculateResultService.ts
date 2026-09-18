export function calculateResultsService({
  votes,
  sectionId,
  candidates,
  eliminatedCandidates = []
}: {
  votes: any;
  sectionId: string;
  candidates: string[];
  eliminatedCandidates?: string[];
}) {
  const candidateSet = new Set(candidates);
  const optionCounts = optionVoteCounts({
    votes,
    sectionId,
    candidates,
    candidateSet,
    eliminatedCandidates
  });

  const activeCandidates = candidates.filter(candidate => !eliminatedCandidates.includes(candidate));
  if (activeCandidates.length <= 1) {
    return optionCounts;
  }

  const lowestOptions = getLowestCountOption(optionCounts, activeCandidates);
  if (lowestOptions.length === activeCandidates.length) {
    return optionCounts;
  }

  const eliminatedOption = lowestOptions[0];

  return calculateResultsService({
    votes,
    sectionId,
    candidates,
    eliminatedCandidates: [...eliminatedCandidates, eliminatedOption]
  });
}


function optionVoteCounts({
  votes,
  sectionId,
  candidates,
  candidateSet,
  eliminatedCandidates
}: {
  votes: any;
  sectionId: string;
  candidates: string[];
  candidateSet: Set<string>;
  eliminatedCandidates: string[];
}) {
  const optionCounts: Record<string, number> = Object.fromEntries(
    candidates.map(candidate => [candidate, 0])
  );

  for (let i = 0; i < votes.length; i++) {
    const indexOfSection = votes[i].sections.findIndex((sec: any) => sec.sectionId.toString() === sectionId);
    if (indexOfSection === -1) {
      continue;
    }

    const ranking: string[] = votes[i].sections[indexOfSection].ranking;
    const option = ranking.find((candidate: string) => candidateSet.has(candidate) && !eliminatedCandidates.includes(candidate));
    if (!option) {
      continue;
    }

    optionCounts[option] += 1;
  }

  return optionCounts;
}


function getLowestCountOption(optionCounts: Record<string, number>, activeCandidates: string[]): string[] {
  let lowestCount = Infinity;
  const lowestOptions: string[] = [];

  for (const option of activeCandidates) {
    const count = optionCounts[option] ?? 0;
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