import { Sequelize, DataTypes } from "sequelize";

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

const UrlSequelize = sequelize.define(
  "Url",
  {
    originURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortenURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userID: {
      type: DataTypes.STRING,
    },
    times: {
      type: DataTypes.INTEGER,
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
    urlID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isOrigin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {}
);
UserSequelize.sync();

// UrlSequelize.belongsTo(UserSequelize, {
//   foreignKey: "userID",
//   targetKey: "id",
// });

UrlSequelize.sync();

// OpenGraphMetadataSequelize.belongsTo(UrlSequelize, {
//   foreignKey: "urlID",
//   targetKey: "id",
// });

OpenGraphMetadataSequelize.sync();

export { UserSequelize, UrlSequelize, OpenGraphMetadataSequelize };

export default sequelize;
