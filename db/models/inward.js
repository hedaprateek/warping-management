'use strict';
module.exports = (sequelize, DataTypes) => {
  const Inward = sequelize.define('Inward', {
    date: DataTypes.DATEONLY,
    partyId: DataTypes.INTEGER,
    gatepass: DataTypes.STRING,
    qualityId: DataTypes.INTEGER,
    qtyBags: DataTypes.INTEGER,
    qtyCones: DataTypes.INTEGER,
    lotNo: DataTypes.STRING,
    netWt: DataTypes.REAL
  }, {});
  Inward.associate = function(models) {
    Inward.hasOne(models.Parties, {
      foreignKey: 'id',
      sourceKey: 'partyId',
      as: "PartyDetails",
    });
    Inward.hasOne(models.Qualities, {
      foreignKey: 'id',
      sourceKey: 'qualityId',
      as: "QualityDetails",
    });
  };
  return Inward;
};