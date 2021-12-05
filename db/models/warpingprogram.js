'use strict';
module.exports = (sequelize, DataTypes) => {
  const WarpingProgram = sequelize.define('WarpingProgram', {
    design: DataTypes.STRING,
    lassa: DataTypes.REAL,
    cuts: DataTypes.REAL,
    totalMeter: DataTypes.REAL,
    totalEnds: DataTypes.INTEGER,
    partyId: DataTypes.INTEGER,
    weaverId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    filledBeamWt: DataTypes.REAL,
    emptyBeamWt: DataTypes.REAL,
    actualUsedYarn: DataTypes.REAL,
    setNo: DataTypes.INTEGER,
    gatepass: DataTypes.STRING,
  }, {});
  WarpingProgram.associate = function(models) {
    WarpingProgram.hasMany(models.WarpingQualities, {
      foreignKey: 'warpId',
      sourceKey: 'id',
      as: "qualities",
    });
    WarpingProgram.hasOne(models.Parties, {
      foreignKey: 'id',
      sourceKey: 'weaverId',
      as: "WeaverDetails",
    });
  };
  return WarpingProgram
  ;
};