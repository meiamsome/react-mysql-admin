import React from 'react';
import { connect } from 'react-redux';

import FETCH from '../redux/actions/fetch';
import { query } from '../redux/actions/mysqlws';

import QueryResultTable from './QueryResultTable';

class Dashboard extends React.Component {
  componentWillMount() {
    let query = "SHOW STATUS";
    this.props.query(query);
    setInterval(() => {
      this.props.query(query);
    }, 10000);
  }
  render() {
    let last_query = this.props.queries[this.props.queries.length - 1];
    if(last_query === undefined || last_query.status === FETCH.FETCHING) {
      return (
        <div>fetching</div>
      );
    }
    if(last_query.status === FETCH.ERROR) {
      return (
        <div>Error: {last_query.result.sqlMessage}</div>
      );
    }
    return (
      <QueryResultTable
        query={last_query}
        selectable={false}
        />
    )
  }
}

export default connect(
  state => {
    return {
      queries: state.mysqlws.queries,
    };
  },
  dispatch => {
    return {
      query: (q) => dispatch(query(q)),
    }
  }
)(Dashboard);
