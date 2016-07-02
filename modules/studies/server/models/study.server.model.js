'use strict';

/**
 * Study Schema
 */
module.exports = function(sequelize, DataTypes) {

  var Study = sequelize.define('Study', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null
    },
    content: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Study.belongsTo(models.User, {
          foreignKey: 'userId',
          foreignKeyConstraint: true
        });
      }
    }
  });

  return Study;
};
