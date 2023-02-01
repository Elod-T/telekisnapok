/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "@components/layout";
import Loading from "@components/loading";
import ClassWithContent from "@interfaces/classWithContent";
import EditClassComponent from "@components/editClass";
import ClassData from "@interfaces/classData";
import areArraysEqual from "@utils/areArraysEqual";
import { useRouter } from "next/router";
import { useReward } from "react-rewards";

const EditClass: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const { reward, isAnimating } = useReward("edit-reward", "confetti");
  const [_class, setClass] = useState<ClassWithContent>();
  const [classData, setClassData] = useState<ClassData>();

  useEffect(() => {
    const id = window.location.pathname.split("/")[2];
    axios
      .get(`/api/manager/getManagedClass?classId=${id}`)
      .then((res) => {
        setClass(res.data);

        const data: ClassData = {
          name: res.data.name,
          candidateName: res.data.Content.candidateName,
          candidateImage: "",
          managers: res.data.Content.managers,
          adjective: res.data.Content.adjective,
          shortIntroduction: res.data.Content.shortIntroduction,
          description: res.data.Content.description,
          instagram: res.data.Content.instagram,
        };

        setClassData(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (status === "unauthenticated") {
    signIn("azure-ad");
    return null;
  }

  if (status === "loading" || !_class || !classData) {
    return <Loading />;
  }

  function handleSubmit(data: Partial<ClassData>) {
    if (!classData || !_class) return;

    type ChangedValues = { [K in keyof ClassData]?: ClassData[K] };

    const changedValues: ChangedValues = Object.keys(data).reduce(
      (acc, key) => {
        if (
          data[key as keyof ClassData] !== classData[key as keyof ClassData]
        ) {
          (acc as any)[key as keyof ClassData] = data[key as keyof ClassData];
        }
        return acc;
      },
      {}
    );

    if (areArraysEqual(changedValues.managers, classData.managers)) {
      delete changedValues.managers;
    }

    if (Object.keys(changedValues).length === 0) {
      alert("Nincs változás!");
      return;
    }

    axios
      .patch(`/api/manager/updateClassContent`, {
        classId: _class.id,
        data: changedValues,
      })
      .then(() => {
        reward();
        setTimeout(() => {
          router.reload();
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        alert(`Hiba történt! ${err}`);
      });
  }

  return (
    <Layout
      title={`Telekis Napok ${new Date().getFullYear()} | Admin Felület`}
      description="Telekis Napok Szavazás Admin Felület"
    >
      <div className="mt-40 mb-32 md:mb-[500px] bg-base-200 mx-auto md:w-3/4 lg:w-2/3 p-4 md:p-10 rounded-lg flex flex-col gap-y-4">
        <h1 className="text-4xl font-bold text-cener mb-10">
          {_class.Content.candidateName} és a {_class.name}
        </h1>

        <EditClassComponent data={classData} onSave={handleSubmit} />
      </div>
    </Layout>
  );
};

export default EditClass;
