import React, { Component } from 'react';
import './Dashboard.css';
import fake_timeline from "../assets/fake_timeline.svg";

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
      <div className="Dashboard">
        <div className='current_date'>- {this.state.currentYear} -</div>
        <dl>
          <dt>Location:</dt><dd>Stratton Park, Hampshire, England</dd>
          <dt>Owner:</dt><dd>Thomas George Baring</dd>
          <dt>Total Owners:</dt><dd>12</dd>
          <dt>Miles Travelled:</dt><dd>62,123</dd>
        </dl>
        <div id="AnimatedTimeline"><img src={fake_timeline} alt="" /></div>
      </div>
    )
  }
}

export default Dashboard;
