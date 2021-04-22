'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Publication.init({
    title: { type: DataTypes.STRING, validate: { notEmpty: true } },
    body: { type: DataTypes.TEXT, validate: { notEmpty: true } },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    authorId: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: {
          tableName: 'authors',
          schema: 'public'
        },
        // This is the column name of the referenced model
        key: 'id',
      },
      allowNull: false,
      field: 'author_id'
    },
  }, {
    sequelize,
    tableName: 'publications'
  });
  return Publication;
};