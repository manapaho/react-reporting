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
  var model = sequelize.define('User', {
      // Declare the properties.
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    // Declare the associations.
    {
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          model.belongsToMany(models.DataSource, {through: models.User_DataSource});
          model.belongsToMany(models.Chart, {through: models.User_Chart});
        }
      }
    }
  );
  // Create the model.
  return model;
}
