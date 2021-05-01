'use strict';
module.exports = (sequelize, DataTypes) => {
  const WarpingQualities = sequelize.define('WarpingQualities', {
    warpId: DataTypes.INTEGER,
    qualityId: DataTypes.INTEGER,
    count: DataTypes.REAL,
    usedYarn: DataTypes.REAL
  }, {});
  WarpingQualities.associate = function(models) {
    // associations can be defined here
  };
  return WarpingQualities;
};