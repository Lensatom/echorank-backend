interface VoteSection {
  sectionId: string;
  ranking: string[];
  groups: { [groupName: string]: string[] };
}

interface Vote {
  _id: string;
  sections: VoteSection[];
}

interface SectionResult {
  sectionId: string;
  winner: string | null;
  rounds: Round[];
  totalVotes: number;
}

interface Round {
  roundNumber: number;
  counts: Record<string, number>; // changed: use a serializable object for counts
  eliminated: string[];
  quota: number;
}

interface ProcessedVote {
  ranking: string[];
  weight: number;
}

export const calculateResultsService = (votes: any) => {
  // changed: return a plain object
  const sectionResults: Record<string, SectionResult> = {};
  const votesBySection = groupVotesBySection(votes);
  for (const [sectionId, sectionVotes] of votesBySection) {
    const result = calculateSectionResult(sectionId, sectionVotes);
    sectionResults[sectionId] = result;
  }
  return sectionResults;
};

function groupVotesBySection(votes: Vote[]): Map<string, VoteSection[]> {
  const sectionMap = new Map<string, VoteSection[]>();
  
  for (const vote of votes) {
    for (const section of vote.sections) {
      let sections = sectionMap.get(section.sectionId);
      if (!sections) {
        sections = [];
        sectionMap.set(section.sectionId, sections);
      }
      sections.push(section);
    }
  }
  
  return sectionMap;
}

function calculateSectionResult(sectionId: string, votes: VoteSection[]): SectionResult {
  const totalVotes = votes.length;
  const rounds: Round[] = [];
  const allOptions = getAllOptions(votes);
  const activeVotes = preprocessVotes(votes);
  const eliminatedOptions = new Set<string>();
  const quota = Math.floor(totalVotes / 2) + 1;
  
  let roundNumber = 1;
  const maxRounds = allOptions.size;
  
  while (roundNumber <= maxRounds && eliminatedOptions.size < allOptions.size - 1) {
    const counts = countFirstPreferences(activeVotes, eliminatedOptions);
    
    const round: Round = {
      roundNumber,
      counts,
      eliminated: [],
      quota
    };
    
    const winner = findMajorityWinner(counts, quota);
    if (winner) {
      rounds.push(round);
      return {
        sectionId,
        winner,
        rounds,
        totalVotes
      };
    }
    
    const toEliminate = findOptionsToEliminate(counts, eliminatedOptions, allOptions);
    if (toEliminate.length === 0) {
      rounds.push(round);
      return {
        sectionId,
        winner: findPluralityWinner(counts),
        rounds,
        totalVotes
      };
    }
    
    for (const opt of toEliminate) {
      eliminatedOptions.add(opt);
    }
    round.eliminated = toEliminate;
    rounds.push(round);
    
    roundNumber++;
  }
  
  return {
    sectionId,
    winner: null,
    rounds,
    totalVotes
  };
}

function preprocessVotes(votes: VoteSection[]): ProcessedVote[] {
  const processed = new Array<ProcessedVote>(votes.length);
  
  for (let i = 0; i < votes.length; i++) {
    processed[i] = {
      ranking: expandRankingWithGroups(votes[i].ranking, votes[i].groups),
      weight: 1
    };
  }
  
  return processed;
}

function expandRankingWithGroups(ranking: string[], groups: { [groupName: string]: string[] }): string[] {
  const expanded: string[] = [];
  
  for (const item of ranking) {
    const groupIds = groups[item];
    if (groupIds) {
      for (const id of groupIds) {
        expanded.push(id);
      }
    } else {
      expanded.push(item);
    }
  }
  
  return expanded;
}

function getAllOptions(votes: VoteSection[]): Set<string> {
  const options = new Set<string>();
  
  for (const vote of votes) {
    for (const item of vote.ranking) {
      if (!vote.groups[item]) {
        options.add(item);
      }
    }
    
    for (const groupIds of Object.values(vote.groups)) {
      for (const id of groupIds) {
        options.add(id);
      }
    }
  }
  
  return options;
}

function countFirstPreferences(votes: ProcessedVote[], eliminated: Set<string>): Record<string, number> {
  const counts: Record<string, number> = {};
  
  for (const vote of votes) {
    for (const option of vote.ranking) {
      if (!eliminated.has(option)) {
        counts[option] = (counts[option] || 0) + vote.weight;
        break;
      }
    }
  }
  
  return counts;
}

function findMajorityWinner(counts: Record<string, number>, quota: number): string | null {
  for (const [option, count] of Object.entries(counts)) {
    if (count >= quota) {
      return option;
    }
  }
  return null;
}

function findPluralityWinner(counts: Record<string, number>): string | null {
  let maxCount = 0;
  let winner: string | null = null;
  
  for (const [option, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      winner = option;
    }
  }
  
  return winner;
}

function findOptionsToEliminate(
  counts: Record<string, number>,
  eliminated: Set<string>,
  allOptions: Set<string>
): string[] {
  const activeCounts: Record<string, number> = {};
  
  for (const [option, count] of Object.entries(counts)) {
    if (!eliminated.has(option)) {
      activeCounts[option] = count;
    }
  }
  
  for (const option of allOptions) {
    if (!eliminated.has(option) && activeCounts[option] === undefined) {
      activeCounts[option] = 0;
    }
  }
  
  const activeOptions = Object.keys(activeCounts);
  if (activeOptions.length <= 1) {
    return [];
  }
  
  const minCount = Math.min(...Object.values(activeCounts));
  const toEliminate = activeOptions.filter((opt) => activeCounts[opt] === minCount);
  
  if (toEliminate.length >= activeOptions.length) {
    return [toEliminate[0]];
  }
  
  return toEliminate;
}