import Loading from "@components/loading";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import prisma from "@utils/prisma";
import ClassPage from "@components/classPage";
import ClassWithElectionAndContent from "@interfaces/classWithElectionAndContent";

interface ClassProps {
  classes: ClassWithElectionAndContent[];
}

const Class: NextPage<ClassProps> = ({ classes }) => {
  const { status } = useSession();
  const router = useRouter();
  const { className, year } = router.query;

  const classData = classes.find(
    (c) =>
      c.name === className &&
      new Date(c.Election?.startDate).getFullYear().toString() === year
  );

  if (status == "unauthenticated") {
    signIn("azure-ad");
    return null;
  }

  if (status == "loading" || !className || !year) return <Loading />;

  return (
    <ClassPage
      className={className.toString()}
      content={classData?.Content!}
      year={year as string}
    />
  );
};

export default Class;

export async function getStaticProps() {
  // JSON.parse(JSON.stringify()) is used to remove the Prisma object, because date cannot be serialized
  const classes = JSON.parse(
    JSON.stringify(
      await prisma.class.findMany({
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
          Election: true,
        },
      })
    )
  );

  return {
    props: {
      classes,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const classes = await prisma.class.findMany({
    include: {
      Election: true,
    },
  });

  const paths = classes.map((c) => {
    return {
      params: {
        year: c.Election?.startDate.getFullYear().toString(),
        className: c.name,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}
