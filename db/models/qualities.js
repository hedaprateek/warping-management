'use strict';
module.exports = (sequelize, DataTypes) => {
  const Qualities = sequelize.define('Qualities', {
    name: DataTypes.STRING,
    minCount: DataTypes.REAL,
    maxCount: DataTypes.REAL,
  }, {});
  Qualities.associate = function(models) {
    // associations can be defined here
  };
  return Qualities;
};