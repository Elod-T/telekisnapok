import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@utils/prisma";
import { io } from "socket.io-client";
import { getToken } from "next-auth/jwt";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO_URL!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(404).json({ error: "Method not allowed" });
    return;
  }

  const token = await getToken({ req });

  if (!token || typeof token.email != "string") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  let { electionId, choice }: { electionId: string; choice: string } = req.body;

  choice = choice.trim().toUpperCase();

  if (!electionId || !choice) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  const election = await prisma.election.findUnique({
    where: {
      id: electionId,
    },
  });

  if (!election) {
    res.status(400).json({ error: "Invalid election" });
    return;
  }

  if (election.endDate < new Date()) {
    res.status(400).json({ error: "Election ended" });
    return;
  }

  if (election.startDate > new Date()) {
    res.status(400).json({ error: "Election not started" });
    return;
  }

  const voted = await prisma.voter.findUnique({
    where: {
      user_electionId: {
        electionId,
        user: token.email,
      },
    },
  });

  if (voted) {
    res.status(400).json({ error: "Already voted" });
    return;
  }

  const _class = await prisma.class.findUnique({
    where: {
      name_electionId: {
        electionId,
        name: choice,
      },
    },
  });

  if (!_class) {
    res.status(400).json({ error: "Invalid class" });
    return;
  }

  await prisma.voter.create({
    data: {
      user: token.email,
      electionId,
    },
  });

  const vote = await prisma.vote.create({
    data: {
      classId: _class.id,
      timeStamp: new Date(),
    },
  });

  if (!vote) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  socket.emit("update", electionId);

  res.status(200).json(vote);
}
