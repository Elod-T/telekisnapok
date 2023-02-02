import { NextPage } from "next";
import { useEffect } from "react";
import updateTimer from "@utils/timer";
import ClassContents from "@components/classContents";
import Hero from "@components/hero";
import Carousel from "@components/carousel";
import TransitionCurve from "@components/transitionCurve";
import TNDescription from "@components/tnDescription";
import TelekiInNumbers from "@components/telekiInNumbers";
import Layout from "@components/layout";
import Loading from "@components/loading";
import prisma from "@utils/prisma";
import { useRouter } from "next/router";
import {
  Class as _Class,
  Content,
  Election as _Election,
} from "@prisma/client";

interface ClassWithContent extends _Class {
  Content: Content;
}

interface ElectionWithClassesAndContent extends _Election {
  Classes: ClassWithContent[];
}

interface HomeProps {
  elections: ElectionWithClassesAndContent[];
  year?: string;
}

const Home: NextPage<HomeProps> = ({ elections, year: propYear }) => {
  const router = useRouter();
  const year = propYear ? propYear : router.query.year;
  const election = elections.find(
    (e) => new Date(e.startDate).getFullYear().toString() === year
  );
  const classData = election?.Classes.map((c) => ({
    name: c.name,
    description: c.Content.description,
    candidateName: c.Content.candidateName,
  }));
  const candidateImages = election?.Classes.map((c) => ({
    name: c.name,
    image: `/api/getCandidateImage?classId=${c.id}`,
    instagram: c.Content.instagram,
  }));
  const classAdjectives = election?.Classes.map((c) => c.Content.adjective);

  useEffect(() => {
    const voteBegin = new Date(election?.startDate!);
    const voteEnd = new Date(election?.endDate!);

    (function timerUpdater() {
      if (new Date() > voteEnd) {
        return;
      }

      if (new Date() > voteBegin) {
        updateTimer(voteEnd);
        setTimeout(timerUpdater, 1000);
        return;
      }

      updateTimer(voteBegin);
      setTimeout(timerUpdater, 1000);
    })();
  }, [election?.startDate, election?.endDate]);

  if (!candidateImages || !election || !classData || !classAdjectives)
    return <Loading />;

  return (
    <Layout
      title={`Telekis Napok ${year} | Székesfehérvári Teleki Blanka Gimnázium`}
      description="A Telekis Napok egy éves iskolai rendezvény az izgalom és a versengés időszaka, mivel a végzős osztályok egy-egy jelöltje indul az iskola királya rangos címért."
    >
      <Carousel candidateImages={candidateImages} />

      <Hero
        voteBegin={new Date(election.startDate)}
        voteEnd={new Date(election.endDate)}
        year={year as string}
        adjectives={classAdjectives}
      />

      <div className="relative z-10 fill-base-100 -mt-[100px] md:mt-[200px] -mb-px">
        <TransitionCurve rotation={0} style={0} />
      </div>

      <TNDescription />
      <TelekiInNumbers />

      <div className="fill-base-200">
        <TransitionCurve rotation={180} style={2} />
      </div>

      <ClassContents
        contentData={classData}
        voteBegin={new Date(election.startDate)}
        voteEnd={new Date(election.endDate)}
      />

      <div className="fill-base-200">
        <TransitionCurve rotation={0} style={1} />
      </div>
    </Layout>
  );
};

export default Home;

export async function getStaticProps() {
  // JSON.parse(JSON.stringify()) is used to remove the Prisma object, because date cannot be serialized
  let elections = JSON.parse(
    JSON.stringify(
      await prisma.election.findMany({
        include: {
          Classes: {
            include: {
              Content: {
                select: {
                  //* the image is too large!
                  managers: true,
                  candidateName: true,
                  adjective: true,
                  shortIntroduction: true,
                  description: true,
                  instagram: true,
                },
              },
            },
          },
        },
      })
    )
  );

  return {
    props: {
      elections,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const elections = await prisma.election.findMany({});

  const paths = elections.map((election) => {
    return { params: { year: election.startDate.getFullYear().toString() } };
  });
  return { paths, fallback: false };
}
