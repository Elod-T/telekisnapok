import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/prisma";
import { Election } from "@prisma/client";
import getActiveElection from "@utils/getAcitveElection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") {
    res.status(404).json({ error: "Method not allowed" });
    return;
  }

  let elections = await prisma.election.findMany({
    where: {
      active: true,
    },
  });

  res.status(200).json(getActiveElection(elections));
}
