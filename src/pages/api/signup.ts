import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import sequelize, { UserSequelize } from "../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Invalid request method" });
  }
  try {
    await sequelize.authenticate();

    const { account, password, name } = req.body as {
      account: string;
      password: string;
      name?: string;
    };

    if (!account || !password) {
      return res.status(400).json({ message: "Account or Password is Empty" });
    }

    const user = await UserSequelize.findOne({ where: { account } });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);

    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      console.error("Can not get secret key");
      return res.status(500).json("There may be some wrong");
    }

    const newUser = await UserSequelize.create({
      account,
      password: hashedPassword,
      name: name ?? account,
    });

    const token = jwt.sign({ id: newUser.dataValues.id }, secretKey, {
      expiresIn: "1h",
    });

    return res.status(201).json({ token });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
