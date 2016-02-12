/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Create the database entity.
 */
export default function (sequelize, DataTypes) {
  // Define the model.
  var model = sequelize.define('DataSource', {
      // Declare the properties.
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    // Declare the associations.
    {
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          model.belongsToMany(models.User, {through: models.User_DataSource});
          model.hasMany(models.DataColumn);
        }
      }
    }
  );
  // Create the model.
  return model;
}
