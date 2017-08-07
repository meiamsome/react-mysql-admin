import {
  SOCKET,
  POOL,
  QUERY,
} from '../actions/mysqlws';

function mysqlws_reducer(state = {
  mysql: null,
  pool: null,
  next_query_id: 0,
  queries: {},
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
      let new_id = state.next_query_id;
      if(id === new_id) new_id ++;
      return {
        ...state,
        next_query_id: new_id,
        queries: {
          ...state.queries,
          [id]: action.payload,
        },
      }
    default:
      return state;
  }
}

export default mysqlws_reducer;
