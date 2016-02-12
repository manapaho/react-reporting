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
  var model = sequelize.define('ChartColumn', {
      // Declare the properties.
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    // Declare the associations.
    {
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          model.belongsTo(models.Chart);
          model.belongsToMany(models.DataColumn, {through: models.ChartColumn_DataColumn});
        }
      }
    }
  );
  // Create the model.
  return model;
}
