const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid"); // Importing UUID generator
const sequelize = require("../util/database"); // Adjust the path based on your project structure
const User = require("./userModel");
const ForgotPasswordRequests = sequelize.define("ForgotPasswordRequests", {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Generates a new UUID by default
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER, // Assuming user ID is an integer
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Active by default
      allowNull: false,
    },
  },
  {
      timestamps: false  
  });
  
  User.hasMany(ForgotPasswordRequests, { foreignKey: "userId" }); // One User can have multiple requests
  ForgotPasswordRequests.belongsTo(User, { foreignKey: "userId" }); // Many requests belong to one User
  
  module.exports = ForgotPasswordRequests;