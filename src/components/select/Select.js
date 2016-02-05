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
import _ from 'lodash';

/**
 * Import Components.
 */

/**
 * Import UX components.
 */
import Input from 'react-toolbox/lib/input';
import Card from 'react-toolbox/lib/card';
import Popover from '../popover/popover';

/**
 * Import styles.
 */
import style from './style';

/**
 * The component.
 */
export default class Select extends React.Component {
  // Expected properties.
  static propTypes = {
    label: React.PropTypes.string,
    options: React.PropTypes.array.isRequired,
    selectedOptions: React.PropTypes.array,
    optionKey: React.PropTypes.string.isRequired,
    optionValue: React.PropTypes.string.isRequired,
    optionTemplate: React.PropTypes.func,
    onFilterChange: React.PropTypes.func,
    onSelectionChange: React.PropTypes.func
  };

  // Initialize the component.
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      value: '',
      filteredOptions: []
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
    console.log(this.state.value);
    this.updateState(nextProps, this.state.value);
  }

  // Calculate the new state.
  updateState(props, value) {
    // Calculate the filtered options to be listed.
    var filteredOptions = props.options.filter((option) => {
      // Don't show any options if the filter is empty.
      if (value.length < 1) {
        return false;
      }
      // Don't show options that are already selected.
      if (-1 !== props.selectedOptions.findIndex((selectedOption) => {
          return option[props.optionKey] == selectedOption[props.optionKey];
        })) {
        return false;
      }
      // Show all options if they've been filtered by the parent already.
      if (props.onFilterChange) {
        return true;
      }
      // Only show options that start with the filter value.
      return _.startsWith(option[props.optionValue].toLowerCase(), value.toLowerCase());
    });
    // Render the component.
    this.setState({
      value: value,
      filteredOptions: filteredOptions,
      active: filteredOptions.length > 0
    });
  }

  // The filter value has changed.
  handleInputChange = (name, value) => {
    // Call the parent component if possible.
    if (this.props.onFilterChange) {
      // Update the filter value on the current state.
      Object.assign(this.state, {value: value});
      // The next call must result in a call to componentWillReceiveProps.
      this.props.onFilterChange(value);
    } else {
      // Otherwise just update the state.
      this.updateState(this.props, value);
    }
  };

  handleInputBlur(name, e) {
    setTimeout(() => {
        var relatedTarget = document.activeElement;
        if (relatedTarget) {
          console.log(relatedTarget);
          //this.setState({deactivate: true});
        }
      }
    );
  };

  // Call the parent component with the new selection.
  handleOptionClick(option, e) {
    console.log('Y ' + Date.now());
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange([...this.props.selectedOptions, option]);
    }
    this.refs.filter.focus();
  }

  // Close the popover when it was clicked outside the content area.
  handlePopoverClick(e) {
    this.setState({active: false});
    this.refs.filter.focus();
  }

  // Render an option.
  optionTemplate(option, index) {
    // Use the parent's option template if possible.
    if (this.props.optionTemplate) {
      return (
        <li key={index} tabIndex="0"
            onClick={this.handleOptionClick.bind(this, option)}>{this.props.optionTemplate(option, index)}</li>
      );
    } else {
      // Otherwise simply render the option's value.
      return (
        <li key={index} tabIndex="0"
            onClick={this.handleOptionClick.bind(this, option)}>{option[this.props.optionValue]}</li>
      );
    }
  }

  // Render the component.
  render() {
    // Get the properties.
    const {label} = this.props;
    //
    let className = style.root;
    // Return the component UI.
    return (
      <div className={className}>
        <Input ref='filter'
               type='text'
               label={label}
               value={this.state.value}
               onChange={this.handleInputChange.bind(this, 'input')}
               onBlur={this.handleInputBlur.bind(this, 'input')}/>
        {(() => {
          if (this.state.active) {
            return (
              <Popover parent={this} className={style.popover}
                       onClick={this.handlePopoverClick.bind(this)}>
                <Card onClick={(e)=>{e.preventDefault();e.stopPropagation();}}>
                  <ul>
                    {this.state.filteredOptions.map((option, index) => {
                      return this.optionTemplate(option, index);
                    }, this)}
                  </ul>
                </Card>
              </Popover>
            );
          }
        })()}
      </div>
    );
  }
}
