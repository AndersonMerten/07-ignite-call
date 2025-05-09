import { getgoogleOAuthToken } from "@/lib/google";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const username = String(req.query.username);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "user does not exist" });
  }

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string(),
    date: z.string().datetime(),
  });
  const { name, email, observations, date } = createSchedulingBody.parse(
    req.body
  );

  console.log("Date received from frontend (local time):", date);

  // Interpreta o horário como local e converte para UTC
  const schedulingDate = dayjs(date).local().utc().startOf("hour");

  console.log("Scheduling Date (processed UTC):", schedulingDate.toISOString());

  if (schedulingDate.isBefore(dayjs().utc())) {
    return res.status(400).json({
      message: "date is in the past.",
    });
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  });

  if (conflictingScheduling) {
    return res.status(400).json({
      message: "There is another scheduling at the same time.",
    });
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  });

  return res.status(201).json(scheduling);
}
