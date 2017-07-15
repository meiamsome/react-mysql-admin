import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './index.css';
import Connect from './components/Connect';
import registerServiceWorker from './registerServiceWorker';
import reducers from './redux/reducers';

let store = createStore(reducers, applyMiddleware(thunkMiddleware));

ReactDOM.render(
<Provider store={store}>
  <MuiThemeProvider>
    <Connect />
  </MuiThemeProvider>
</Provider>, document.getElementById('root'));
registerServiceWorker();
