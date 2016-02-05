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

/**
 * Import Components.
 */

/**
 * Import UX components.
 */
import Input from 'react-toolbox/lib/input';

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
class Chart extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  // Expected context properties.
  static contextTypes = {};

  // Initialize the component.
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null
    }
  }

  // Invoked once, both on the client and server, immediately before the initial rendering occurs.
  // If you call setState within this method,
  // render() will see the updated state and will be executed only once despite the state change.
  componentWillMount() {
  }

  // Invoked when a component is receiving new props. This method is not called for the initial render.
  // Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
  // The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
  componentWillReceiveProps(nextProps, nextContext) {

  }

  handleNewChartClick = () => {

  };

  dataSources = [{name: 'aber'}, {name: 'bieber'}, {name: 'gulloi'}];
  handleSelectDataSource = (value) => {
    console.log(value);
    this.setState({dataSource: value});
  };

  dataSourceDropDownItemTemplate(item) {
    return (
      <div>{item.name}</div>
    )
  }

  // Render the component.
  render() {
    // Get the properties.
    const {viewer, children} = this.props;
    //
    let className = style.root;
    // Return the component UI.
    return (
      <div className={className}>
        <Card className={style.data}>
          <Dropdown auto={false} className={style.top}
                    source={this.dataSources}
                    onChange={this.handleSelectDataSource}
                    label="Choose a Data Source"
                    template={this.dataSourceDropDownItemTemplate}
                    value={this.state.dataSource}
          />
        </Card>
      </div>
    );
  }
}

/**
 * The data container.
 */
export default Relay.createContainer(Chart, {
  fragments: {
    viewer: () => Relay.QL`
              fragment on User {
                language
              }`
  }
});