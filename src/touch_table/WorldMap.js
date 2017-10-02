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

  // Append the SVG for D3 and do the basic setup for it
  //----------------------------------------------------------------------------
  componentDidMount() {


    const svg = d3.select(".map").append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

    this.addGradients(svg)
    const projection = this.getProjection();
    const path = d3.geoPath().projection(projection);
    const g = svg.append("g")

    g.append("g")
        .attr("class","landforms")
        .selectAll( 'path.land' )
        .data( topojson.feature( mapData, mapData.objects.countries ).features )
        .enter().append( 'path' )
        .attr( 'class', 'land' )
        .attr( 'd', path );


    g.append("text")
      .attr("class", "london map-label")
      .text( "London")

    g.append("text")
      .attr("class", "pgh map-label")
      .text( "Pittsburgh")

    this.setState({
      d3Object: g,
      projection: projection
    })
  }

  // Prevent React from ever rendering this, since we're using D3 instead
  //----------------------------------------------------------------------------
  shouldComponentUpdate() {return false}

  // Build the data object, using the provided data and the current year
  //----------------------------------------------------------------------------
  processData(data, currentYear) {

    return data.map( e=> {

      const firstValid = e.events.findIndex(event => event.year <= currentYear)
      if (firstValid === -1) {return null}

      let lastValid = e.events.findIndex(event => event.year > currentYear) -1
      if (lastValid === -2) {lastValid = (e.events.length -1)}

      let returnValue = {
        idVal:   e.id,
        lat:  e.events[lastValid].lat,
        lng:  e.events[lastValid].lng,
        year: e.events[lastValid].year,
        lastValid: lastValid
      }
      if (lastValid > 0) {
        returnValue.prevLat = e.events[lastValid-1].lat
        returnValue.prevLng = e.events[lastValid-1].lng
      }
      else {
       returnValue.prevLat = e.events[lastValid].lat
       returnValue.prevLng = e.events[lastValid].lng
      }
      return returnValue
    }).filter(n => n)
  }


  //----------------------------------------------------------------------------
  componentWillReceiveProps(nextProps) {

    // Configuration
    const maxScale  = 1
    const minScale  = 0.27
    const startYear = 1870
    const endYear   = 1925
    const startX    = 0
    const startY    = 0
    const endX      = 1100
    const endY      = 250

    // Nice names for regularly-used variables
    const processedData = this.processData(eventData, nextProps.currentYear);
    const projection = this.state.projection;
    const trans = d3.transition().duration(200).ease(d3.easeLinear);
    const year = nextProps.currentYear;

    // Helper function for computing length of the
    function getLen(d) {
      let x2 = projection([d.prevLng,d.prevLat])[0]
      let y2 = projection([d.prevLng,d.prevLat])[1]

      let x1 = projection([d.lng,d.lat])[0]
      let y1 = projection([d.lng,d.lat])[1]

      return Math.sqrt((x2-x1)*(x2-x1)+((y2-y1)*(y2-y1)));
    }

    // Calculate the current global x, y, and scale
    let realScale = maxScale;
    let xPos = 0
    let yPos = 0
    if (year > startYear && year <= endYear) {
     realScale = maxScale - (maxScale - minScale)/(endYear-startYear)*(year-startYear)
     xPos = startX - (startX - endX)/(endYear-startYear)*(year-startYear)
     yPos = startY - (startY - endY)/(endYear-startYear)*(year-startYear)
    }
    else if ( year > endYear) {
      realScale = minScale
      xPos = endX
      yPos = endY
    }

    let pghPos = [-79.995888,40.440624];
    let londonPos  = [-0.146041,51.501122];
    this.state.d3Object.select(".london")
      .attr("x", projection(londonPos)[0]+15*(1/realScale))
      .attr("y", projection(londonPos)[1]+4*(1/realScale))
      .attr("transform", `rotate(-30,${projection(londonPos)[0]},${projection(londonPos)[1]})`)
      .style("font-size", `${14*(1/realScale)}px`)

    this.state.d3Object.select(".pgh")
      .attr("x", projection(pghPos)[0]+15*(1/realScale))
      .attr("y", projection(pghPos)[1]+4*(1/realScale))
      .attr("transform", `rotate(-30,${projection(pghPos)[0]},${projection(pghPos)[1]})`)
      .style("font-size", `${14*(1/realScale)}px`)


    // D3 for the little circles
    let eventIcons = this.state.d3Object.selectAll("g.event_icon").data(processedData, d=>d.idVal)

    // On exit, for the circles
    eventIcons.exit().remove();

    // On enter, fro the circles
    let newIcons = eventIcons.enter()
      .append("g").attr("class", "event_icon")
    newIcons.append("circle")
      .attr("class", "heatmap")
    newIcons.append("line")
      .attr("class", "transitLine")

    // On update, for the circles
    eventIcons = newIcons.merge(eventIcons)
      .attr("data-debug", d=>`${JSON.stringify(d)}`)
    eventIcons.select(".heatmap")
      .attr("cx", d=> {
        if (year-d.year >5)  {
          return projection([d.lng,d.lat])[0]
        }
        else if (year-d.year<=0) {
          return projection([d.prevLng,d.prevLat])[0]
        }
        return -1000
      })
      .attr("cy", d=> {
        if (year-d.year >5)  {
          return projection([d.lng,d.lat])[1]
        }
        else if (year-d.year<0) {
          return projection([d.prevLng,d.prevLat])[1]
        }
        return -1000
      })
      .attr("r", 10*(1/realScale))
      .style("fill", d=> [5,61,211,231,254,277,278].includes(d.idVal) ? "url(#special-radial-gradient)" : "url(#radial-gradient)")
      .attr("z-index", d=> [5,61,211,231,254,277,278].includes(d.idVal) ? 1 : 0)

    // D3 for the lines
    eventIcons.select(".transitLine")
      .attr("x1", d=> projection([d.lng,d.lat])[0])
      .attr("y1", d=> projection([d.lng,d.lat])[1])
      .attr("x2", d=> projection([d.prevLng,d.prevLng])[0])
      .attr("y2", d=> projection([d.prevLng,d.prevLat])[1])
      .attr("stroke-dasharray", d=> `2 ${getLen(d)-2}`)
      .style("stroke", d=> [5,61,211,231,254,277,278].includes(d.idVal) ? "#FF0000" : "#000000")
      .transition(trans)
        .attr("display", d=> (year-d.year >5) ? "none" : "block")
        .attr("stroke-dashoffset", d=>{
          let offsetYear = year - d.year;
          if (offsetYear > 5 || year === d.year) {return 0}
          return getLen(d)*offsetYear*0.2;
        })
        .attr("stroke-width", 2*1/realScale)

    // Move the global object
      this.state.d3Object
        .transition(trans)
        .attr("transform", `translate(${xPos},${yPos}) scale(${realScale})`)
        .attr("stroke-width", 1*(1/realScale))
  }


  //----------------------------------------------------------------------------
  render() {
    return (
      <div className="map" onClick={()=> {$(".overlay").show(); return false} }></div>
    )
  }

  //--------------------
  // UTILITY METHODS   |
  //--------------------

  //----------------------------------------------------------------------------
  getProjection() {
    var jMap = $(".map");
    const offset = [jMap.width()/2, jMap.height()/2 ];
    const projection = d3.geoEquirectangular()
      .translate( offset )
      .scale( 2100 )
      .center([6.8578, 47.9762]);

    return projection;
  }

  //----------------------------------------------------------------------------
  addGradients(svg) {
    let defs = svg.append("defs")

    let radialGradient = defs.append("radialGradient")
        .attr("id", "radial-gradient");

    radialGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(0,0,0,1)");
    radialGradient.append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "rgba(0,0,0,0.025)");

    let specialRadialGradient = defs.append("radialGradient")
        .attr("id", "special-radial-gradient");

    specialRadialGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(255,0,0,1)");
    specialRadialGradient.append("stop")
        .attr("offset", "20%")
        .attr("stop-color", "rgba(255,0,0,0.025)");
  }

}

export default WorldMap;
