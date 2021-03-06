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
import ClassNames from 'classnames';

/**
 * Import Mutations.
 */

/**
 * Import Components.
 */

/**
 * Import UX components.
 */
import BarChart from '../../../components/charts/bar/bar';
import PieChart from '../../../components/charts/pie/pie';

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
  name: 'Pie',
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
  name: 'Bar',
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
      dataSource: null,
      data: [],
      loading: false
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
    // TODO solve the main issue here!
    if (this.state.dataSource) {
      var nextDataSource = nextProps.viewer.dataSources.find((dataSource)=> {
        return dataSource.__dataID__ == this.state.dataSource.__dataID__;
      });
      if (nextDataSource && nextDataSource.data && typeof nextDataSource.data == 'string' && nextDataSource.data.length > 0) {
        this.setState({data: JSON.parse(nextDataSource.data)});
      }
    }
  }

  // Change the chart type.
  handleChartTypeSelectionChanged = (selectedOption) => {
    this.setState({chartType: selectedOption});
  };

  // Change the data source.
  handleDataSourceSelectionChanged = (selectedOption) => {
    this.setState({dataSource: selectedOption});
  };

  // Change the chart column's data columns.
  handleChartColumnSelectionChanged = (chartColumn, selectedOptions) => {
    chartColumn.dataColumns = selectedOptions;
    this.loadChart();
  };

  // How to display chart type options.
  chartTypeOptionTemplate = (option, index) => {
    return (
      <div key={option.name}>{option.name}</div>
    );
  };

  // How to display data source options.
  dataSourceOptionTemplate = (option, index) => {
    return (
      <div key={option.id}>{option.name}</div>
    );
  };

  // How to display data column options.
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

  // Remove a data column from a chart column.
  handleDataColumnDeleteClick(chartColumn, dataColumn) {
    chartColumn.dataColumns.splice(chartColumn.dataColumns.indexOf(dataColumn), 1);
    this.forceUpdate();
    this.loadChart();
  };

  // Load new chart data.
  loadChart() {
    var queryDataColumns = [];
    this.state.chartType.chartColumns.forEach((cc)=> {
      cc.dataColumns.forEach((dc)=> {
        queryDataColumns.push({
          name: dc.name,
          key: dc.key,
          type: dc.type,
          aggregation: dc.aggregation
        });
      })
    });
    this.props.relay.setVariables({dataColumns: queryDataColumns}, readyState => {
      if (readyState.done || readyState.aborted) {
        this.setState({loading: false});
      } else if (readyState.error) {
        this.setState({loading: false, error: readyState.error});
      } else if (readyState.done == false && readyState.ready == false) {
        this.setState({loading: true, error: readyState.error});
      }
    });
  };

  // How to render chart columns.
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
              <div key={dataColumn.key}>
                <IconButton icon='close' accent
                            onClick={this.handleDataColumnDeleteClick.bind(this, chartColumn, dataColumn)}/>
                <span className={style.selectedColumn}>{dataColumn.name}</span>
              </div>
            );
          })}
          </div>
        </div>
      );
    });
  };

  renderBarChart(){
    return (
      <BarChart data={this.state.data.data}
                groupsKey={(() => {
                      if(this.state.chartType && this.state.chartType.chartColumns.length > 0 && this.state.chartType.chartColumns[0].dataColumns.length > 0)
                        return this.state.chartType.chartColumns[0].dataColumns[0].key;
                        })()}
                seriesKey={(() => {
                      if(this.state.chartType && this.state.chartType.chartColumns.length > 0 && this.state.chartType.chartColumns[0].dataColumns.length > 1)
                        return this.state.chartType.chartColumns[0].dataColumns[1].key;
                        })()}
                valueKey={(() => {
                      if(this.state.chartType && this.state.chartType.chartColumns.length > 1 && this.state.chartType.chartColumns[1].dataColumns.length > 0)
                        return this.state.chartType.chartColumns[1].dataColumns[0].key;
                        })()}
      />
    );
  }

  renderPieChart(){
    return (
      <PieChart data={this.state.data.data}
                namesKey={(() => {
                      if(this.state.chartType && this.state.chartType.chartColumns.length > 0 && this.state.chartType.chartColumns[0].dataColumns.length > 0)
                        return this.state.chartType.chartColumns[0].dataColumns[0].key;
                        })()}
                valueKey={(() => {
                      if(this.state.chartType && this.state.chartType.chartColumns.length > 1 && this.state.chartType.chartColumns[1].dataColumns.length > 0)
                        return this.state.chartType.chartColumns[1].dataColumns[0].key;
                        })()}
      />
    );
  }

  renderChart(){
    if(this.state.chartType) {
      switch (this.state.chartType.name) {
        case 'Pie':
          return this.renderPieChart();
        case 'Bar':
          return this.renderBarChart();
      }
    }
  }

  // Render the component.
  render() {
    // Get the properties.
    const {viewer, children} = this.props;
    // Loading style
    const loadingClassName = ClassNames(style.loading, {
      [style.active]: this.state.loading
    });
    // Get the components css classes.
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
          <div className={loadingClassName}></div>
          {this.renderChart()}
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
                    type
                    aggregation
                  }
                  data(dataColumns: $dataColumns)
                }
                charts {
                  chartColumns {
                    name
                    dataColumns {
                      key
                      name
                      type
                      aggregation
                    }
                  }
                }
              }`
  }
});
