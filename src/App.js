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
      $("body").on('touchmove',function(event){
        event.preventDefault();
        return false;
      });
      $("body").on('selectstart',function(event){
        event.preventDefault();
        return false;
      });
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
    let chat = `Frans Hals’s portraiture is distinguished by dazzling brushwork and penetrating analysis of character. Hals received numerous commissions for both individual and group portraits, even though his style of visible brushstrokes differed from prevailing norms in Dutch painting at the time. In the 19th century, with the advent of the Impressionist movement, Hals’s mastery was recognized anew.\nHals’s style is well-suited for a portrait of Pieter Cornelisz. van der Morsch, a court officer of Leiden and a member of the Chamber of Rhetoric, the city’s amateur literary club. Details in the painting refer to van der Morsch's role in the club, which composed poetry and staged satirical plays. The dried herring he holds refers to the phrase “to give a red herring,” Dutch slang for rebuking someone with sarcastic remarks. The animated pose and expression convey van der Morsch’s lively character, while the slogan at the upper left, Wie begeert (“Who wants it?”), suggests his wit.`
    chat = chat.replace("\n","</p></p>")
    let story = `In the 17th century, Dutch artists often painted on wooden panels even though painting on canvas had become popular elsewhere nearly a century earlier. When the British art dealer Sir Joseph Duveen purchased this Hals portrait from Lord Northbrook in 1927 it was still on its original panel support. By the time he sold it to the American advertising pioneer Alfred W. Erickson in 1929, it had been transferred to canvas. Such transfer, usually to stabilize a painting, is a painstaking process. It involves gradually shaving off the damaged, cracked, or infested panel and attaching the resulting thin paint layer to a specially prepared canvas. The process was used extensively in the 19th century, but it has since been largely supplanted by less severe methods of conservation.`
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
            <p dangerouslySetInnerHTML={{__html: chat}}></p>
          </div>
          <footer>
            <Button text='Where has this painting been?' cta='Touch here to find out!' touchEvent={this.spin.bind(this)}/>
          </footer>
        </section>
        <section className="back">
          <div className="content">
            <Tombstone />
            <Dashboard objectData={objectData} key={this.state.currentRun}/>
            <h2>★ A Moment in History:  1927</h2>
            <p>{story}</p>
          </div>
          <footer>
            <Button text='Replay' cta='Touch Here.' size="half" touchEvent={resetDashboard}/>
            <Button text='Go Back' cta='Touch Here.' size="half" touchEvent={spin}/>
          </footer>
        </section>
      </div>
    );
  }
}

export default App;
