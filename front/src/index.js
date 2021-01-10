import React from 'react';
import './index.css';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './redux/store'
import DD5App from './DD5App';


ReactDOM.render(
  <Provider store={store}>
    <DD5App/>
  </Provider>,
  document.getElementById('root')
);