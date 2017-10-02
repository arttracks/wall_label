import React from 'react';

import Dashboard from "./Dashboard.js"
import Button from "../shared_components/Button.js"

export default function(props) {

  const moment = props.work.moments[props.currentMoment];
  const nextMoment = props.work.moments.length === props.currentMoment +1 ? 0 : +props.currentMoment +1
  return (
    <section className={props.side}>

    <div className="content">
      <Dashboard
        objectData={props.work}
        key={props.resetKey}
        moment={props.currentMoment} />
      <h2>★ A Moment in History:  {moment.yearText}</h2>
      <p dangerouslySetInnerHTML={{__html: moment.story.replace("\n","</p></p>")}}></p>
    </div>
    <footer>
      <Button
        text={props.work.moments[nextMoment].tagline}
        cta='Touch here to find out!'
        action={props.action}
      />
    </footer>
    </section>
  )
}


