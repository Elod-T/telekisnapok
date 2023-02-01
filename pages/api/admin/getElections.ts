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

  const elections = await prisma.election.findMany();

  res.status(200).json(elections);
}
