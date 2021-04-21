"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Author.hasMany(models.Publication, {
        foreignKey: "authorId"
      });
    }
  }
  Author.init(
    {
      firstName: {
        type: DataTypes.STRING,
        field: "first_name",
        validate: { notEmpty: true },
      },
      lastName: {
        type: DataTypes.STRING,
        field: "last_name",
        validate: { notEmpty: true },
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true, notNull: true },
      },
      birthDate: {
        type: DataTypes.DATE,
        field: "birthdate",
        validate: { isDate: true },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    },
    {
      sequelize,
      tableName: "authors"
    }
  );
  return Author;
};
