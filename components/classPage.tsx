import Layout from "@components/layout";
import { Content, Election } from "@prisma/client";
import axios from "axios";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useReward } from "react-rewards";
import Loading from "./loading";

interface ClassPageProps {
  className: string;
  content: Content;
  year: string;
}

const ClassPage: NextPage<ClassPageProps> = ({ className, content, year }) => {
  const { status } = useSession();
  const [election, setElection] = useState<Election>();

  const { reward, isAnimating } = useReward("vote-reward", "confetti");

  useEffect(() => {
    axios
      .get("/api/getCurrentElection")
      .then((res) => {
        setElection(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (status == "unauthenticated") {
    signIn("azure-ad");
    return null;
  }
  if (status == "loading" || !election) return <Loading />;

  function castVote() {
    if (!election) return;

    axios
      .post("/api/castVote", {
        electionId: election.id,
        choice: className,
      })
      .then(() => {
        reward();
      })
      .catch((err) => {
        if (err.response.data.error === "Already voted") {
          alert("Már szavaztál!");
          return;
        }

        alert(`Hiba történt! ${err.response.data.error}`);
      });
  }

  return (
    <Layout
      title={`${content.candidateName} és a ${className} | ${year}`}
      description={`A ${className} oldala`}
    >
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              {content.candidateName} és a {className}, a {content.adjective}
            </h1>
            <p className="py-6">{content.description}</p>
            <button
              className="btn btn-primary"
              onClick={castVote}
              disabled={isAnimating}
            >
              <span id="vote-reward"></span>
              Szavazok
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClassPage;
