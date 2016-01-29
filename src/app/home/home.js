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
import {FormattedNumber, FormattedMessage} from 'react-intl';

/**
 * The component.
 */
class Home extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  // Expected context properties.
  static contextTypes = {
    storeSession: React.PropTypes.func,
    restoreSession: React.PropTypes.func
  };

  // Initialize the component.
  constructor(props) {
    super(props);
    // Default state.
    this.state = {
    };
  }

  // Invoked once, both on the client and server, immediately before the initial rendering occurs.
  // If you call setState within this method,
  // render() will see the updated state and will be executed only once despite the state change.
  componentWillMount() {
    // Restore the previous session if any.
    this.context.restoreSession(this.props.location.pathname, this);
  }

  // Invoked when a component is receiving new props. This method is not called for the initial render.
  // Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
  // The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
  componentWillReceiveProps(nextProps, nextContext) {
    // Update the state.
    this.setState({
    });
    // Update the session store for this page.
    this.context.storeSession(this.props.location.pathname, {
      relay: {}
    });
  }

  // Render the component.
  render() {
    // Calculate stuff.
    return (
      <div></div>
    );
  }
}

/**
 * The data container.
 */
export default Relay.createContainer(Home, {
  initialVariables: {
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        firstName
        lastName
        email
      }`
  }
});
