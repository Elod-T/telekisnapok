import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/prisma";
import { getToken } from "next-auth/jwt";
import ClassData from "@interfaces/classData";
import { base64ToBuffer } from "@utils/base64";

interface RequestType extends NextApiRequest {
  body: {
    classId: string;
    data: Partial<ClassData>;
  };
}

export default async function handler(req: RequestType, res: NextApiResponse) {
  if (req.method != "PATCH") {
    res.status(404).json({ error: "Method not allowed" });
    return;
  }

  const jwt = await getToken({ req });

  if (!jwt) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { classId, data } = req.body;

  if (!classId || !data) {
    res.status(400).json({ error: "Missing data" });
    return;
  }

  const _class = await prisma.class.findUnique({
    where: {
      id: classId,
    },
    include: {
      Content: true,
    },
  });

  if (!_class) {
    res.status(404).json({ error: "Class not found" });
    return;
  }

  if (!_class.Content?.managers.includes(jwt.email as string)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const managedClass = await prisma.content.update({
    where: {
      classId: _class.id,
    },
    data: {
      ...data,
      candidateImage: data.candidateImage
        ? base64ToBuffer(data.candidateImage)
        : undefined,
    },
  });

  res.status(200).json(managedClass);
}
