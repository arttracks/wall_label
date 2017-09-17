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
    return (<div><Link to={"/ipad/"+ (index+1)}>{work.title}</Link></div>)
  });

  return (
      <div className="TOC">
        <h2>iPads</h2>
        {ipadTitles}

        <h2>Table</h2>
        <Link to="/table">Table Stories</Link>
        <div className='credits'>
          <p>
            This is part of <a href='http://www.museumprovenance.org' target='_blank' rel="noopener noreferrer">Art Tracks</a>, a project of <a href='http://cmoa.org' target='_blank' rel="noopener noreferrer">Carnegie Museum of Art</a>.
          </p>
          <p>
            Source code for this project is available under a <a href='https://opensource.org/licenses/MIT' target='_blank' rel="noopener noreferrer">MIT license</a> on <a href='https://github.com/arttracks/wall_label' target='_blank' rel="noopener noreferrer"> Github</a> for download, modification, or reuse.  All written content is released under a <a href='https://creativecommons.org/publicdomain/zero/1.0/' target='_blank' rel="noopener noreferrer"> Creative Commons 1.0 Universal</a> license for reuse.
          </p>
          <p>
            Thank you to <a href='https://www.netlify.com' target='_blank' rel="noopener noreferrer">Netlify</a> for providing free hosting to this project and other open-source software.
          </p>
          <p>
            <em>Initial funding for <strong>Art Tracks</strong> was provided in part by a generous grant by the <a href="http://www.imls.gov">Institute of Museum and Library Services</a>.  Funding for Phase II has been provided by the <a href="http://www.neh.gov/">National Endowment for the Humanities</a> with additional research support provided by the <a href="http://www.kressfoundation.org">Samuel H. Kress Foundation</a> and the <a href="http://www.paul-mellon-centre.ac.uk/">Paul Mellon Centre for Studies in British Art</a>.</em>
          </p>
        </div>
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

