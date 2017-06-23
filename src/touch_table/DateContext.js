// External Components
//------------------------
import React from 'react';

// Internal Components
//------------------------

// Assets
//------------------------
import './DateContext.css';

//------------------------------------------------------------------------------
export default function(props) {

  let earliest = null, latest = null;
  let dateIsAfter = props.offset > 0
  if (dateIsAfter) {
    earliest = props.year
    latest = props.year + props.offset
  }
  else {
    earliest = props.year + props.offset
    latest = props.year
  }

  let dates = [];
  props.data.forEach( date => {
    if(date.year > earliest && date.year < latest) {
      let percent = ((earliest-date.year)/Math.abs(props.offset))*-1
      let opacity = dateIsAfter ? 1-percent : percent;
      if (opacity > 0.90) {
        opacity -= (opacity-.9)*10
      }

      dates.push(
        <text
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
