/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Relay from 'react-relay';

/**
 * Import Mutations.
 */

/**
 * Import Components.
 */

/**
 * Import UX components.
 */

/**
 * Import Internationalization.
 */
import {defineMessages, FormattedMessage} from 'react-intl';

/**
 * The component.
 */
class Users extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  // Expected context properties.
  static contextTypes = {
    intl: React.PropTypes.object
  };

  // Initialize the component.
  constructor(props) {
    super(props);
  }

  // Render the component.
  render() {
    // Return the component UI.
    return (
      <div></div>
    );
  }
}

/**
 * The users data container.
 */
export default Relay.createContainer(Users, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        firstName
        lastName
        email
      }`
  }
});
