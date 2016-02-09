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
import C3 from '../../../components/c3/c3';

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
import Card from 'react-toolbox/lib/card';
import Select from '../../../components/select/select';
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
      dimensionsAndMeasures: [
        {id: 0, type: 'measure', name: 'Spent'},
        {id: 1, type: 'dimension', name: 'Sport'},
        {id: 2, type: 'measure', name: 'Volume'},
        {id: 3, type: 'dimension', name: 'Trade Area'},
        {id: 4, type: 'measure', name: 'Tax'}],
      selectedColumns: [],
      selectedRows: []
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

  handleColumnsSelectionChanged = (selectedOptions) => {
    this.setState({selectedColumns: selectedOptions})
  };

  handleRowsSelectionChanged = (selectedOptions) => {
    this.setState({selectedRows: selectedOptions})
  };

  dimensionsAndMeasuresOptionTemplate = (option, index) => {
    return (
      <div key={option.id}>
        {(() => {
          if (option.type == 'measure') {
            return <FontIcon value='timeline'/>;
          }
          else {
            return <FontIcon value='linear_scale'/>;
          }
        })()}
        <span style={{verticalAlign: 'super'}}>{option.name}</span>
      </div>
    );
  };

  // Render the component.
  render() {
    let chartConfig = {
      data: {
        columns: [
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 50, 20, 10, 40, 15, 25]
        ],
        axes: {
          data2: 'y2'
        },
        types: {
          data2: 'bar' // ADD
        }
      },
      axis: {
        y: {
          label: {
            text: 'Y Label',
            position: 'outer-middle'
          }
        },
        y2: {
          show: true,
          label: {
            text: 'Y2 Label',
            position: 'outer-middle'
          }
        }
      },
      subchart: {
        show: true
      }
    };

    // Get the properties.
    const {viewer, children} = this.props;
    //
    let className = style.root;
    // Return the component UI.
    return (
      <div className={className}>
        <Card className={style.data}>
          <div className={style.dataRow}>
            <Select className={style.selectColumns}
                    label="Columns"
                    options={this.state.dimensionsAndMeasures}
                    selectedOptions={this.state.selectedColumns}
                    optionKey="id"
                    optionValue="name"
                    optionTemplate={this.dimensionsAndMeasuresOptionTemplate}
                    onSelectionChange={this.handleColumnsSelectionChanged}/>
            <span className={style.selectedColumns}>
              {this.state.selectedColumns.map((option, index) => {
                return (
                  <Button key={option.id} icon='close' label={option.name}/>
                );
              })}
            </span>
          </div>
          <div className={style.dataRow}>
            <Select className={style.selectRows}
                    label="Rows"
                    options={this.state.dimensionsAndMeasures}
                    selectedOptions={this.state.selectedRows}
                    optionKey="id"
                    optionValue="name"
                    optionTemplate={this.dimensionsAndMeasuresOptionTemplate}
                    onSelectionChange={this.handleRowsSelectionChanged}/>
            <span className={style.selectedRows}>
              {this.state.selectedRows.map((option, index) => {
                return (
                  <Button key={option.id} icon='close' label={option.name}/>
                );
              })}
            </span>
          </div>
        </Card>
        <br/>
        <Card className={style.graph}>
          <C3 config={chartConfig} element='testchart' type='pie'/>
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
