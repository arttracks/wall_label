// External Components
import React from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';

// Internal Components
import WallLabel from "./wall_label/WallLabel.js"
import TouchTable from "./touch_table/TouchTable.js"

// Assets
import objectData from "./data/ipad_data.json";
import './App.css';


const TableOfContents = function() {

  const ipadTitles = objectData.map(function(work, index){
    return (<Link to={"/ipad/"+ (index+1)}>{work.title}</Link>)
  });

  return (
      <div className="TOC">
        <h2>iPads</h2>
        {ipadTitles}
        
        <h2>Table</h2>
        <Link to="/table">Table Stories</Link>
      </div>
  )
}

const NorthbrookApp = () => (
  <Router>
    <span>
      <Route exact path="/" component={TableOfContents}/>
      <Route path="/ipad/:id" component={WallLabel}/>
      <Route path="/table" component={TouchTable}/>
    </span>
  </Router>
)

export default NorthbrookApp

