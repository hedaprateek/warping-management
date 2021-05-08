'use strict';
module.exports = (sequelize, DataTypes) => {
  const WarpingQualities = sequelize.define('WarpingQualities', {
    warpId: DataTypes.INTEGER,
    qualityId: DataTypes.INTEGER,
    ends: DataTypes.INTEGER,
    count: DataTypes.REAL,
    usedYarn: DataTypes.REAL
  }, {
    timestamps: false,
  });
  WarpingQualities.associate = function(models) {
    // associations can be defined here
  };
  WarpingQualities.removeAttribute("id");
  return WarpingQualities;
};
