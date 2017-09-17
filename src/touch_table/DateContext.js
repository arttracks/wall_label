// External Components
//------------------------
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { scaleLinear } from 'd3-scale'; 
import * as d3 from "d3";

// Internal Components
//------------------------

// Assets
//------------------------
import './DateContext.css';

//------------------------------------------------------------------------------
class DateContext extends Component {
 
  constructor(props) {
    super(props);
    this.state = {earliest: 0, latest: 0};

  }

  componentDidMount() {

  }

  // On each update:
  componentWillReceiveProps(nextProps) {
    
    let earliest = null, latest = null;
    const dateIsAfter = nextProps.offset > 0
    if (dateIsAfter) {
      earliest = nextProps.year
      latest = nextProps.year + nextProps.offset
    }
    else {
      earliest = nextProps.year + nextProps.offset
      latest = nextProps.year
    }
    const scale = scaleLinear()
      .domain([earliest, latest])
      .range([0, 1]);

    this.state = {scale: scale, earliest: earliest, latest: latest};



    let transition = d3.transition().duration(200).ease(d3.easeLinear);

    let node = d3.select(ReactDOM.findDOMNode(this));
    const magicNumber = 5.46;
    node.interrupt().attr('transform', `translate(0,${magicNumber})`)

    node.transition(transition)
      .attr('transform', "translate(0,0)")
  }




  render() {


    let dates = [];
    this.props.data.forEach( date => {
      if(date.year > this.state.earliest && date.year < this.state.latest) {
        let percent = ((this.state.earliest-date.year)/Math.abs(this.props.offset))*-1
        let opacity = (this.props.offset > 0) ? 1-percent : percent;
        if (opacity > 0.90) {
          opacity -= (opacity-.9)*10
        }

        dates.push(
          <text
            key={date.year}
            y={`${percent*100}%`}
            opacity={opacity}
          >
            {date.year} — {date.label}
          </text>
        )
      }
    })


    return (
      <svg className="date_context">{dates}</svg>
    )
  }

}

export default DateContext;
