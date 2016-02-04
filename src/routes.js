/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from './app/app';
import Home from './app/home/home';
import Users from './app/users/users';
import Charts from './app/charts/charts';
import Chart from './app/charts/chart/chart';

/**
 * The application's GraphQL root query.
 */
const appQueries = {viewer: () => Relay.QL`query { viewer }`};

/**
 * The application's routing structure.
 */
export default (
  <Route
    path="/"
    component={App}
    queries={appQueries}
    >
    <IndexRoute
      component={Home}
      queries={appQueries}
      prepareParams={() => ({status: 'any'})}
      />
    <Route
      path="/users"
      component={Users}
      queries={appQueries}
    />
    <Route
      path="/charts"
      component={Charts}
      queries={appQueries}
    />
    <Route
      path="/charts/:id"
      component={Chart}
      queries={appQueries}
    />
  </Route>
);
