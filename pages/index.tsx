import prisma from "@utils/prisma";
import { NextPage } from "next";
import Home from "./[year]/index";
import ElectionWithClassesAndContent from "@interfaces/electionWithClassesAndContent";

interface HomeProps {
  elections: ElectionWithClassesAndContent[];
}

const HomePage: NextPage<HomeProps> = ({ elections }) => {
  return (
    <Home year={new Date().getFullYear().toString()} elections={elections} />
  );
};

export default HomePage;

export async function getStaticProps() {
  // JSON.parse(JSON.stringify()) is used to remove the Prisma object, because date cannot be serialized
  const elections = JSON.parse(
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
