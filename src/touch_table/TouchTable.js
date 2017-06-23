// External Components
//------------------------
import React, { Component } from 'react';
import $ from 'jquery';

// Internal Components
//------------------------
import Timeline    from "../shared_components/Timeline.js"
import YearCounter from "../utils/year_counter.js"
import Button      from "../shared_components/Button.js"
import DateContext from "./DateContext.js"


// Assets
//------------------------
import './TouchTable.css';
import data from "../data/table_data.json"
import overlay from "../assets/overlay.png"
//------------------------------------------------------------------------------
class TouchTable extends Component {

  constructor(props) {
      super(props);
      this.state = {currentMoment: null};

      const yearCallback = year => {this.setState({currentYear: year})};
      this.counter = new YearCounter(data.startYear,.2,yearCallback);
  }

  componentDidMount() {
    this.counter.onStart();
  }

  componentWillUnmount() {
    this.counter.onExit();
  }

  render() {

    // let currentMoment = 0;
    // let found = false;
    // while (!found) {
    //   if (data.moment[currentMoment +1]) {
    //     let d1 = data.moment[currentMoment]
    //     let d2 = data.moment[currentMoment+1]
    //     let y = this.state.currentYear
    //     if (Math.abs(d2-y) > Math.abs(d1-y)) {
    //       found = true
    //     } else {
    //       currentMoment += 1;
    //     }
    //   } else {found = true}
    // }

    return (
      <div className="TouchTable" id="table">

        <div className="sidebar">
          <DateContext data={data.context} year={this.state.currentYear} offset={-50} />
          <div className='current_date'>{this.state.currentYear}</div>
          <DateContext data={data.context} year={this.state.currentYear} offset={50} />
        </div>

        <div className="map" onClick={()=> {$(".overlay").show(); return false} }
>
        </div>

        <div className="controls">
          <div className="control_section" id="control_section">
            <Timeline
            parentId="control_section"
            startYear={data.startYear}
            currentYear={this.state.currentYear}
            moments={data.moments}
            currentMoment={this.state.currentMoment}
            tickInterval="5"
            showLabel
            expansion={ {start: 1750, end: 1930, ratio:1.8, label: "The Northbrook Era" } }/>

            <Button
              text="Restart"
              cta="Touch Here."
              size="half"
              action={this.counter.reset.bind(this.counter)}
              />

          </div>

        </div>

        <div className="overlay">
          <img
            src={overlay}
            alt=""
            onClick={()=> $(".overlay").hide()}
          />
        </div>

      </div>
    );
  }
}

export default TouchTable
