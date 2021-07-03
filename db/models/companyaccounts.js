'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyAccounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CompanyAccounts.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    gst: DataTypes.STRING,
    contact: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CompanyAccounts',
  });
  return CompanyAccounts;
};