import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// Block touchMove and Selection events for visual clarity
$("body").on('touchmove',function(event){
  event.preventDefault();
  return false;
});
$("body").on('selectstart',function(event){
  event.preventDefault();
  return false;
});
