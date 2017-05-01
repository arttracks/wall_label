import React from 'react';
import './Tombstone.css';

export default function(props) {

  return (
    <div className="tombstone">
      <div className="artist">Frans Hals</div>
      <div className="nationality">Dutch, 1581-1585–08/29/1666</div>
      <div className="title">Pieter Cornelisz. van der Morsch, <span className='life_dates'>1616</span></div>
      <div className="medium">oil on canvas, transferred from panel</div>
       <div className="credit_line">Acquired through the generosity of Mrs. Alan M. Scaife. 61.42.2</div>
    </div>
  )
}
