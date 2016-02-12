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
import qlDataColumn from './qlDataColumn'

/**
 * Import Database Access.
 */
import db from '../database/db';
import tp from 'tedious-promises';
import {TYPES} from 'tedious';

/**
 * Create the associations.
 */

/**
 * Create the Input Argument Types.
 */
var qlDataColumnInput = new GraphQLInputObjectType({
  name: 'DataColumnInput',
  fields: () => ({
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
  })
});

/**
 * Create the GraphQL Type.
 */
// Type name and global id.
const typeName = 'DataSource';

// Type creation.
var qlDataSource = new GraphQLObjectType({
  name: typeName,
  description: 'A data source to be used with charts',
  fields: () => ({
    id: globalIdField(typeName),
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    dataColumns: {
      type: new GraphQLList(qlDataColumn),
      resolve(dbDataSource){
        return dbDataSource.getDataColumns();
        //db.dataColumn.findAll({where: {dataSourceId: dbDataSource.id}});
      }
    },
    data: {
      type: GraphQLString,
      args: {
        dataColumns: {
          type: new GraphQLList(qlDataColumnInput)
        }
      },
      resolve(dbDataSource, {dataColumns}, {rootValue: {session}}){

        tp.setConnectionConfig({
          userName: 'reporting',
          password: 'reporting',
          server: 'SVBW01NZVM'
        });

        return tp
          .sql("select top(1) * from [Datamart_Spend].[tableau].[VW_GET_SPEND_PERFORMANCE]")
          .execute()
          .then((results)=> {
            console.log(results);
            return JSON.stringify(results);
          })
          .fail((err)=> {
            console.log(err);
            return err;
          });
      }
    }
  }),
  interfaces: [nodeInterface]
});

// Type registration.
registerType({
  name: typeName,
  getByID: (id)=>db.DataSource.findOne({where: {id: id}}),
  dbType: db.DataSource.Instance,
  qlType: qlDataSource
});

// Type export.
export default qlDataSource;
