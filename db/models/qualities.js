'use strict';
module.exports = (sequelize, DataTypes) => {
  const Qualities = sequelize.define('Qualities', {
    name: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {});
  Qualities.associate = function(models) {
    // associations can be defined here
  };
  return Qualities;
};