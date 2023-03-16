import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { URLContent } from "../model/Url";

const sequelize = new Sequelize(
  "postgres",
  process.env.DB_USER ?? "",
  process.env.DB_PASS,
  {
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

const UserSequelize = sequelize.define(
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
  },
  {
    // Other model options go here
  }
);

type URLAttributes = Required<URLContent>;

const UrlSequelize = sequelize.define<Model<URLAttributes, URLAttributes>>(
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
  },
  {}
);

const OpenGraphMetadataSequelize = sequelize.define(
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
  },
  {}
);

UserSequelize.hasMany(UrlSequelize);
UrlSequelize.hasOne(OpenGraphMetadataSequelize);

UrlSequelize.belongsTo(UserSequelize);
OpenGraphMetadataSequelize.belongsTo(UrlSequelize);

sequelize.sync();

export { UserSequelize, UrlSequelize, OpenGraphMetadataSequelize };

export default sequelize;
