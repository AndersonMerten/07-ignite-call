import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { NextApiRequest, NextApiResponse } from "next";

dayjs.extend(utc);

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const username = String(req.query.username);
  const { date, timezoneOffset } = req.query;

  if (!date || !timezoneOffset) {
    return res.status(400).json({ message: "date or timezone not provided." });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "user does not exist" });
  }

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf("date").isBefore(new Date());

  const timezoneOffsetinHours =
    typeof timezoneOffset === "string"
      ? Number(timezoneOffset) / 60
      : Number(timezoneOffset[0]) / 60;

  const referenceDateTimeZoneOffsetInHours =
    referenceDate.toDate().getTimezoneOffset() / 60;

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] });
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get("day"),
    },
  });

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] });
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i;
    }
  );

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate
          .set("hour", startHour)
          .utc() // Trabalha em UTC
          .toDate(),
        lte: referenceDate
          .set("hour", endHour)
          .utc() // Trabalha em UTC
          .toDate(),
      },
    },
  });

  // Ajusta os horários bloqueados para o horário local no frontend
  const blockedTimesInUTC = blockedTimes.map((blockedTime) => {
    return dayjs(blockedTime.date).utc().hour(); // Trabalha em UTC
  });

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimesInUTC.includes(time); // Compara com UTC

    const isTimeInPast = referenceDate
      .set("hour", time)
      .isBefore(dayjs().utc()); // Compara com UTC

    return !isTimeBlocked && !isTimeInPast;
  });

  return res.json({ possibleTimes, availableTimes });
}
