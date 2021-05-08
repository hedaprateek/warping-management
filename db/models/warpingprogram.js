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
  }, {});
  WarpingProgram.associate = function(models) {
    WarpingProgram.hasMany(models.WarpingQualities, {
      foreignKey: 'warpId',
      sourceKey: 'id',
      as: "qualities",
    });
  };
  return WarpingProgram
  ;
};