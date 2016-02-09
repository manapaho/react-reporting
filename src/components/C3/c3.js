/**
 * React-C3 Chart
 * Copyright 2015 - Cody Reichert <codyreichert@gmail.com>
 */

import c3    from 'c3';
import React from 'react';

const ChartComponent = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired
  },

  chart: null,

  shouldComponentUpdate: function (nextProps) {
    return false;
  },

  componentDidMount: function () {
    this._generateChart(
      this.props.config
    );
  },

  componentDidUpdate: function (prevProps) {
    this._generateChart(
      this.props.config
    );
  },

  componentWillUnmount: function () {
    this._destroyChart();
  },

  _generateChart: function (config) {
    this.chart = c3.generate({
      bindto: ReactDOM.findDOMNode(this),
      ...config
    });
  },

  _destroyChart: function () {
    this.chart.destroy();
  },

  render: function () {
    return (
      <div className="c3 react-c3"></div>
    );
  }
});

export default ChartComponent;
