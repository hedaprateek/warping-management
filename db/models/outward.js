'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Outward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Outward.hasMany(models.OutwardBags, {
        foreignKey: 'outwardId',
        sourceKey: 'id',
        as: "bags",
      });
    }
  };
  Outward.init({
    partyId: DataTypes.INTEGER,
    weaverId: DataTypes.INTEGER,
    qualityId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    emptyConeWt: DataTypes.REAL,
    emptyBagWt: DataTypes.REAL,
    netWt: DataTypes.REAL
  }, {
    sequelize,
    modelName: 'Outward',
  });
  return Outward;
};