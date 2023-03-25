import { ResponseContent } from "@/model/Common";
import { UserData } from "@/model/User";
import sequelize, { UserSequelize } from "@/server/db";
import TokenManager from "@/util/token";
import { NextApiRequest, NextApiResponse } from "next";

interface ValidateResponseContent extends ResponseContent {
  user?: UserData;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidateResponseContent>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Invalid request method" });
  }

  const account = await TokenManager.getAccountFromToken(req);

  if (account) {
    try {
      await sequelize.authenticate();
      const user = await UserSequelize.findOne({ where: { account } });

      if (user) {
        return res.status(200).json({
          user: {
            name: user.dataValues.name ?? user.dataValues.account,
            account: user.dataValues.account,
            id: user.dataValues.id,
          },
        });
      }
      return res.status(400).json({ message: "User not exist" });
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      return res
        .status(500)
        .json({ message: "Unable to connect to the database:" });
    }
  }

  return res.status(401).json({ message: "Invalid credentials" });
}
