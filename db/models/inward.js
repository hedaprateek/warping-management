'use strict';
module.exports = (sequelize, DataTypes) => {
  const Inward = sequelize.define('Inward', {
    data: DataTypes.STRING,
    partyId: DataTypes.INTEGER,
    gatepass: DataTypes.STRING,
    qualityId: DataTypes.INTEGER,
    qtyBags: DataTypes.INTEGER,
    qtyCones: DataTypes.INTEGER,
    logNo: DataTypes.STRING,
    netWt: DataTypes.REAL
  }, {});
  Inward.associate = function(models) {
    // associations can be defined here
  };
  return Inward;
};