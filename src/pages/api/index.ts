import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const invoicesCount = await prisma.invoice.count();

    res
      .status(200)
      .json({ message: `No total ${invoicesCount} já foram cadastradas 🎉` });
  } catch (error) {
    res.status(500).json({ name: "Internal Server Error" });
  }
}
