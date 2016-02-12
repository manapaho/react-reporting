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
import {Button, IconButton} from 'react-toolbox/lib/button';
import {Card, CardTitle, CardText} from 'react-toolbox/lib/card';
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

var chartTypes = [{
  name: 'Pie Chart',
  chartColumns: [{
    name: 'Slice Names',
    type: 'group',
    dataColumns: []
  }, {
    name: 'Slice Values',
    type: 'value',
    dataColumns: []
  }]
}, {
  name: 'Bar Chart',
  chartColumns: [{
    name: 'Groups',
    type: 'group',
    dataColumns: []
  }, {
    name: 'Values',
    type: 'value',
    dataColumns: []
  }]
}];

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
      chartType: null,
      chartColumns: [],
      dataSource: null,
      // todo remove following
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

  handleChartTypeSelectionChanged = (selectedOption) => {
    this.setState({chartType: selectedOption});
  };

  handleDataSourceSelectionChanged = (selectedOption) => {
    this.setState({dataSource: selectedOption});
  };

  handleChartColumnSelectionChanged = (chartColumn, selectedOptions) => {
    chartColumn.dataColumns = selectedOptions;
    this.forceUpdate();
  };


  handleColumnsSelectionChanged = (selectedOptions) => {
    this.setState({selectedColumns: selectedOptions});
    this.props.relay.setVariables({columns: selectedOptions});
  };

  handleRowsSelectionChanged = (selectedOptions) => {
    this.setState({selectedRows: selectedOptions})
  };

  chartTypeOptionTemplate = (option, index) => {
    return (
      <div key={option.name}>{option.name}</div>
    );
  };

  dataSourceOptionTemplate = (option, index) => {
    return (
      <div key={option.id}>{option.name}</div>
    );
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

  handleDataColumnDeleteClick(chartColumn, dataColumn){
    chartColumn.dataColumns.splice(chartColumn.dataColumns.indexOf(dataColumn), 1);
    this.forceUpdate();
  };

  renderChartColumns() {
    if (!this.state.chartType || !this.state.chartType.chartColumns) {
      return;
    }
    return this.state.chartType.chartColumns.map((chartColumn)=> {
      return (
        <div key={chartColumn.name}>
          <Select className={style.selectColumns}
                  label={chartColumn.name}
                  options={this.state.dataSource.dataColumns}
                  selectedOptions={chartColumn.dataColumns}
                  optionKey="key"
                  optionValue="name"
                  optionTemplate={this.dimensionsAndMeasuresOptionTemplate}
                  onSelectionChange={this.handleChartColumnSelectionChanged.bind(this, chartColumn)}/>
          <div className={style.selectedColumns}>{chartColumn.dataColumns.map((dataColumn)=> {
            return (
              <div>
                <IconButton icon='close' accent onClick={this.handleDataColumnDeleteClick.bind(this, chartColumn, dataColumn)}/>
                <span className={style.selectedColumn}>{dataColumn.name}</span>
              </div>
            );
          })}
          </div>
        </div>
      );
    });
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
        <Card className={style.dataCard}>
          <CardTitle
            avatar="https://placeimg.com/80/80/animals"
            title="Chart"
            subtitle="Setup Chart Properties"/>
          <Select className={style.selectColumns}
                  label="Data Source"
                  options={this.props.viewer.dataSources ? this.props.viewer.dataSources : []}
                  optionKey="id"
                  optionValue="name"
                  optionTemplate={this.dataSourceOptionTemplate}
                  onSelectionChange={this.handleDataSourceSelectionChanged}/>
          <div>{this.state.dataSource ? this.state.dataSource.name : ''}</div>
          <Select className={style.selectColumns}
                  label="Chart Type"
                  options={chartTypes}
                  optionKey="name"
                  optionValue="name"
                  optionTemplate={this.chartTypeOptionTemplate}
                  onSelectionChange={this.handleChartTypeSelectionChanged}/>
          <div>{this.state.chartType ? this.state.chartType.name : ''}</div>
          {(() => {
            if (this.state.dataSource) {
              return this.renderChartColumns();
            }
          })()}
        </Card>
        <Card className={style.chartCard}>
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
  initialVariables: {
    dataColumns: null
  },
  fragments: {
    viewer: () => Relay.QL`
              fragment on User {
                dataSources {
                  id
                  name
                  dataColumns {
                    key
                    name
                  }
                  data(dataColumns: $dataColumns)
                }
                charts {
                  chartColumns {
                    name
                    dataColumns {
                      key
                      name
                    }
                  }
                }
              }`
  }
});
