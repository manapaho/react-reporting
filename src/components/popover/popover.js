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
import ClassNames from 'classnames';

/**
 * Import Components.
 */

/**
 * Import UX components.
 */

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
    className: React.PropTypes.string,
    hidden: React.PropTypes.bool,
    parent: React.PropTypes.object,
    children: React.PropTypes.node,
    onClick: React.PropTypes.func
  };

  // Initialize the component.
  constructor(props) {
    super(props);
  }

  // Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
  // At this point in the lifecycle, you can access any refs to your children
  // (e.g., to access the underlying DOM representation).
  // The componentDidMount() method of child components is invoked before that of parent components.
  // If you want to integrate with other JavaScript frameworks, set timers using setTimeout or setInterval,
  // or send AJAX requests, perform those operations in this method.
  componentDidMount() {
    // Get the parent's DOM element to calculate the position.
    this.parent = ReactDOM.findDOMNode(this.props.parent);
    // Get the root element.
    this.app = document.querySelector('[data-react-toolbox="app"]') || document.body;
    // Create the component element.
    this.node = document.createElement('div');
    // Initialize it.
    this.node.setAttribute('data-react-toolbox', 'overlay');
    // Append it to the root element.
    this.app.appendChild(this.node);
    // Render the component.
    this.handleRender();
  }

  // Invoked immediately after the component's updates are flushed to the DOM.
  // This method is not called for the initial render.
  // Use this as an opportunity to operate on the DOM when the component has been updated.
  componentDidUpdate() {
    this.handleRender();
  }

  // Invoked immediately before a component is unmounted from the DOM.
  // Perform any necessary cleanup in this method,
  // such as invalidating timers or cleaning up any DOM elements that were created in componentDidMount.
  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.node);
    this.app.removeChild(this.node);
  }

  // Render the component.
  render() {
    return React.DOM.noscript();
  }

  // Render the created node.
  handleRender() {
    // Get the parent element's absolute position.
    var {left, top, right, bottom, width, height } = this.parent.getBoundingClientRect();
    // This conditionally combines the css classes for the element.
    const className = ClassNames(style.root, {
      [style.hidden]: this.props.hidden
    }, this.props.className);
    // Render the node and its children.
    ReactDOM.render(
      <div className={className} onClick={this.props.onClick}>
        <div style={{position: 'fixed', left: left, top: bottom}}>
          {this.props.children}
        </div>
      </div>
      , this.node);
  }
}
