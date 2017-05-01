import React from 'react';
import './Button.css';

export default function(props) {

  let button_class = props.size === "half" ? "button half" : "button";

  return (
    <div className={button_class} onClick={props.onClick}>
      <div className="button_text">{props.text}</div>
      <div className="call_to_action">{props.cta}</div>
    </div>
  )
}
