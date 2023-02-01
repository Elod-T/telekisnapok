import { Election } from "@prisma/client";

export default function getActiveElection(elections: Election[]): Election {
  elections.sort((a: Election, b: Election) => {
    return a.startDate.getTime() - b.startDate.getTime();
  });
  return elections[0];
}
