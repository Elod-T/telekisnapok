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

  const { classId } = req.query;

  if (!classId) {
    res.status(400).json({ error: "Missing classId" });
    return;
  }

  const content = await prisma.content.findUnique({
    where: {
      classId: classId as string,
    },
    select: {
      candidateImage: true,
    },
  });

  if (!content) {
    res.status(404).json({ error: "Image not found" });
    return;
  }

  res.setHeader("Content-Type", "image/webp");
  res.setHeader("Cache-Control", "max-age=31536000, immutable");
  res.status(200).send(content.candidateImage);
}
