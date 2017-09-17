// External Components
//------------------------
import React, { Component } from 'react';
import $ from 'jquery';
import * as d3 from "d3";
import * as topojson from "topojson";

// Internal Components
//------------------------


// Assets
//------------------------
import './WorldMap.css';
import mapData from "../data/world_map.json"
import eventData from "../data/painting_events.json"

//------------------------------------------------------------------------------
class WorldMap extends Component {

  // constructor(props) {
  //   super(props);
  //   // this.state = {todayYear: new Date().getFullYear()};
  // }

  componentDidMount() {
    let svg = d3.select(".map").append("svg")
    .attr("width", "100%")
    .attr("height", "100%");
  
    const projection = this.getProjection();
    const path = d3.geoPath().projection( projection );
  
    svg.selectAll( 'path.land' )
        .data( topojson.feature( mapData, mapData.objects.countries ).features )
        .enter().append( 'path' )
        .attr( 'class', 'land' )
        .attr( 'd', path );
  }

  componentWillReceiveProps(nextProps) {
    // Do something here with dots.
  }

  shouldComponentUpdate() {return false}
 
  getProjection() {
    var jMap = $(".map");
    const height = jMap.height();
    const width = jMap.width();

    let scale = 1;
    
    const offset = [width / 2, height / 2 ];
    const projection = d3.geoEquirectangular().scale( scale ).rotate( [0,0] ).center([0,5]).translate( offset );
   
    projection.scale( 800 );
    projection.center([7.8578, 52.9762])

    return projection;
  }

  mercatorBounds(projection) {
  // find the top left and bottom right of current projection
  var maxlat = 83,
      yaw = projection.rotate()[ 0 ],
      xymax = projection( [ -yaw + 180 - 1e-6, -maxlat ] ),
      xymin = projection( [ -yaw - 180 + 1e-6, maxlat ] );

   return [ xymin, xymax ];
  };


  render() {
    return (
      <div className="map" onClick={()=> {$(".overlay").show(); return false} }></div>
    )
  }
}

export default WorldMap;