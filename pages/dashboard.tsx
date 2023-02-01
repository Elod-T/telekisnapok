import Layout from "@components/layout";
import Loading from "@components/loading";
import VoteChart from "@components/voteChart";
import VotesByTimeChart from "@components/votesByTimeChart";
import { Election } from "@prisma/client";
import axios from "axios";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

const Dashboard: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [election, setElection] = useState<Election>();

  useEffect(() => {
    axios.get("/api/getCurrentElection").then((res) => {
      const { id, endDate } = res.data;

      if (new Date(endDate) > new Date()) {
        router.push("/");
        return;
      }

      axios
        .get(`/api/admin/getElection?electionId=${id}`)
        .then((res) => {
          setElection(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [router]);

  if (status === "unauthenticated") {
    signIn("azure-ad");
  }

  if (status === "loading" || !election) {
    return <Loading />;
  }

  return (
    <Layout
      title={"Telekis Napok " + new Date().getFullYear()}
      description={"Telekis Napok " + new Date().getFullYear()}
    >
      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight * 2}
      />
      <div className="mt-40 bg-base-100">
        <div className="w-[95%] lg:w-4/5 mx-auto rounded-lg p-2">
          <h1 className="text-4xl text-center mb-10">
            <span className="font-bold">{election.title}</span> szavazás
          </h1>

          <div className="mb-40">
            <VoteChart election={election} />
            <VotesByTimeChart election={election} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
