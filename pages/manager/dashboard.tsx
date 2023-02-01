import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "@components/layout";
import Loading from "@components/loading";
import ClassWithContent from "@interfaces/classWithContent";
import { useRouter } from "next/router";
import ClassCard from "@components/classCard";

const ManagerDashboard: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const [classes, setClasses] = useState<ClassWithContent[]>();

  useEffect(() => {
    axios
      .get("/api/manager/getManagedClasses")
      .then((res) => {
        setClasses(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [router]);

  if (status === "unauthenticated") {
    signIn("azure-ad");
    return null;
  }

  if (status === "loading" || !classes) {
    return <Loading />;
  }

  return (
    <Layout
      title={`Telekis Napok ${new Date().getFullYear()} | Admin Felület`}
      description="Telekis Napok Szavazás Admin Felület"
    >
      <div className="mt-40 mb-[400px] flex flex-col">
        <div className="md:w-4/5 mx-auto rounded-lg md:p-2 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((_class) => (
            <div key={_class.id}>
              <ClassCard _class={_class} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;
