import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Election } from "@prisma/client";
import ElectionCard from "@components/electionCard";
import Layout from "@components/layout";
import isAdmin from "@utils/isAdmin";
import Loading from "@components/loading";
import Link from "next/link";

const AdminDashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const [elections, setElections] = useState<Election[]>();

  useEffect(() => {
    axios
      .get("/api/admin/getElections")
      .then((res) => {
        setElections(res.data);
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

  if (status === "loading" || !elections) {
    return <Loading />;
  }

  return (
    <Layout
      title={`Telekis Napok ${new Date().getFullYear()} | Admin Felület`}
      description="Telekis Napok Szavazás Admin Felület"
    >
      <div className="mt-40 mb-[400px] flex flex-col">
        <Link
          className="btn btn-primary mb-10 w-40 mx-auto"
          href="/admin/create"
        >
          Új szavazás
        </Link>
        <div className="md:w-4/5 mx-auto rounded-lg md:p-2 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {elections.map((election) => (
            <div key={election.id}>
              <ElectionCard election={election} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
