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
const typeName = 'DataColumn';

// Type creation.
var qlDataColumn = new GraphQLObjectType({
  name: typeName,
  description: 'A column of a data source',
  fields: () => ({
    id: globalIdField(typeName),
    key: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    aggregation: {
      type: GraphQLString
    }
  }),
  interfaces: [nodeInterface]
});

// Type registration.
registerType({
  name: typeName,
  getByID: (id)=>db.DataColumn.findOne({where: {id: id}}),
  dbType: db.DataColumn.Instance,
  qlType: qlDataColumn
});

// Type export.
export default qlDataColumn;
