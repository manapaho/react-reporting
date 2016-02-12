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
import qlDataColumn from './qlDataColumn';
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
const typeName = 'ChartColumn';

// Type creation.
var qlChartColumn = new GraphQLObjectType({
  name: typeName,
  description: 'A source column of chart',
  fields: () => ({
    id: globalIdField(typeName),
    name: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    dataColumns: {
      type: new GraphQLList(qlDataColumn),
      resolve(dbChartColumn){
        return dbChartColumn.getDataColumns();
      }
    }
  }),
  interfaces: [nodeInterface]
});

// Type registration.
registerType({
  name: typeName,
  getByID: (id)=>db.ChartColumn.findOne({where: {id: id}}),
  dbType: db.ChartColumn.Instance,
  qlType: qlChartColumn
});

// Type export.
export default qlChartColumn;
