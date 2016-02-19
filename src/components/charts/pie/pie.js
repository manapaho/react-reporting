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
 * Import styles.
 */
import style from './style';

/**
 * The component.
 */
export default class extends React.Component {
  // Expected properties.
  static propTypes = {
    namesKey: React.PropTypes.string,
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
    var namesKey = this.props.namesKey;
    var valueKey = this.props.valueKey;
    console.log(namesKey, valueKey);
    // Do we have enough information to render the data?
    var ready = data && Array.isArray(data) && data.length > 0
      && data[0].hasOwnProperty(namesKey)
      && data[0].hasOwnProperty(valueKey);
    // Transform the data to chart data.
    if (ready) {
      // Group by names.
      var nameGroups = _.groupBy(data, namesKey);
      // Get a names array.
      var names = Object.keys(nameGroups);
      // Create the chart data.
      var chartData = [];
      var max = 0;
      data.forEach((row, index) => {
        max = Math.max(max, row[valueKey]);
        chartData.push({
          label: row[namesKey],
          value: row[valueKey]
        });
      });

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
      var r = Math.min(width, height) / 2;
      // Create the chart.
      var svg = d3.select(element)
        // Create the chart group.
        .append("g")
        // Adjust it to the margins.
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .append("g")                //make a group to hold our pie chart
        .attr("transform", "translate(" + r + "," + r + ")");    //move the center of the pie chart from 0, 0 to radius, radius


      /**
       * Scales
       */
      var color = d3.scale.category20c();

      /**
       * Data Slices
       */
      var pie = d3.layout.pie().value(function(d) { return d.value; });
      var arc = d3.svg.arc().outerRadius(r);
      var arcs = svg.selectAll("g.slice").data(pie(chartData)).enter().append("svg:g");
      arcs.append("path")
        .attr("fill", function(d, i) { return color(i); } )
        .attr("d", arc);

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

      arcs
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
          tooltip.select("text").text(d.data.label + ' - ' + d.data.value);
        });
    }
  }
}

