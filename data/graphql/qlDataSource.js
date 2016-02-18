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

        if (dataColumns == null || dataColumns.length == 0) {
          return '';
        }

        tp.setConnectionConfig({
          userName: 'reporting',
          password: 'reporting',
          server: 'SVBW01NZVM'
        });

        var groups = [];
        var aggregations = [];
        dataColumns.forEach((dataColumn)=> {
          if (dataColumn.aggregation) {
            aggregations.push(dataColumn);
          } else {
            groups.push(dataColumn);
          }
        });

        var query = 'SELECT TOP(1000) ' +
          [
            ...groups.map((dataColumn)=> {
              return dataColumn.key
            }),
            ...aggregations.map((dataColumn)=> {
              return dataColumn.aggregation + '(' + dataColumn.key + ') AS ' + dataColumn.key
            })
          ].join(',') +
          ' FROM [Datamart_Spend].[tableau].[VW_GET_SPEND_PERFORMANCE] ' +
          ' WHERE language_id = \'mp_eng_01\' and reporting_hierarchy_id = 5 ';

        if (groups.length > 0) {
          query += ' GROUP BY ' +
            groups.map((dataColumn)=> {
              return dataColumn.key
            }).join(',');
          query += ' ORDER BY ' +
            groups.map((dataColumn)=> {
              return dataColumn.key
            }).join(',');
        }

        console.log(query);

        return tp
          .sql(query)
          .execute()
          .then((results)=> {
            //console.log(results);
            return JSON.stringify({data: results});
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
