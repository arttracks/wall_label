import React from 'react';
import './Button.css';

export default function(props) {

  let button_class = props.size === "half" ? "button half" : "button";

  let actionFunction = function(){props.action(); return false;}

  return (
    <div className={button_class} onTouchStart={actionFunction} onMouseDown={actionFunction}>
      <div className="button_text">{props.text}</div>
      <div className="call_to_action">{props.cta}</div>
    </div>
  )
}
