import { Election } from "@prisma/client";
import { NextPage } from "next";
import Link from "next/link";
import VoteChart from "./voteChart";

interface ElectionCardProps {
  election: Election;
}

const ElectionCard: NextPage<ElectionCardProps> = ({ election }) => {
  return (
    <Link
      className="card bg-base-200 w-screen md:w-96"
      href={`/admin/${election.id}`}
    >
      <div className="card-body">
        <h2 className="card-title">{election.title}</h2>
        <p>Kezdődik: {new Date(election.startDate).toLocaleDateString()}</p>
        <p>Véget ér: {new Date(election.endDate).toLocaleDateString()}</p>
        <VoteChart election={election} />
      </div>
    </Link>
  );
};

export default ElectionCard;
