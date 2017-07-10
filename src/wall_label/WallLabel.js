// External Components
import React, { Component } from 'react';
import $ from 'jquery';

// Internal Components
import ContentBlock from "./ContentBlock.js"

// Assets
import './WallLabel.css';
import objectData from "../data/ipad_data.json";


class WallLabel extends Component {

  constructor(props) {
    super(props);

    let currentObject = this.props.match.params.id || 1;
    currentObject -= 1;

    this.state = {
      flipped: false,
      currentRun: Date.now(),
      frontMoment: 0,
      backMoment: objectData[currentObject].moments.length-1,
      work: objectData[currentObject]
    };
  }

  resetDashboard() {
    this.setState({currentRun: Date.now()});
  }

  spin(e) {
    let el = $('.WallLabel')
    let nextBack = this.state.frontMoment+1;
    if (nextBack >= this.state.work.moments.length) {
      nextBack -= this.state.work.moments.length;
    }

    this.resetDashboard();
    this.setState({backMoment: nextBack});

    el.css("transform", "rotateY(180deg)")

    el.on('transitionend', () => {
      el.addClass('notransition');

      el.css("transform", "rotateY(0deg)")
      this.setState({frontMoment: this.state.backMoment});
      // el[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
      el.removeClass('notransition');
    }
    )

  }

  render() {

    return (
      <div className="WallLabel">
        <ContentBlock
          action={this.spin.bind(this)}
          currentMoment={this.state.frontMoment}
          work={this.state.work}
          resetKey={this.state.currentRun}
          side="front"
        />
         <ContentBlock
          action={this.spin.bind(this)}
          currentMoment={this.state.backMoment}
          work={this.state.work}
          resetKey={this.state.currentRun}
          side="back"
        />
      </div>
    );
  }
}

export default WallLabel;
