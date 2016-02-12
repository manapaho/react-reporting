/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import data creation helpers.
 */
import _ from 'lodash';
import Faker from 'faker';
import q from 'q';

/**
 * Import Database Access.
 */
import db from '../data/database/db';

import task from './lib/task';

/**
 * Create/override database with fake data.
 */
export default task('create/override fake database', async () => {
  await db.sequelize.sync({force: true})
    .then(() => {
      // Create 10 persons.
      return q.all(_.times(10, () => {
        return createUser();
      }));
    });
});

function createUser() {
  return db.User.create({
    firstName: Faker.name.firstName(),
    lastName: Faker.name.lastName(),
    email: Faker.internet.email(),
    language: 'en'
  }).then(user => {
    return q.all(_.times(2, (n) => {
      return createDataSource(user, n);
    }));
  });
}

function createDataSource(user, n) {
  return user.createDataSource({
    name: Faker.name.firstName(),
    description: 'Faker.lorem.sentence'
  }).then(dataSource => {
    return createDataColumns(dataSource);
  });
}

var columns = {
  fact_id: 16,
  language_id: 'mp_can_01',
  account_num: 'SV_SCRUB_ACC_19',
  global_company_id: 29000144,
  account_first_six: '100019',
  account_last_four: '0019',
  cardholder_full_name: 'Linda Harvey',
  account_city: 'Springfield',
  account_country: 'United States',
  issuer_name: 'Big Bank 1',
  card_type: 2,
  card_description: 'Purchasing Card',
  currency_code: 'USD',
  currency_description: 'US Dollar',
  merchant_category_description: 'Motor Freight Carriers',
  merchant_category_group_description: 'Freight/Courier/Warehouse Svcs',
  transaction_type_description: 'Purchase',
  employee_num: 'SV_SCRUB_EMP_57',
  employee_full_name: 'Linda Harvey',
  posting_date: '',
  transaction_date: '',
  reporting_hierarchy_id: 5,
  source_amount: 12.58,
  billing_amount: 12.58,
  billing_amount_tax: 0,
  aud_amount: 11.99,
  cad_amount: 12.41,
  chf_amount: 11.58,
  dkk_amount: 71.35,
  eur_amount: 9.59,
  gbp_amount: 7.78,
  hkd_amount: 97.51,
  inr_amount: 683.38,
  isk_amount: 1618.79,
  jpy_amount: 1095.29,
  myr_amount: 38.16,
  nok_amount: 69.9,
  nzd_amount: 15.14,
  sek_amount: 81.63,
  sgd_amount: 15.39,
  usd_amount: 12.58,
  zar_amount: 107.34,
  try_amount: 22.36,
  aud_amount_tax: 0,
  cad_amount_tax: 0,
  chf_amount_tax: 0,
  dkk_amount_tax: 0,
  eur_amount_tax: 0,
  gbp_amount_tax: 0,
  hkd_amount_tax: 0,
  inr_amount_tax: 0,
  isk_amount_tax: 0,
  jpy_amount_tax: 0,
  myr_amount_tax: 0,
  nok_amount_tax: 0,
  nzd_amount_tax: 0,
  sek_amount_tax: 0,
  sgd_amount_tax: 0,
  usd_amount_tax: 0,
  zar_amount_tax: 0,
  try_amount_tax: 0,
  posting_month: 'January',
  posting_year: '2013' };

function createDataColumns(dataSource) {
  for(var key in columns) {
    dataSource.createDataColumn({
      name: key.toUpperCase(),
      key: key,
      aggregation: key.indexOf('amount') !== -1 ? 'SUM' : null
    });
  }
}
