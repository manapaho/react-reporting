/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import d3 from 'd3/d3';
import _ from 'lodash';

/**
 * The component.
 */
export default class extends React.Component {
  // Expected properties.
  static propTypes = {
    groupsKey: React.PropTypes.string,
    seriesKey: React.PropTypes.string,
    valueKey: React.PropTypes.string
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
    // Render the chart.
    this.handleRender();
  }

  // Invoked immediately after the component's updates are flushed to the DOM.
  // This method is not called for the initial render.
  // Use this as an opportunity to operate on the DOM when the component has been updated.
  componentDidUpdate() {
    // Render the chart.
    this.handleRender();
  }

  // Render the component.
  render() {
    return (
      <svg style={{flex: 1}}></svg>
    );
  }

  // Render the chart.
  handleRender() {
    // Get the necessary properties.
    var data = this.props.data;
    var groupsKey = this.props.groupsKey;
    var seriesKey = this.props.seriesKey;
    var valueKey = this.props.valueKey;
    // Do we have enough information to render the data?
    var ready = data && Array.isArray(data) && data.length > 0
      && data[0].hasOwnProperty(groupsKey)
      && data[0].hasOwnProperty(seriesKey)
      && data[0].hasOwnProperty(valueKey);
    // Transform the data to chart data.
    if (ready) {
      // Get the data groups.
      var dataGroups = _.groupBy(data, groupsKey);
      // Get the data group keys.
      var dataGroupKeys = Object.keys(dataGroups);
      // Get the data series.
      var dataSeries = _.groupBy(data, seriesKey);
      // Get the data series keys.
      var dataSeriesKeys = Object.keys(dataSeries);
      // Create the chart data.
      var chartData = [];
      var x = 0;
      var y = 0;
      var yMax = 0;
      data.forEach((row, index) => {
        if (index > 0 && row.merchant_category_group_description != data[index - 1].merchant_category_group_description) {
          yMax = Math.max(yMax, y);
          x++;
          y = 0;
        }
        chartData.push({
          x: row.merchant_category_group_description,
          y: y,
          h: row.usd_amount,
          c: dataSeriesKeys.indexOf(row.merchant_category_description)
        });
        y += row.usd_amount;
      });
      yMax = Math.max(yMax, y);

      /**
       * Rendering
       */

      // Get the svg element of this component.
      var element = ReactDOM.findDOMNode(this);

      // Calculate its size.
      var elementRect = element.getBoundingClientRect();

      // Clear the chart.
      d3.select(element).selectAll("*").remove();

      /**
       * Margins
       */

      // Define the margins.
      var margin = {top: 20, right: 20, bottom: 250, left: 80};
      // Calculate resulting chart group size.
      var width = elementRect.width - margin.left - margin.right;
      var height = elementRect.height - margin.top - margin.bottom;
      // Create the chart.
      var svg = d3.select(element)
        // Create the chart group.
        .append("g")
        // Adjust it to the margins.
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      /**
       * Scales
       */

      // Create the x scale.
      var xScale = d3.scale.ordinal()
        // The domain is based on the data groups.
        .domain(dataGroupKeys)
        // Translate to the chart group width.
        .rangeRoundBands([0, width]);

      // Create the y scale.
      var yScale = d3.scale.linear()
        // The domain is based on the data value range.
        .domain([yMax, 0])
        // Translate to the chart group height (top to bottom).
        .range([0, height]);

      // Create the height scale.
      var hScale = d3.scale.linear()
        // The domain is based on the data value range.
        .domain([0, yMax])
        // Translate to the chart group height.
        .range([0, height]);

      // Create the color scale.
      var cScale = d3.scale.category20();

      /**
       * Data bars
       */

      // Bind the data to the bar rectangles.
      var bars = svg.selectAll("rect").data(chartData);

      // Create a bar rectangle for each data row.
      bars.enter().append("rect").attr("width", xScale(dataGroupKeys[1]) - 6);

      // Update the bar rectangle properties.
      bars.attr("x", (d) => {
        return xScale(d.x);
      }).attr("y", (d) => {
        return Math.max(0, yScale(d.y + d.h));
      }).attr("height", (d) => {
        return Math.max(0, hScale(d.h));
      }).style("fill", (d) => {
        return cScale(d.c);
      });

      /**
       * Tooltip
       */

      var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
      tooltip.append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);
      tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

      bars
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
          tooltip.select("text").text(dataSeriesKeys[d.c] + ' ' + d.h);
        });

      // Remove the bar rectangles when data rows are removed.
      bars.exit().remove();

      /**
       * Axis
       */

      // Create the x axis.
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

      // Create the x axis group.
      svg.append("g")
        // Assign the css class.
        .attr("class", "x axis")
        // Position it at the bottom.
        .attr("transform", "translate(0," + height + ")")
        // Render the axis.
        .call(xAxis)
        // Select the axis text nodes.
        .selectAll("text")
        // Position them.
        .attr("y", 0)
        .attr("x", 9)
        // Size them.
        .attr("dy", ".35em")
        // Rotate them.
        .attr("transform", "rotate(90)")
        // Align them at the bottom.
        .style("text-anchor", "start");

      // Create the y axis.
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

      // Create the y axis.
      svg.append("g")
        // Assign the css class.
        .attr("class", "y axis")
        // Render the axis.
        .call(yAxis)
        // Append a label text to it.
        .append("text")
        // Rotate it.
        .attr("transform", "rotate(-90)")
        // Position it.
        .attr("y", 6)
        // Size it.
        .attr("dy", ".71em")
        // Align it to the top.
        .style("text-anchor", "end");
    }
  }
}

