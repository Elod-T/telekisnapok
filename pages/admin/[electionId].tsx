import Layout from "@components/layout";
import Loading from "@components/loading";
import VoteChart from "@components/voteChart";
import VotesByTimeChart from "@components/votesByTimeChart";
import { Election } from "@prisma/client";
import isAdmin from "@utils/isAdmin";
import axios from "axios";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ElectionPage: NextPage = () => {
  const { data: session, status } = useSession();
  const [election, setElection] = useState<Election>();

  useEffect(() => {
    const id = window.location.pathname.split("/")[2];
    axios
      .get(`/api/admin/getElection?electionId=${id}`)
      .then((res) => {
        setElection(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (session && !isAdmin(session?.user?.email)) {
    return <h1 className="text-center text-4xl mt-40">Nincs jogosultságod</h1>;
  }

  if (status === "unauthenticated") {
    signIn("azure-ad");
    return null;
  }

  if (status === "loading" || !election) {
    return <Loading />;
  }

  return (
    <Layout
      title={"Telekis Napok " + new Date().getFullYear()}
      description={"Telekis Napok " + new Date().getFullYear()}
    >
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

export default ElectionPage;
