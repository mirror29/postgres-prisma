import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/src/lib/prisma";

export default async function findUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await prisma.users.findMany();
  res.status(200).json(users);
}
