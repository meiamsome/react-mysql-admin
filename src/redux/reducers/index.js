import { combineReducers } from 'redux';

import mysqlws_reducer from './mysqlws';

const reducers = combineReducers({
  mysqlws: mysqlws_reducer,
});

export default reducers;
