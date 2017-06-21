import React, { Component } from 'react';
import './Timeline.css';
import { scaleLinear } from 'd3-scale'

class Timeline extends Component {

  render() {

    const parentDomNode = document.getElementById(this.props.parentId);
    if (!parentDomNode) return false;

    const width = parentDomNode.offsetWidth;
    const textMargin = 60;
    const lineWidth = width-textMargin*2;
    const todayYear = new Date().getFullYear();
    const x = scaleLinear()
      .domain([this.props.startYear, todayYear])
      .range([0, lineWidth]);

    const eventHashes = this.props.eventList.map( (event) => {
      return <rect class="event_hash" x={x(event.year)} y="6" width="1" height="4" />
    })

    const moments = this.props.moments.map( (moment, index) => {
      const klass = index === +this.props.currentMoment ? "star" : "star disabled";

      return (
        <g key={index} className={klass} transform={`translate(${x(moment.year)} 10)`}>
            <rect width="1" height="30" />
            <text y="35" x="-9.5">★</text>
        </g>
      )
    })

    return <svg width={width} height="50">
     <text y="15" x="5">{this.props.startYear}</text>
     <text y="15" x={lineWidth+textMargin + 10}>{todayYear}</text>
     <g transform={`translate(${textMargin} 0)`}>
       {moments}
       {eventHashes}
       <rect y="10" width={lineWidth} height="2" />
       <rect y="8" width={x(this.props.currentYear)} height="6" />
    </g>
   </svg>
  }
}

export default Timeline;
