import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CountDown from "./countDown";

interface Content {
  name: string;
  description: string;
  candidateName: string;
}

interface ClassContentsProps {
  voteBegin: Date;
  voteEnd: Date;
  year?: number;
  contentData: Content[];
}

const ClassContents: NextPage<ClassContentsProps> = ({
  voteBegin,
  voteEnd,
  year,
  contentData,
}) => {
  voteBegin = new Date(voteBegin);
  voteEnd = new Date(voteEnd);

  const [content, setContent] = useState<Content[]>();
  const router = useRouter();

  useEffect(() => {
    contentData.sort(() => Math.random() - 0.5);
    setContent(contentData);
  }, [contentData]);

  function loadVotePage(className: string) {
    router.push(
      (year ? `/${year}` : `/${new Date().getFullYear()}`) + `/${className}`
    );
  }

  let state: "before" | "during" | "after";
  if (new Date() < voteBegin) {
    state = "before";
  } else if (new Date() > voteEnd) {
    state = "after";
  } else {
    state = "during";
  }

  if (!content) return <></>;

  return (
    <div className="w-screen bg-base-200 py-24">
      <div className="w-full md:w-2/3 mx-auto">
        <h2 id="classes" className="text-3xl font-bold text-center my-10">
          Szavazz a kedvenc osztályodra!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-8 gap-y-4">
          {content.map((item, index) => (
            <div key={index} className="bg-base-200 px-10 py-4 rounded-lg">
              <h3 className="text-2xl font-bold">
                {item.candidateName} és a {item.name}
              </h3>
              <p className="py-6">{item.description}</p>
              <button
                className="btn btn-secondary mt-4 flex flex-row gap-2"
                disabled={new Date() < voteBegin}
                onClick={() => loadVotePage(item.name)}
              >
                {state === "during" && "Szavazok"}
                {state === "after" && "Megnézem"}
                {state === "before" && "Szavazás"}
                {state === "before" && <CountDown style="simple" />}
                {state === "before" && "múlva"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassContents;
