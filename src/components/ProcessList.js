import React from 'react';
import { connect } from 'react-redux';

import FETCH from '../redux/actions/fetch';
import { query } from '../redux/actions/mysqlws';

import QueryResultTable from './QueryResultTable';

class ServerStatus extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      query_id: null,
      next_query_id: null,
    }
  }

  updateMyId(id) {
    if(this.state.query_id === null) {
      this.setState({
        query_id: id,
      });
    }
    this.setState({
      next_query_id: id,
    });
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.next_query_id !== null) {
      let next_query = this.state.next_query_id;
      if(nextProps.queries[next_query].status !== FETCH.FETCHING) {
        this.setState({
          query_id: next_query,
          next_query_id: null,
        });
      }
    }
  }

  componentWillMount() {
    let query = "SHOW PROCESSLIST";
    this.props.query(query, (id) => this.updateMyId(id));
  }


  render() {
    let my_query = this.props.queries[this.state.query_id];
    if(my_query === undefined || my_query.status === FETCH.FETCHING) {
      return (
        <div>fetching</div>
      );
    }
    if(my_query.status === FETCH.ERROR) {
      return (
        <div>Error: {my_query.result.sqlMessage}</div>
      );
    }
    return (
      <QueryResultTable
        query={my_query}
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
      query: (q, cb) => dispatch(query(q, cb)),
    }
  }
)(ServerStatus);
