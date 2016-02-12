/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import GraphQL types.
 */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

/**
 * Import Relay helpers.
 */
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromArraySlice,
  cursorToOffset,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

/**
 * Import GraphQL Helpers.
 */
import {
  nodeInterface,
  nodeField,
  registerType,
  paginationDefinitions,
  paginationArgs,
  paginationFromArraySlice
} from './ql';

/**
 * Import GraphQL Types.
 */
import qlChartColumn from './qlChartColumn'

/**
 * Import Database Access.
 */
import db from '../database/db';

/**
 * Create the associations.
 */

/**
 * Create the GraphQL Type.
 */
// Type name and global id.
const typeName = 'Chart';

// Type creation.
var qlChart = new GraphQLObjectType({
  name: typeName,
  description: 'A chart',
  fields: () => ({
    id: globalIdField(typeName),
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    chartColumns: {
      type: new GraphQLList(qlChartColumn),
      resolve(dbChart){
        return dbChart.getChartColumns();
      }
    }
  }),
  interfaces: [nodeInterface]
});

// Type registration.
registerType({
  name: typeName,
  getByID: (id)=>db.Chart.findOne({where: {id: id}}),
  dbType: db.Chart.Instance,
  qlType: qlChart
});

// Type export.
export default qlChart;
