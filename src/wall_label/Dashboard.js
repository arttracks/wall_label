import React, { Component } from 'react';
import './Dashboard.css';
import fake_timeline from "../assets/fake_timeline.svg";
import Timeline from "../shared_components/Timeline.js"
import EventLog from "./EventLog.js"

class Dashboard extends Component {

  constructor(props) {
      super(props);
      this.state = {currentYear: this.props.objectData.startYear-1}
  }

  componentDidMount() {
    this.countUp()
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId);
  }

  countUp() {
    let timeoutId = setTimeout(this.incrementYear.bind(this), 100)
    this.setState({timeoutId: timeoutId})
  }

  incrementYear() {
     this.setState({currentYear: this.state.currentYear + 1});
     if (this.state.currentYear < new Date().getFullYear()) {
      this.countUp()
    }
  }

  render() {
    return (
      <div className="Dashboard" id="dashboard">
        <div className='current_date'>- {this.state.currentYear} -</div>
        <EventLog
          currentYear={this.state.currentYear}
          eventList = {this.props.objectData.events}
        />
        <Timeline
          parentId="dashboard"
          startYear={this.props.objectData.startYear}
          eventList = {this.props.objectData.events}
          currentYear={this.state.currentYear}
          moments={this.props.objectData.moments}
          currentMoment={this.props.moment}
        ></Timeline>
      </div>
    )
  }
}

export default Dashboard;
