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
import ClassNames from 'classnames';

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
      focused: false,
      active: false,
      value: '',
      filteredOptions: [],
      focusedOption: -1
    }
  }

  // Invoked once, both on the client and server, immediately before the initial rendering occurs.
  // If you call setState within this method,
  // render() will see the updated state and will be executed only once despite the state change.
  componentWillMount() {
    this.updateState(this.props, this.state.value);
  }

  // Invoked when a component is receiving new props. This method is not called for the initial render.
  // Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
  // The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
  componentWillReceiveProps(nextProps, nextContext) {
    this.updateState(nextProps, this.state.value);
  }

  // TODO cleanup
  componentDidUpdate() {
    setTimeout(()=> {
      var element = ReactDOM.findDOMNode(this.refs.focusedOption);
      if (element && element.offsetParent) {
        var curtop = element.offsetTop;
        var parent = element.offsetParent;
        while (parent && window.getComputedStyle(parent, null)['overflow-y'] != 'auto') {
          curtop += parent.offsetTop;
          parent = parent.offsetParent;
        }
        parent.scrollTop = curtop;
      }
    });
  }

  // Calculate the new state.
  updateState(props, value) {
    // Calculate the filtered options to be listed.
    var filteredOptions = props.options.filter((option) => {
      // Don't show any options if the filter is empty.
      //if (value.length < 1) {
      //  return false;
      //}
      // Don't show options that are already selected.
      if (props.selectedOptions && -1 !== props.selectedOptions.findIndex((selectedOption) => {
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
      active: filteredOptions.length > 0 && this.state.focused,
      focusedOption: this.state.focusedOption < filteredOptions.length ? this.state.focusedOption : -1
    });
  }

  handleInputFocus(name, e) {
    this.setState({focused: true});
  }

  handleInputBlur(name, e) {
    this.setState({focused: false});
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

  // Handle special keys pressed in the input field.
  handleInputKeyDown(name, e) {
    switch (e.keyCode) {
      // TAB
      case 9:
        // Reset the select component.
        this.setState({focused: false, active: false, value: '', focusedOption: -1});
        break;
      // UP
      case 38:
        // Focus the previous option if possible.
        if (this.state.focusedOption > 0) {
          this.setState({focusedOption: this.state.focusedOption - 1});
        }
        break;
      // DOWN
      case 40:
        // Open the options if necessary.
        if (!this.state.active) {
          this.setState({active: true});
        }
        // Focus the next option if possible.
        if (this.state.focusedOption < this.state.filteredOptions.length - 1) {
          this.setState({focusedOption: this.state.focusedOption + 1});
        }
        break;
      // ENTER
      case 13:
        // Select the focused option if possible.
        if (this.state.focusedOption != -1) {
          if (this.props.onSelectionChange) {
            if (this.props.selectedOptions) {
              this.props.onSelectionChange([...this.props.selectedOptions, this.state.filteredOptions[this.state.focusedOption]]);
            } else {
              this.props.onSelectionChange(this.state.filteredOptions[this.state.focusedOption]);
            }
          }
        }
    }
  };

  // Call the parent component with the new selection.
  handleOptionClick(option, e) {
    if (this.props.onSelectionChange) {
      if (this.props.selectedOptions) {
        this.props.onSelectionChange([...this.props.selectedOptions, option]);
      } else {
        this.props.onSelectionChange(option);
      }
    }
    this.refs.filter.focus();
  }

  // Close the popover when it was clicked outside the content area.
  handlePopoverClick(e) {
    this.setState({active: false, value: '', focusedOption: -1});
    this.refs.filter.focus();
  }

  // Render an option.
  optionTemplate(option, index) {
    const className = ClassNames(style.option, {
      [style.focus]: index == this.state.focusedOption
    });
    // Use the parent's option template if possible.
    if (this.props.optionTemplate) {
      return (
        <li key={index} tabIndex="0" className={className}
            ref={index == this.state.focusedOption ? 'focusedOption' : ''}
            onClick={this.handleOptionClick.bind(this, option)}>{this.props.optionTemplate(option, index)}</li>
      );
    } else {
      // Otherwise simply render the option's value.
      return (
        <li key={index} tabIndex="0" className={className}
            ref={index == this.state.focusedOption ? 'focusedOption' : ''}
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
      <div data-react-toolbox='select' className={className}>
        <Input ref='filter'
               type='text'
               label={label}
               value={this.state.value}
               onChange={this.handleInputChange.bind(this, 'input')}
               onKeyDown={this.handleInputKeyDown.bind(this, 'input')}
               onFocus={this.handleInputFocus.bind(this, 'input')}
               onBlur={this.handleInputBlur.bind(this, 'input')}/>
        {(() => {
          if (this.state.active) {
            return (
              <Popover parent={this} className={style.popover}
                       onClick={this.handlePopoverClick.bind(this)}>
                <ul onClick={(e)=>{e.preventDefault();e.stopPropagation();}}>
                  {this.state.filteredOptions.map((option, index) => {
                    return this.optionTemplate(option, index);
                  }, this)}
                </ul>
              </Popover>
            );
          }
        })()}
      </div>
    );
  }
}
