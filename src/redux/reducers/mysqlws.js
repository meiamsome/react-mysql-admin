import {
  SOCKET,
  POOL,
  QUERY,
} from '../actions/mysqlws';

function mysqlws_reducer(state = {
  mysql: null,
  pool: null,
  queries: [],
}, action) {
  switch(action.type) {
    case SOCKET:
      return {
        ...state,
        mysql: action.payload,
      }
    case POOL:
      return {
        ...state,
        pool: action.payload,
      }
    case QUERY:
      let id = action.meta.id;
      let queries = state.queries.slice();
      queries[id] = action.payload;
      return {
        ...state,
        queries: queries,
      }
    default:
      return state;
  }
}

export default mysqlws_reducer;
