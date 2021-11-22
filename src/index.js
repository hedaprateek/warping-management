import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Font } from '@react-pdf/renderer'
import m1reg from './fonts/mplus-1m-regular-webfont.ttf';
import m1bold from './fonts/mplus-1m-bold-webfont.ttf';

Font.register({ family: 'm1', src: m1reg, fontStyle: 'normal', fontWeight: 'normal'});
Font.register({ family: 'm1', src: m1bold, fontStyle: 'normal', fontWeight: 'bold'});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
