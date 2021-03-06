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
import qlDataSource from './qlDataSource';
import qlDataColumn from './qlDataColumn';
import qlChart from './qlChart';

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
const typeName = 'User';

// Type creation.
var qlUser = new GraphQLObjectType({
  name: typeName,
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField(typeName),
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    language: {
      type: GraphQLString
    },
    dataSources: {
      type: new GraphQLList(qlDataSource),
      resolve(dbUser){
        return dbUser.getDataSources();
        // db.DataSource.findAll({where: {DataSourceId: dbDataSource.id}});
      }
    },
    charts: {
      type: new GraphQLList(qlChart),
      resolve(dbUser){
        return dbUser.getCharts();
        // db.DataSource.findAll({where: {DataSourceId: dbDataSource.id}});
      }
    }
  }),
  interfaces: [nodeInterface]
});

// Type registration.
registerType({
  name: typeName,
  getByID: (id)=>db.User.findOne({where: {id: id}}),
  dbType: db.User.Instance,
  qlType: qlUser
});

// Type export.
export default qlUser;
