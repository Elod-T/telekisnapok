import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") {
    res.status(404).json({ error: "Method not allowed" });
    return;
  }

  const jwt = await getToken({ req });

  if (!jwt) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const managedClasses = await prisma.class.findMany({
    where: {
      Content: {
        managers: {
          has: jwt.email,
        },
      },
    },
    include: {
      Content: {
        select: {
          managers: true,
          candidateName: true,
          adjective: true,
          shortIntroduction: true,
          description: true,
          instagram: true,
        },
      },
    },
  });

  if (!managedClasses) {
    res.status(404).json({ error: "No managed classes found" });
    return;
  }

  res.status(200).json(managedClasses);
}
