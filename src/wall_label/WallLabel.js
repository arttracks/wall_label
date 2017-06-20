// External Components
import React, { Component } from 'react';
import $ from 'jquery';

// Internal Components
import Tombstone from "./Tombstone.js"
import Dashboard from "./Dashboard.js"
import Button from "../shared_components/Button.js"

// Assets
import './WallLabel.css';
import objectData from "../data/ipad_data.json";


class WallLabel extends Component {

  constructor(props) {
    super(props);
    this.state = {flipped: false, currentRun: Date.now()};
  }

  resetDashboard() {
    this.setState({currentRun: Date.now()});
  }

  spin(e) {
    if(this.state.flipped){
      $('.WallLabel').css("transform", "rotateY(0deg)")
    }
    else {
      $('.WallLabel').css("transform", "rotateY(180deg)")
      this.resetDashboard();
    }
    this.setState({flipped: !this.state.flipped});
  }

  render() {

    let spin = this.spin.bind(this);
    let resetDashboard = this.resetDashboard.bind(this);
    let currentObject = this.props.match.params.id || 1;
    currentObject -= 1;

    let formattedChat = objectData[currentObject].chat.replace("\n","</p></p>")
    let formattedStory = objectData[currentObject].story.replace("\n","</p></p>")
    return (
      <div className="WallLabel">
        <section className="front">
          <div className="content">
            <Tombstone data={objectData[currentObject]}/>
            <p dangerouslySetInnerHTML={{__html: formattedChat}}></p>
          </div>
          <footer>
            <Button text='Where has this painting been?' cta='Touch here to find out!' action={spin}/>
          </footer>
        </section>
        <section className="back">
          <div className="content">
            <Tombstone data={objectData[currentObject]} />
            <Dashboard objectData={objectData[currentObject]} key={this.state.currentRun} />
            <h2>★ A Moment in History:  {objectData[currentObject].momentYear}</h2>
            <p dangerouslySetInnerHTML={{__html: formattedStory}}></p>
          </div>
          <footer>
            <Button text='Replay' cta='Touch Here.' size="half" action={resetDashboard}/>
            <Button text='Go Back' cta='Touch Here.' size="half" action={spin}/>
          </footer>
        </section>
      </div>
    );
  }
}

export default WallLabel;
