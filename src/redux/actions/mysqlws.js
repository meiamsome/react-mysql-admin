import mysqlws from 'mysqlws';

import FETCH from './fetch';

export const SOCKET = 'SOCKET';
export const POOL = 'POOL';
export const QUERY = 'QUERY';

export function initialize(address) {
  return {
    type: SOCKET,
    payload: new mysqlws(address),
  }
}

export function createPool(pool_options) {
  return (dispatch, getState) => {
    let mysql = getState().mysqlws.mysql;
    let pool = mysql.createPool(pool_options);

    dispatch({
      type: POOL,
      payload: {
        status: FETCH.FETCHING,
        result: pool,
      },
    });

    pool.getConnection((err, connection) => {
      if(err) {
        dispatch({
          type: POOL,
          payload: {
            status: FETCH.ERROR,
            result: err,
          },
          error: true,
        });
      } else {
        dispatch({
          type: POOL,
          payload: {
            status: FETCH.SUCCESS,
            result: pool,
          },
        });
        connection.release();
      }
    });
  }
}

export function query(q) {
  return (dispatch, getState) => {
    let pool = getState().mysqlws.pool.result;
    let query_id = getState().mysqlws.queries.length;
    dispatch({
      type: QUERY,
      payload: {
        status: FETCH.FETCHING,
        result: null,
      },
      meta: {
        id: query_id,
      },
    });

    pool.getConnection((err, connection) => {
      if(err) {
        dispatch({
          type: QUERY,
          payload: {
            status: FETCH.ERROR,
            result: err,
          },
          error: true,
          meta: {
            id: query_id,
          },
        });
      } else {
        connection.query(q, (err, results, fields) => {
          if(err) {
            dispatch({
              type: QUERY,
              payload: {
                status: FETCH.ERROR,
                result: err,
              },
              error: true,
              meta: {
                id: query_id,
              },
            });
          } else {
            dispatch({
              type: QUERY,
              payload: {
                status: FETCH.SUCCESS,
                result: {
                  results: results,
                  fields: fields,
                },
              },
              meta: {
                id: query_id,
              },
            });
          }
          connection.release();
        });
      }
    });
  }
}
