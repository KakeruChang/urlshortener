import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { URLContent, OpenGraphMetadataContent } from "../model/Url";
import { User } from "../model/User";

const sequelize = new Sequelize(
  process.env.DB_NAME ?? "",
  process.env.DB_USER ?? "",
  process.env.DB_PASS,
  {
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

type UserCreateAction = Optional<User, "id">;

export type UserTableContent = Model<User, UserCreateAction>;

const UserSequelize = sequelize.define<UserTableContent>(
  "User",
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    // Other model options go here
  }
);

type URLAttributes = Required<URLContent>;

type URLCreateAction = Optional<URLAttributes, "UserId" | "id">;

export type URLTableContent = Model<URLAttributes, URLCreateAction>;

const UrlSequelize = sequelize.define<URLTableContent>(
  "Url",
  {
    originUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    times: {
      type: DataTypes.INTEGER,
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
  },
  {}
);

export type OpenGraphMetadataTableContent = Model<
  OpenGraphMetadataContent,
  OpenGraphMetadataContent
>;

const OpenGraphMetadataSequelize =
  sequelize.define<OpenGraphMetadataTableContent>(
    "OpenGraphMetadata",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isOrigin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      UrlId: {
        type: DataTypes.INTEGER,
      },
    },
    {}
  );

UserSequelize.hasMany(UrlSequelize);
UrlSequelize.hasOne(OpenGraphMetadataSequelize);

UrlSequelize.belongsTo(UserSequelize, {
  foreignKey: {
    allowNull: true,
    name: "UserId",
  },
  onDelete: "CASCADE",
});
OpenGraphMetadataSequelize.belongsTo(UrlSequelize, { onDelete: "CASCADE" });

sequelize.sync();

export { UserSequelize, UrlSequelize, OpenGraphMetadataSequelize };

export default sequelize;
