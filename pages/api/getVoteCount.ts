import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") {
    res.status(404).json({ error: "Method not allowed" });
    return;
  }

  const { electionId } = req.query;

  if (!electionId || typeof electionId != "string") {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  const election = await prisma.election.findUnique({
    where: {
      id: electionId,
    },
  });

  if (!election) {
    res.status(404).json({ error: "Election not found" });
    return;
  }

  const classes = await prisma.class.findMany({
    where: {
      electionId,
    },
  });

  const votes = await prisma.vote.count({
    where: {
      classId: {
        in: classes.map((c) => c.id),
      },
    },
  });

  res.status(200).json({ votes });
}
