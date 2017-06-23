// External Components
//------------------------
import React, { Component } from 'react';

// Internal Components
//------------------------
import Timeline from "../shared_components/Timeline.js"
import EventLog from "./EventLog.js"
import YearCounter from "../utils/year_counter.js"

// Assets
//------------------------
import './Dashboard.css';

//------------------------------------------------------------------------------
class Dashboard extends Component {

  constructor(props) {
      super(props);
      this.state = {};

      const startYear = this.props.objectData.startYear;
      const yearCallback = year => {this.setState({currentYear: year})};
      this.counter = new YearCounter(startYear,0.1,yearCallback);
  }

  componentDidMount() {
    this.counter.onStart();
  }

  componentWillUnmount() {
    this.counter.onExit();
  }

  render() {
    return (
      <div className="Dashboard" id="dashboard">
        <div className='current_date'>- {this.state.currentYear} -</div>
        <EventLog
          currentYear={this.state.currentYear}
          eventList={this.props.objectData.events}
        />
        <Timeline
          parentId="dashboard"
          startYear={this.props.objectData.startYear}
          eventList={this.props.objectData.events}
          currentYear={this.state.currentYear}
          moments={this.props.objectData.moments}
          currentMoment={this.props.moment}
        ></Timeline>
      </div>
    );
  }
}

export default Dashboard;
