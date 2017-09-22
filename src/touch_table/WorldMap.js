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

  //----------------------------------------------------------------------------
  // constructor(props) {
  //   super(props);
  //   // this.state = {todayYear: new Date().getFullYear()};
  // }

  //----------------------------------------------------------------------------
  componentDidMount() {
    let svg = d3.select(".map").append("svg")
    .attr("width", "100%")
    .attr("height", "100%");
    
    let g = svg.append("g")

    const projection = this.getProjection();
    const path = d3.geoPath().projection( projection );
  
    g.selectAll( 'path.land' )
        .data( topojson.feature( mapData, mapData.objects.countries ).features )
        .enter().append( 'path' )
        .attr( 'class', 'land' )
        .attr( 'd', path );
    this.setState({svg: g})

    this.addGradients(svg)

  }

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

    const processedData = this.processData(eventData, nextProps.currentYear);
    const projection = this.getProjection(nextProps.currentYear);

    const year = nextProps.currentYear;
    let eventIcons = this.state.svg.selectAll("g.event_icon").data(processedData, d=>d.idVal)

    eventIcons.exit().remove();

    const maxScale  = 1
    const minScale  = 0.27
    const startYear = 1870
    const endYear   = 1925
    const startX = 0
    const startY = 0
    const endX = 1100
    const endY = 250
    
    let realScale = maxScale;
    let xPos = 0
    let yPos = 0
    // if (year <= startYear) { realScale = maxScale}
    if (year > startYear && year <= endYear) {
     realScale = maxScale - (maxScale - minScale)/(endYear-startYear)*(year-startYear)
     xPos = startX - (startX - endX)/(endYear-startYear)*(year-startYear)
     yPos = startY - (startY - endY)/(endYear-startYear)*(year-startYear)
    }
    if ( year > endYear) { 
      realScale = minScale
      xPos = endX
      yPos = endY
    }



    let newIcons = eventIcons.enter()
      .append("g").attr("class", "event_icon")
    newIcons.append("circle")
      .attr("class", "heatmap")
      .style("fill", "url(#radial-gradient)")
    newIcons.append("line")
      .attr("class", "transitLine")
      // .style("stroke", "url(#transit-gradient)")
      // .style("stroke-width", 1)

    var trans = d3.transition()
    .duration(200)
    .ease(d3.easeLinear);

    function getLen(d) {
      let x2 = projection([d.prevLng,d.prevLat])[0]
      let y2 = projection([d.prevLng,d.prevLat])[1]

      let x1 = projection([d.lng,d.lat])[0]
      let y1 = projection([d.lng,d.lat])[1]

      return Math.sqrt((x2-x1)*(x2-x1)+((y2-y1)*(y2-y1)));
    }

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
        // projection([d.lng,d.lat])[0]
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
      .attr("r", 5*(1/realScale))

    eventIcons.select(".transitLine")
      .attr("x1", d=> projection([d.lng,d.lat])[0])
      .attr("y1", d=> projection([d.lng,d.lat])[1])
      .attr("x2", d=> projection([d.prevLng,d.prevLng])[0])
      .attr("y2", d=> projection([d.prevLng,d.prevLat])[1])
      .attr("stroke-dasharray", d=>{
        return `2 ${getLen(d)-2}`
      })

      .transition(trans)
        .attr("opacity", d=>
          {
            //Math.max(0,(1-(year-d.year)*0.2)) 
            return (year-d.year >=5) ? 0 : 1
          })
        .attr("stroke-dashoffset", d=>{
          let offsetYear = year - d.year;
          if (offsetYear > 5 || year == d.year) {return 0} 
          return getLen(d)*offsetYear*0.2;
        })
        .attr("stroke-width", 2*1/realScale)

    this.state.svg
      .transition(trans)
      .attr("transform", `translate(${xPos},${yPos}) scale(${realScale})`)
      .attr("stroke-width", 1*(1/realScale))
    // this.state.path.projection(projection);
  }

  //----------------------------------------------------------------------------
  shouldComponentUpdate() {return false}

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
  getProjection(year) {
    var jMap = $(".map");
    const height = jMap.height();
    const width = jMap.width();

    let scale = 1;
    

    const offset = [width / 2, height / 2 ];
    const projection = d3.geoEquirectangular()
                         .scale( scale )
                         .rotate( [0,0] )
                         .center([0,5])
                         .translate( offset );
   

    projection.scale( 2100 );
    projection.center([6.8578, 47.9762])

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
        .attr("stop-color", "rgba(0,0,0,0.05)");
    radialGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(0,0,0,0)");   

    // let linearGradient = defs.append("radialGradient")
    //     .attr("id", "transit-gradient");

    // linearGradient.append("stop")
    //     .attr("offset", "0%")
    //     .attr("stop-color", "rgba(0,0,0,.75)");

    // // linearGradient.append("stop")
    // //     .attr("offset", "100%")
    // //     .attr("stop-color", "rgba(0,0,0,.1)");   
  }

}

export default WorldMap;