'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PartySetNo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PartySetNo.init({
    partyId: DataTypes.INTEGER,
    setNo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PartySetNo',
  });

  PartySetNo.removeAttribute('id');
  return PartySetNo;
};