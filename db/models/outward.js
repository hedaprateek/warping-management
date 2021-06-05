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

      Outward.hasOne(models.Parties, {
        foreignKey: 'id',
        sourceKey: 'weaverId',
        as: "WeaverDetails",
      });

      Outward.hasOne(models.Qualities, {
        foreignKey: 'id',
        sourceKey: 'qualityId',
        as: "QualityDetails",
      });
    }
  };
  Outward.init({
    setNo: DataTypes.INTEGER,
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