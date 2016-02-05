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
import Card from 'react-toolbox/lib/card';
import Select from '../../../components/select/select';

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
      options: [{id: 0, name: 'Bernd'}, {id: 1, name: 'Besen'}, {id: 2, name: 'Wessels'}],
      selectedOptions: [{id: 1, name: 'Besen'}]
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

  handleDataDimensionsFilterChanged = (value) => {
    // TODO change graphql variable to get options from db.
    this.setState({options: this.state.options});
  };

  handleDataDimensionsSelectionChanged = (selectedOptions) => {
    this.setState({selectedOptions: selectedOptions})
  };

  optionTemplate = (option, index) => {
    return (
      <div key={option.id}>{option.name} - {index}</div>
    );
  };

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
          <div>
            {this.state.selectedOptions.map((option, index) => {
              return (
                <span key={option.id}>{option.name}</span>
              );
            })}
          </div>
          <Select label="labello"
                  options={this.state.options}
                  selectedOptions={this.state.selectedOptions}
                  optionKey="id"
                  optionValue="name"
                  optionTemplate={this.optionTemplate}
                  onFilterChange={this.handleDataDimensionsFilterChanged}
                  onSelectionChange={this.handleDataDimensionsSelectionChanged} />
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
