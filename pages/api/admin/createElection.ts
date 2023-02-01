import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/prisma";
import isAdmin from "@utils/isAdmin";
import { getToken } from "next-auth/jwt";
import ClassData from "@interfaces/classData";
import { base64ToBuffer } from "@utils/base64";

interface RequestType extends NextApiRequest {
  body: {
    active: boolean;
    classes: ClassData[];
    name: string;
    timeInterval: {
      startDate: string;
      endDate: string;
    };
  };
}

export default async function handler(req: RequestType, res: NextApiResponse) {
  if (req.method != "POST") {
    res.status(404).json({ error: "Method not allowed" });
    return;
  }

  const jwt = await getToken({ req });

  if (!jwt || !isAdmin(jwt.email as string)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { active, classes, name, timeInterval } = req.body;

  if (!classes || !name || !timeInterval) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  if (active) {
    await prisma.election.updateMany({
      where: {
        active: true,
      },
      data: {
        active: false,
      },
    });
  }

  const election = await prisma.election.create({
    data: {
      active,
      title: name,
      startDate: new Date(timeInterval.startDate),
      endDate: new Date(timeInterval.endDate),
      Classes: {
        create: classes.map((c) => ({
          name: c.name,
          Content: {
            create: {
              candidateName: c.candidateName,
              candidateImage: base64ToBuffer(c.candidateImage),
              adjective: c.adjective,
              shortIntroduction: c.shortIntroduction,
              description: c.description,
              instagram: c.instagram,
              managers: c.managers,
            },
          },
        })),
      },
    },
  });

  res.status(200).json({ election });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};
