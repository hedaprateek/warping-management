'use strict';
module.exports = (sequelize, DataTypes) => {
  const Parties = sequelize.define('Parties', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    gstin: DataTypes.STRING,
    contact: DataTypes.STRING,
    isWeaver: DataTypes.STRING
  }, {});
  Parties.associate = function(models) {
    // associations can be defined here
  };
  return Parties;
};