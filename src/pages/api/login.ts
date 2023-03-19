import { ResponseContent } from "@/model/Common";
import sequelize, { UserSequelize } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface LoginResponseContent extends ResponseContent {
  token?: string;
  name?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponseContent>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Invalid request method" });
  }
  try {
    await sequelize.authenticate();

    const { account, password } = req.body;

    const user = await UserSequelize.findOne({ where: { account } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.dataValues.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      console.error("Can not get secret key");
      return res.status(500).json({ message: "There may be some wrong" });
    }

    const { id, name, account: userAccount } = user.dataValues;

    const token = jwt.sign({ id, account: userAccount }, secretKey, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token, name: name ?? userAccount });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
