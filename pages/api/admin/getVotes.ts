import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/prisma";
import { getToken } from "next-auth/jwt";
import isAdmin from "@utils/isAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") {
    res.status(404).json({ error: "Method not allowed" });
    return;
  }

  const jwt = await getToken({ req });

  if (!jwt || !isAdmin(jwt.email as string)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { electionId } = req.query;

  if (!electionId) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  if (typeof electionId != "string") {
    res.status(400).json({ error: "Invalid parameters" });
    return;
  }

  const classes = await prisma.class.findMany({
    where: {
      electionId,
    },
    include: {
      Votes: true,
    },
  });

  res.status(200).json(classes);
}
