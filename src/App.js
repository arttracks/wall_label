import React, { Component } from 'react';
import $ from 'jquery';
import './App.css';
import Tombstone from "./Tombstone.js"
import Dashboard from "./Dashboard.js"
import Button from "./Button.js"

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {flipped: false, currentRun: Date.now()};
  }

  resetDashboard() {
    this.setState({currentRun: Date.now()});
  }

  spin(e) {
    if(this.state.flipped){
      $('.App').css("transform", "rotateY(0deg)")
    }
    else {
      $('.App').css("transform", "rotateY(180deg)")
      this.resetDashboard();
    }
    this.setState({flipped: !this.state.flipped});
  }

  render() {
    let chat = `Frans Hals ranks with Rembrandt van Rijn as a great portraitist, distinguished by his dazzling brushwork and penetrating analysis of character. The portrait represents a 73-year-old man, the municipal beadle (court officer) of Leiden and a member of the Leiden society of Rederijkers, or amateur literary club. Its details refer to van der Morsch's role in the club, which composed poetry and staged satirical plays. The dried herring in the sitter's hand refers to the phrase "to give a red herring," which in the Dutch vernacular means "to rebuke someone with sarcastic remarks." The slogan at the upper left of the painting, Wie begeert [Who wants it?], refers to his caustic wit. Van der Morsch himself probably specified the symbolism, which supports the artist's reading of his sitter's character conveyed in the animated pose and expression.`
    let story = chat

    let objectData = {
      startYear: 1616
    }

    let spin = this.spin.bind(this);
    let resetDashboard = this.resetDashboard.bind(this);

    return (
      <div className="App">
        <section className="front">
          <div className="content">
            <Tombstone />
            <p>{chat}</p>
          </div>
          <footer>
            <Button text='Where has this painting been?' cta='Touch here to find out!' onClick={this.spin.bind(this)}/>
          </footer>
        </section>
        <section className="back">
          <div className="content">
            <Tombstone />
            <Dashboard objectData={objectData} key={this.state.currentRun}/>
            <h2>★ A Moment in History:  1881</h2>
            <p>{story}</p>
          </div>
          <footer>
            <Button text='Reset' cta='Touch Here.' size="half" onClick={resetDashboard}/>
            <Button text='Go Back' cta='Touch Here.' size="half" onClick={spin}/>
          </footer>
        </section>
      </div>
    );
  }
}

export default App;
