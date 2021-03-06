// External Components
//------------------------
import React, { Component } from 'react';

// Internal Components
//------------------------
import Timeline    from "../shared_components/Timeline.js"
import YearCounter from "../utils/year_counter.js"
import Button      from "../shared_components/Button.js"
import DateContext from "./DateContext.js"
import WorldMap    from "./WorldMap.js"


// Assets
//------------------------
import './TouchTable.css';
import data from "../data/table_data.json"
import seven_img from "../assets/seven.png"
const pathToOverlays = require.context('../assets/overlays', true);

//------------------------------------------------------------------------------
class TouchTable extends Component {

  constructor(props) {
      super(props);
      this.state = {currentMoment: null, currentYear: data.startYear, overlay: "", overlayVisible: false};

      const yearCallback = year => {this.setState({currentYear: year})};
      this.counter = new YearCounter(data.startYear,.2,yearCallback);
      this.showOverlay = this.showOverlay.bind(this)
  }

  showOverlay(img) {
    this.setState({overlay: pathToOverlays(`./${img}`, true), overlayVisible: true})
    this.counter.pause()
  }

  componentDidMount() {
    document.title = "Northbrook Table"
    this.counter.onStart();
  }

  componentWillUnmount() {
    this.counter.onExit();
  }

  render() {

    const yearsRemaining = (new Date().getFullYear()-this.state.currentYear );
    const finalOpacity =  yearsRemaining > 10 ? 1 : yearsRemaining/10;

    let overlay = (
      <div className="overlay">
          <img
            src={this.state.overlay}
            alt=""
          />
          <div
            className="overlayButton"
            onClick={()=> {this.setState({overlayVisible: false}); this.counter.unpause.call(this.counter)}}
          ></div>
      </div>
    )

    return (
      <div className="TouchTable" id="table">

        <div className="sidebar" >

          <div  style={{opacity: finalOpacity, height: "100%"}}>
            <DateContext data={data.context} year={this.state.currentYear} offset={-50} delay="0.2" />
            <div className='current_date'>{this.state.currentYear}</div>
            <DateContext data={data.context} year={this.state.currentYear} offset={50} delay="0.2" />
          </div>

          <div className="replay_notice" style={{opacity: (yearsRemaining <= 0 ? 1 : 0)}}>
            <img className="seven_images" src={seven_img}/>
            <p>These 7 paintings were once in the famous Northbrook Collection.</p>
            <p className='smaller'>Touch below to see how hundreds of paintings moved in and out of that collection.</p>
          </div>

        </div>

        <WorldMap
          startYear={data.startYear}
          currentYear={this.state.currentYear}
          />

        <div className="controls">
          <div className="control_section" id="control_section">

            <Timeline
              parentId="control_section"
              startYear={data.startYear}
              currentYear={this.state.currentYear}
              moments={data.moments}
              // currentMoment={this.state.currentMoment}
              delay="0.2"
              tickInterval="5"
              setYear={this.counter.setYear.bind(this.counter)}
              showLabel
              overlayFunction={this.showOverlay}
              expansion={ {start: 1750, end: 1930, ratio:1.8, label: "The Northbrook Era" } }/>

            <Button
              text={this.state.currentYear >= 2016 ? "Start Map" : "Restart Map"}
              cta="Touch Here."
              size="half"
              action={() => {this.counter.reset.call(this.counter)}}
              />

          </div>

        </div>
        {this.state.overlayVisible ? overlay : null}
      </div>
    );
  }
}

export default TouchTable
