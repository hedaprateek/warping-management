'use strict';
module.exports = (sequelize, DataTypes) => {
  const WarpingProgram = sequelize.define('WarpingProgram', {
    design: DataTypes.STRING,
    meter: DataTypes.REAL,
    partyId: DataTypes.INTEGER,
    weaverId: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {});
  WarpingProgram.associate = function(models) {
    // associations can be defined here
  };
  return WarpingProgram
  ;
};