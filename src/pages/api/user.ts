import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function user(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await prisma.users.findMany();
  res.status(200).json(users);
}
