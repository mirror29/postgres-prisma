import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/src/lib/prisma";

export default async function addUser(_req: NextApiRequest, _res: NextApiResponse) {
  const user = await prisma.users.create({
    data: {
      walletAddress: "elsa@prisma.io",
      name: "Elsa Prisma",
    },
  });
  const users = await prisma.users.findMany();
  _res.status(200).json(users);
}
