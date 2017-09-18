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
    this.setState({svg: svg, projection: projection})


    var radialGradient = svg.append("defs")
      .append("radialGradient")
        .attr("id", "radial-gradient");

    radialGradient.append("stop")
        .attr("offset", "%")
        .attr("stop-color", "rgba(0,0,0,1)");
    radialGradient.append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "rgba(0,0,0,0.05)");
    radialGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(0,0,0,0)");
  }

  processData(data, currentYear) {
    return data.map( e=> {
      const firstValid = e.events.findIndex(event => event.year <= currentYear)
      if (firstValid === -1) {return null}
      
      let lastValid = e.events.findIndex(event => event.year > currentYear) -1
      if (lastValid === -2) {lastValid = (e.events.length -1)}    

      if (e.events[lastValid] === undefined) { console.log("problem",lastValid,e); return null}
      return {id: e.id, lat: e.events[lastValid].lat, lng: e.events[lastValid].lng}
    }).filter(n => n)
  }


  componentWillReceiveProps(nextProps) {

    const processedData = this.processData(eventData, nextProps.currentYear);
    const projection = this.getProjection();
    let circles = this.state.svg.selectAll("g.point").data(processedData, function(d) { return d.id; })

    circles.exit().remove();

    let groups = circles.enter().append("g").attr("class", "point")
      // groups.append("circle").attr("class", "dot")
      groups.append("circle").attr("class", "heatmap").style("fill", "url(#radial-gradient)");


    circles = groups.merge(circles);
    circles
      .attr("transform",d=> {const loc = projection([d.lng,d.lat]); return `translate(${loc[0]},${loc[1]})`})
    // circles.selectAll(".dot")
    //   .attr("r", 2)
    circles.selectAll(".heatmap")
      .attr("r", 5)
        


   // debugger
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
   
    projection.scale( 1600 );
    projection.center([8.8578, 46.9762])

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