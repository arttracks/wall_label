// External Components
import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale'

// Internal Components

// Assets
import './Timeline.css';

class Timeline extends Component {

  render() {
    // Fail early if this isn't instantiated.
    const parentDomNode = document.getElementById(this.props.parentId);
    if (!parentDomNode) return false;

    // Set up some initial parameters and tools
    const width = parentDomNode.offsetWidth;
    const textMargin = 60;
    const lineWidth = width-textMargin*2;
    const todayYear = new Date().getFullYear();
    const startYear = this.props.startYear;


    let x = null;
    if (this.props.expansion) {
      x = (input) => {

        const exp = this.props.expansion;
        const mult = exp.ratio || 1.5;

        const duration = todayYear - startYear;
        const expDuration = exp.end - exp.start;
        const startDuration = exp.start - startYear;
        const endDuration = todayYear - exp.end;
        const ratio = expDuration/duration;
        const remainingRatio = endDuration/startDuration;
        const remainingSpace = (1-ratio*mult)
        const startPercent = remainingSpace * (1-remainingRatio);
        const endPercent = 1-remainingSpace *remainingRatio;

        const startScale = scaleLinear()
        .domain([startYear, exp.start])
        .range([0, lineWidth*startPercent]);

        const middleScale = scaleLinear()
        .domain([exp.start, exp.end])
        .range([lineWidth*startPercent, lineWidth*endPercent]);

        const endScale = scaleLinear()
        .domain([exp.end, todayYear])
        .range([lineWidth*endPercent, lineWidth]);



        let chosenScale = null
        if ( input < exp.start) {chosenScale =  startScale }
        else if ( input < exp.end) {chosenScale = middleScale }
        else { chosenScale = endScale }
        return chosenScale(input)

      }
    }
    else {
      x = scaleLinear()
        .domain([this.props.startYear, todayYear])
        .range([0, lineWidth]);
    }

    // build the ratio box
    let expansionLabel = null;
    if (this.props.expansion && this.props.expansion.label) {
      const exp = this.props.expansion;

      const width = x(exp.end)-x(exp.start)
      expansionLabel = (
        <g className="expansion_label" transform="translate(0,-30)">
          <rect x={x(exp.start)} width="1" height="7" y="-3" />
          <rect x={x(exp.end)} width="1" height="7" y="-3" />
          <rect x={x(exp.start)} width={width} height="1" />
          <text x={x(exp.start) + width/2} y="-4" textAnchor="middle">
            {this.props.expansion.label}
          </text>
        </g>
      )
    }


    // Build the hash marks for the ownership events
    let eventHashes = null;
    if (this.props.eventList) {
      eventHashes = this.props.eventList.map( (event) => {
        return <rect key={event.year} className="event_hash" x={x(event.year)} y="6" width="1" height="4" />
      })
    }

    // Build optional tick marks
    let ticks = null;
    if (this.props.tickInterval) {
      let i = startYear;
      ticks = []
      while (i < todayYear) {
        ticks.push(<rect y="12" width="1" height="4" x={x(i)} />)
        i += (+this.props.tickInterval);
      }
    }

    // Build the stars for the moment events
    let moments = null;
    if (this.props.moments) {
       moments = this.props.moments.map( (moment, index) => {

        let yearCaption = null;
        let title = null;

        if (this.props.showLabel) {
          yearCaption = <text y="-10" x="0" textAnchor="middle">{moment.year}</text>;
          if (moment.title) {
            title = (
              <text y="35" x="30" textAnchor="left" transform="rotate(30)">{moment.title}</text>
              )
          }
        }

        const klass = index === +this.props.currentMoment ? "star" : "star disabled";
        return (
          <g key={index} className={klass} transform={`translate(${x(moment.year)} 10)`}>
              {yearCaption}
              <rect width="1" height="30" />
              <text y="35" x="-9.5">★</text>
              {title}
          </g>
        )
      })
    }

    // Draw the SVG
    return <svg width={width} height="50"  className="timeline" overflow="visible">
     <text y="15" x="5">{this.props.startYear}</text>
     <text y="15" x={lineWidth+textMargin + 10}>{todayYear}</text>
     <g transform={`translate(${textMargin} 0)`}>
       {moments}
       {ticks}
       {eventHashes}
       {expansionLabel}
       <rect y="10" width={lineWidth} height="2" />
       <rect y="8" width={x(this.props.currentYear)} height="6" />
    </g>
   </svg>
  }
}

export default Timeline;
