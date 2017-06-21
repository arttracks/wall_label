// External Components
import React, { Component } from 'react';
import $ from 'jquery';

// Internal Components
import Tombstone from "./Tombstone.js"
import Dashboard from "./Dashboard.js"
import Button from "../shared_components/Button.js"
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
    if(this.state.flipped){
      let nextFront = this.state.frontMoment+2;
      if (nextFront >= this.state.work.moments.length) {
        nextFront -= this.state.work.moments.length;
      }
      this.setState({frontMoment: nextFront});

      $('.WallLabel').css("transform", "rotateY(0deg)")
      this.resetDashboard();

    }
    else {
      let nextBack = this.state.backMoment+2;
      if (nextBack >= this.state.work.moments.length) {
        nextBack -= this.state.work.moments.length;
      }
      this.setState({backMoment: nextBack});

      $('.WallLabel').css("transform", "rotateY(180deg)")
      this.resetDashboard();

    }
    this.setState({flipped: !this.state.flipped});
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
