import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/prisma";
import { getToken } from "next-auth/jwt";

interface RequestType extends NextApiRequest {
  query: {
    classId: string;
  };
}

export default async function handler(req: RequestType, res: NextApiResponse) {
  if (req.method != "GET") {
    res.status(404).json({ error: "Method not allowed" });
    return;
  }

  const jwt = await getToken({ req });

  if (!jwt) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { classId } = req.query;

  if (!classId) {
    res.status(400).json({ error: "Missing classId" });
    return;
  }

  const managedClass = await prisma.class.findFirst({
    where: {
      id: classId,
      Content: {
        managers: {
          has: jwt.email,
        },
      },
    },
    include: {
      Content: true,
    },
  });

  if (!managedClass) {
    res.status(404).json({ error: "No managed classes found" });
    return;
  }

  res.status(200).json(managedClass);
}
