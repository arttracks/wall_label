import React from 'react';
import './Tombstone.css';

export default function(props) {

  return (
    <div className="tombstone">
      <div className="artist">{props.data.artist}</div>
      <div className="nationality">{props.data.nationality}, {props.data.life_dates}</div>
      <div className="title">{props.data.title}, <span className='life_dates'>{props.data.creation_date}</span></div>
      <div className="medium">{props.data.medium}</div>
       <div className="credit_line">{props.data.credit_line} {props.data.accession_number}</div>
    </div>
  )
}
