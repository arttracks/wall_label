// External Components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import { scaleLinear } from 'd3-scale'; 
// Internal Components

// Assets
import './Timeline.css';

class Timeline extends Component {

  constructor(props) {
    super(props);
    this.state = {todayYear: new Date().getFullYear()};
  }

  componentDidMount() {

    // Set up some initial parameters and tools
    const parentDomNode = document.getElementById(this.props.parentId);
    const width = parentDomNode.offsetWidth;
    const textMargin = 60;
    const lineWidth = width-textMargin*2;
    const startYear = this.props.startYear;
    const todayYear = this.state.todayYear;

    // Instantiate the scale
    let x, domain, range = null;
    if (this.props.expansion) {
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

      domain = [startYear, exp.start,exp.end, todayYear]
      range = [0, lineWidth*startPercent, lineWidth*endPercent, lineWidth]
    }
    else {
     domain = [this.props.startYear, todayYear]
     range = [0, lineWidth]
    }
     x = scaleLinear()
        .domain(domain)
        .range(range);

    // Pass these onto the component as state
    this.setState({x: x, width: width, lineWidth: lineWidth, textMargin: textMargin})
  }

  // On each update:
  componentWillReceiveProps(nextProps) {
        let transition = d3.transition().duration(1000*nextProps.delay).ease(d3.easeLinear);

        let node = d3.select(ReactDOM.findDOMNode(this));
        if (node == null) {return;}
        node = node.select(".movingBar")
  
        node.transition(transition)
          .attr('width', this.state.x(1+nextProps.currentYear))
    }

  actionFunction(evt) {
    if (evt.buttons !== 1) return;
    if (!this.props.setYear) return;
    let val = evt.clientX-60
    let year = Math.floor(this.state.x.invert(val))
    console.log(year)
    this.props.setYear(year);
  }

  // Actually draw thie thing:
  render() {
    let x = this.state.x;
    if (!x) {return null}

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
      let i = this.props.startYear;
      ticks = []
      while (i < this.state.todayYear) {
        ticks.push(<rect y="12" width="1" height="4" x={x(i)} key={"tick_"+i}/>)
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
              <text className="star_symbol" y="35" x="0.5">★</text>
              {title}
          </g>
        )
      })
    }

    // Draw the SVG
    return <svg width={this.state.width} height="50"  className="timeline" overflow="visible">
     <text y="15" x="5">{this.props.startYear}</text>
     <text y="15" x={this.state.lineWidth+this.state.textMargin + 10}>{this.state.todayYear}</text>
     <g transform={`translate(${this.state.textMargin} 0)`}>
      <rect y="10" width={this.state.lineWidth} height="2"/>
      <rect className='movingBar' y="8" width={x(this.props.currentYear)} height="6" />
      {ticks}
      <rect 
        className='touch_target' 
        y="-10" 
        width={this.state.lineWidth} 
        height="35" 
        onTouchMove={this.actionFunction.bind(this)} 
        onMouseMove={this.actionFunction.bind(this)} 
        onTouchStart={this.actionFunction.bind(this)} 
        onMouseDown={this.actionFunction.bind(this)}
      />
      {moments}
      {eventHashes}
      {expansionLabel}
    </g>
   </svg>
  }
}

export default Timeline;
