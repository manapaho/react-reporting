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
  var model = sequelize.define('DataColumn', {
      // Declare the properties.
      key: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      aggregation: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    // Declare the associations.
    {
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          model.belongsTo(models.DataSource);
          model.belongsToMany(models.ChartColumn, {through: models.ChartColumn_DataColumn});
        }
      }
    }
  );
  // Create the model.
  return model;
}
