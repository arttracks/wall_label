import React from 'react';
import numToWords from "../utils/num_to_words.js"

export default function(props) {

  let i = 0;
  let distance = 0;
  let event = {}

  while(props.eventList[i].year <= +props.currentYear) {
    event = props.eventList[i]
    distance += event.distance
    i+=1;
    if (i === props.eventList.length) { break;}
  }

  return (
    <dl>
      <dt>Current Owner:</dt><dd>{event.owner}</dd>
      <dt>Current Location:</dt><dd>{event.place}</dd>
      <dt>Miles Travelled:</dt><dd>{distance} miles</dd>
      <dt>Number of Owners:</dt><dd>{numToWords(i)}</dd>
    </dl>
  )
}
