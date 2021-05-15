'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OutwardBags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  OutwardBags.init({
    outwardId: DataTypes.INTEGER,
    cones: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    grossWt: DataTypes.REAL
  }, {
    sequelize,
    modelName: 'OutwardBags',
    timestamps: false,
  });
  // OutwardBags.removeAttribute("id");
  return OutwardBags;
};