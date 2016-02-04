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
import Overlay from 'react-toolbox/lib/overlay';

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
    parent: React.PropTypes.object,
    children: React.PropTypes.node
  };

  // Initialize the component.
  constructor(props) {
    super(props);
    this.state = {}
  }

  // Invoked once, both on the client and server, immediately before the initial rendering occurs.
  // If you call setState within this method,
  // render() will see the updated state and will be executed only once despite the state change.
  componentWillMount() {
  }

  componentDidMount() {
    this.parent = ReactDOM.findDOMNode(this.props.parent);
  }

  // Invoked when a component is receiving new props. This method is not called for the initial render.
  // Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
  // The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
  componentWillReceiveProps(nextProps, nextContext) {
  }

  // Render the component.
  render() {
    // Wait until we have a valid reference to the parent element.
    if (!this.parent) {
      return;
    }
    // Get the properties.
    const {viewer, children} = this.props;
    // Get the parents viewport offset.
    var viewportOffset = this.parent.getBoundingClientRect();
    //
    let className = style.root;
    // Return the component UI.
    return (
      <Overlay invisible={false}>
        <div style={{position: 'absolute', left: viewportOffset.left, top: viewportOffset.bottom}}>
          {this.props.children}
        </div>
      </Overlay>
    );
  }
}
