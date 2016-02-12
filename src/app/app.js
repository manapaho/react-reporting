/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
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
import Button from 'react-toolbox/lib/button';
import ToolboxApp from 'react-toolbox/lib/app';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Link from 'react-toolbox/lib/link';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import FontIcon from 'react-toolbox/lib/font_icon';

/**
 * Import styles.
 */
import style from './style';

/**
 * Import Internationalization.
 */
import {IntlProvider, FormattedMessage} from 'react-intl';

/**
 * The component.
 */
class App extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired
  };

  // Expected context properties.
  static contextTypes = {
    setLocale: React.PropTypes.func
  };

  // Initialize the component.
  constructor(props) {
    super(props);
  }

  // Invoked once, both on the client and server, immediately before the initial rendering occurs.
  // If you call setState within this method,
  // render() will see the updated state and will be executed only once despite the state change.
  componentWillMount() {
    // Update the application language if necessary.
    this.context.setLocale(this.props.viewer.language);
  }

  // Invoked when a component is receiving new props. This method is not called for the initial render.
  // Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
  // The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.viewer.language !== this.props.viewer.language) {
      // Update the application language if necessary.
      this.context.setLocale(nextProps.viewer.language);
    }
  }

  // User wants to change his language setting.
  handleLanguageChange = (eventKey) => {
    // We commit the update directly to the database.
    // This will cause the viewer.language property to change
    // which will then result in a call to setLocale.
    Relay.Store.commitUpdate(new UpdatePersonMutation({
      person: this.props.viewer,
      language: eventKey
    }), {
      onFailure: (err) => {
        // TODO: Deal with it!
        console.log(err);
      },
      onSuccess: (result) => {
        // TODO: Maybe nothing todo here?
      }
    });
  };

  // Render the component.
  render() {
    // Get the properties.
    const {viewer, children} = this.props;
    //
    let className = style.root;
    // Return the component UI.
    return (
      <ToolboxApp className={className}>
        <AppBar className={style.appbar}>
          <FontIcon value='insert_chart' />
          <a href="/home">Reporting</a>
          <Navigation />
        </AppBar>
        <Navigation type='vertical' className={style.navigation}>
          <IndexLinkContainer to={`/`}>
            <Link label='Home' icon='home'/>
          </IndexLinkContainer>
          <IndexLinkContainer to={`/users`}>
            <Link label='Data' icon='description'/>
          </IndexLinkContainer>
          <IndexLinkContainer to={`/charts`}>
            <Link label='Charts' icon='insert_chart'/>
          </IndexLinkContainer>
          <IndexLinkContainer to={`/users`}>
            <Link label='Reports' icon='format_shapes'/>
          </IndexLinkContainer>
        </Navigation>
        <div className={style.features}>
          {children}
        </div>
      </ToolboxApp>
    );
  }
}

/**
 * The data container.
 */
export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
              fragment on User {
                language
              }`
  }
});
